import { AuditFilters, AuditEvent, AuditEventPage, FilterField } from "@/types/audit";
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "../../server/src/shared/auditConstants";

enum ApiQueryParam {
  PAGE = "page",
  SORT = "sort",
  ORDER = "order",
  SEARCH_INPUT = "searchInput",
  EXACT_SEARCH = "exactSearch",
  SEARCH_TYPE = "searchType",
  ACTOR_SEARCH = "actorSearch",
  TARGET_SEARCH = "targetSearch",
  RESOURCE_SEARCH = "resourceSearch",
  PREMADE_PROFILE = "premadeProfile",
  ACTOR_USERNAME = "actorUsername",
  ACTION = "action",
  DATE_FROM = "from",
  DATE_TO = "to",
  CATEGORY = "category",
}

interface FetchAuditEventsParams {
  page: number;
  pageSize?: number;
  filters: AuditFilters;
}

/**
 * Custom fetch wrapper that includes credentials, handles retries, and manages 401 redirection.
 */
export async function fetchWithCreds(
  input: string | URL | Request,
  init?: RequestInit,
  retries = 3,
): Promise<Response> {
  const options: RequestInit = {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  };

  try {
    const response = await fetch(input, options);

    // Handle 401 Unauthorized - redirect to /auth
    if (response.status === 401) {
      window.location.href = `/auth?comeback=${encodeURIComponent(window.location.href)}`;
      return new Promise(() => { }); // Stop further execution
    }

    // Handle 5xx Server Errors with retries
    if (response.status >= 500 && retries > 0) {
      console.warn(`Retrying due to server error ${response.status}... (${retries} attempts left)`);
      return fetchWithCreds(input, init, retries - 1);
    }

    return response;
  } catch (error) {
    // Handle Network Errors with retries
    if (retries > 0) {
      console.warn(`Retrying due to network error... (${retries} attempts left)`, error);
      return fetchWithCreds(input, init, retries - 1);
    }
    throw error;
  }
}

export async function fetchAuditEvents({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  filters,
}: FetchAuditEventsParams): Promise<AuditEventPage> {
  const params = new URLSearchParams();

  // Pagination
  params.append(ApiQueryParam.PAGE, page.toString());
  params.append("pageSize", pageSize.toString());

  // Sorting
  params.append(ApiQueryParam.SORT, "created_at");
  params.append(ApiQueryParam.ORDER, "desc");

  // Filters mapping
  if (
    filters[FilterField.SEARCH_INPUT] &&
    filters[FilterField.SEARCH_INPUT].length > 0
  ) {
    if (Array.isArray(filters[FilterField.SEARCH_INPUT])) {
      filters[FilterField.SEARCH_INPUT].forEach((term) =>
        params.append(ApiQueryParam.SEARCH_INPUT, term),
      );
    } else {
      params.append(
        ApiQueryParam.SEARCH_INPUT,
        filters[FilterField.SEARCH_INPUT],
      );
    }

    if (filters[FilterField.SEARCH_INPUT_IS_EXACT]) {
      params.append(ApiQueryParam.EXACT_SEARCH, "true");
      if (filters[FilterField.SEARCH_INPUT_TYPE]) {
        params.append(
          ApiQueryParam.SEARCH_TYPE,
          filters[FilterField.SEARCH_INPUT_TYPE],
        );
      }
    }
  }
  if (filters[FilterField.ACTOR_SEARCH]) {
    params.append(
      ApiQueryParam.ACTOR_SEARCH,
      filters[FilterField.ACTOR_SEARCH],
    );
  }
  if (filters[FilterField.TARGET_SEARCH]) {
    params.append(
      ApiQueryParam.TARGET_SEARCH,
      filters[FilterField.TARGET_SEARCH],
    );
  }
  if (filters[FilterField.RESOURCE_SEARCH]) {
    params.append(
      ApiQueryParam.RESOURCE_SEARCH,
      filters[FilterField.RESOURCE_SEARCH],
    );
  }
  if (filters[FilterField.PREMADE_PROFILE]) {
    params.append(
      ApiQueryParam.PREMADE_PROFILE,
      filters[FilterField.PREMADE_PROFILE],
    );
  }

  if (filters[FilterField.ACTOR_USERNAME]) {
    params.append(
      ApiQueryParam.ACTOR_USERNAME,
      filters[FilterField.ACTOR_USERNAME],
    );
  }

  if (filters[FilterField.ACTION]) {
    if (Array.isArray(filters[FilterField.ACTION])) {
      filters[FilterField.ACTION].forEach((a) =>
        params.append(ApiQueryParam.ACTION, a),
      );
    } else {
      params.append(ApiQueryParam.ACTION, filters[FilterField.ACTION]);
    }
  }

  if (filters[FilterField.DATE_FROM]) {
    params.append(
      ApiQueryParam.DATE_FROM,
      filters[FilterField.DATE_FROM].toISOString(),
    );
  }

  if (filters[FilterField.DATE_TO]) {
    params.append(
      ApiQueryParam.DATE_TO,
      filters[FilterField.DATE_TO].toISOString(),
    );
  }

  if (filters[FilterField.CATEGORY]) {
    if (Array.isArray(filters[FilterField.CATEGORY])) {
      filters[FilterField.CATEGORY].forEach((c) =>
        params.append(ApiQueryParam.CATEGORY, c),
      );
    } else {
      params.append(ApiQueryParam.CATEGORY, filters[FilterField.CATEGORY]);
    }
  }

  const response = await fetchWithCreds(`/audit/events?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches all audit events matching the filters by iterating through pages.
 */
export async function fetchAllAuditEvents(filters: AuditFilters): Promise<AuditEvent[]> {
  const allEvents: AuditEvent[] = [];
  let currentPage = 1;
  const PAGE_SIZE = MAX_PAGE_SIZE;

  while (true) {
    const response = await fetchAuditEvents({
      page: currentPage,
      pageSize: PAGE_SIZE,
      filters,
    });

    allEvents.push(...response.items);

    if (response.items.length < PAGE_SIZE) {
      break;
    }
    currentPage++;
  }

  return allEvents;
}

export async function fetchAuditEventById(id: string) {
  const response = await fetchWithCreds(`/audit/events/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export async function fetchPremadeProfiles(): Promise<
  { id: string; name: string }[]
> {
  const response = await fetchWithCreds(`/audit/premade-profiles`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export interface SuggestionResult {
  id: string;
  name: string | null;
  type: string;
}

export async function fetchSuggestions(
  term: string,
  page = 1,
  limit = 50,
): Promise<SuggestionResult[]> {
  if (!term) return [];
  try {
    const response = await fetchWithCreds(
      `/audit/suggest?term=${encodeURIComponent(term)}&page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}
