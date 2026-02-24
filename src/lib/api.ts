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

export async function fetchAuditEvents({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  filters,
}: FetchAuditEventsParams): Promise<AuditEventPage> {
  const params = new URLSearchParams();

  // Pagination
  params.append(ApiQueryParam.PAGE, page.toString());
  params.append("pageSize", pageSize.toString());

  // Sorting (Defaulting to created_at desc as per spec default is desc, field created_at seems appropriate)
  params.append(ApiQueryParam.SORT, "created_at");
  params.append(ApiQueryParam.ORDER, "desc");

  // Filters mapping (Fixed params according to API spec)
  if (
    filters[FilterField.SEARCH_INPUT] &&
    filters[FilterField.SEARCH_INPUT].length > 0
  ) {
    if (Array.isArray(filters[FilterField.SEARCH_INPUT])) {
      filters[FilterField.SEARCH_INPUT].forEach((term) =>
        params.append(ApiQueryParam.SEARCH_INPUT, term),
      );
    } else {
      // Fallback or legacy support if needed, though type is string[]
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

  const response = await fetch(`/audit/events?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': 'Bearer ...' // No auth logic as per constraints.
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
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
  const response = await fetch(`/audit/events/${id}`);
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
  const response = await fetch(`/audit/premade-profiles`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export interface SuggestionResult {
  id: string;
  name: string | null;
  type: string; // The category ID (e.g. USER, SHOS, etc.)
}

export async function fetchSuggestions(
  term: string,
  page = 1,
  limit = 50,
): Promise<SuggestionResult[]> {
  if (!term) return [];
  try {
    const response = await fetch(
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
