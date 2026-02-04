import { AuditEvent, AuditEventPage, AuditQueryParams } from "../types/audit";
import {
  GET_AUDIT_EVENTS_QUERY,
  GET_AUDIT_EVENT_BY_ID_QUERY,
  GET_SUGGESTIONS_QUERY,
  DELETE_AUDIT_HISTORY_MUTATION,
} from "../GQL/auditQueries";
import {
  GET_PREMADE_PROFILES_QUERY,
  GET_PROFILE_VALUES_QUERY,
} from "../GQL/profileQueries";
import {
  parseAuditEventsResponse,
  parseAuditEventByIdResponse,
  parseSuggestionsResponse,
} from "../parsers/auditParser";
import {
  parsePremadeProfilesResponse,
  parseProfileValuesResponse,
} from "../parsers/profileParser";
import { PerformQuery } from "../../sdks/performQuery";
import { getRlsFilters } from "../utils/auth";

/**
 * Business logic layer for audit events
 * Handles data access via PostGraphile GraphQL
 */
/**
 * Get paginated and filtered audit events
 */
export const getEvents = async (
  params: AuditQueryParams,
  performQuery: PerformQuery,
  userId: string,
): Promise<AuditEventPage> => {
  // 1. Construct Filter Object
  const filter: Record<string, unknown> = {};
  const andFilters: Record<string, unknown>[] = [];

  // Apply RLS Filters
  const rls = getRlsFilters(userId);
  if (rls) {
    andFilters.push(rls);
  }

  if (params.from) {
    andFilters.push({
      insertTime: { greaterThanOrEqualTo: new Date(params.from).getTime() },
    });
  }
  if (params.to) {
    andFilters.push({
      insertTime: { lessThanOrEqualTo: new Date(params.to).getTime() },
    });
  }
  if (params.actorUsername) {
    andFilters.push({
      executorId: { includesInsensitive: params.actorUsername },
    });
  }
  if (params.category && params.category.length > 0) {
    andFilters.push({ targetType: { in: params.category } });
  }
  if (params.action && params.action.length > 0) {
    andFilters.push({ midurAction: { in: params.action } });
  }

  // Search Inputs (OR logic)
  if (params.actorSearch) {
    andFilters.push({
      or: [{ executorId: { includesInsensitive: params.actorSearch } }],
    });
  }

  if (params.targetSearch) {
    andFilters.push({
      or: [{ targetId: { includesInsensitive: params.targetSearch } }],
    });
  }

  if (params.resourceSearch) {
    andFilters.push({
      resourceId: { includesInsensitive: params.resourceSearch },
    });
  }

  if (params.premadeProfile) {
    const profileValuesResult = (await performQuery(GET_PROFILE_VALUES_QUERY, {
      condition: { profileId: params.premadeProfile },
    })) as Record<string, unknown>;

    const values = parseProfileValuesResponse(profileValuesResult);

    if (values.length > 0) {
      andFilters.push({
        resourceId: { in: values },
      });
    } else {
      // If profile has no values, don't match anything
      andFilters.push({ resourceId: { equalTo: "___NONE___" } });
    }
  }

  if (params.searchInput) {
    const term = params.searchInput;
    if (params.exactSearch) {
      const searchType = params.searchType;
      if (searchType) {
        const typeFilters: Record<string, unknown>[] = [];
        // Only filter by type if relevant. 'USER' type was related to executor but executorType is gone.
        // Assuming 'searchType' was checking executorType, targetType, or resourceType.

        // For executor, we can't check type anymore efficiently unless we infer it (always USER).
        // Or if the searchType is USER, we check executorId.
        if (searchType === "USER") {
          typeFilters.push({ executorId: { equalTo: term } });
        }

        typeFilters.push({
          and: [
            { targetId: { equalTo: term } },
            { targetType: { equalTo: searchType } },
          ],
        });
        typeFilters.push({
          and: [
            { resourceId: { equalTo: term } },
            { resourceType: { equalTo: searchType } },
          ],
        });
        andFilters.push({ or: typeFilters });
      } else {
        andFilters.push({
          or: [
            { executorId: { equalTo: term } },
            { targetId: { equalTo: term } },
            { resourceId: { equalTo: term } },
          ],
        });
      }
    } else {
      andFilters.push({
        or: [
          { actionId: { includesInsensitive: term } },
          { executorId: { includesInsensitive: term } },
          { executorName: { includesInsensitive: term } },
          { targetId: { includesInsensitive: term } },
          { targetName: { includesInsensitive: term } },
          { resourceId: { includesInsensitive: term } },
          { resourceName: { includesInsensitive: term } },
        ],
      });
    }
  }

  if (andFilters.length > 0) {
    filter.and = andFilters;
  }

  // 2. Pagination & Sorting
  const first = 10; // Default page size
  const offset = ((params.page || 1) - 1) * first;

  let orderBy = "INSERT_TIME_DESC"; // Default sort
  if (params.sort) {
    const direction = params.order === "asc" ? "ASC" : "DESC";
    switch (params.sort) {
      case "created_at":
        orderBy = `INSERT_TIME_${direction}`;
        break;
      case "action":
        orderBy = `MIDUR_ACTION_${direction}`;
        break;
      case "actor_username":
        orderBy = `EXECUTOR_ID_${direction}`;
        break;
      case "target_name":
        orderBy = `TARGET_ID_${direction}`;
        break;
      default:
        orderBy = `INSERT_TIME_${direction}`;
    }
  }

  // 3. Execute GraphQL Query
  const variables: Record<string, unknown> = {
    first,
    offset,
    orderBy: [orderBy],
  };

  // Only include filter if it has conditions
  if (andFilters.length > 0) {
    variables.filter = filter;
  }

  const result = await performQuery(GET_AUDIT_EVENTS_QUERY, variables);

  // 4. Parse and return response
  return parseAuditEventsResponse(
    result as Record<string, unknown>,
    params.page || 1,
  );
};

/**
 * Get single audit event by ID
 */
export const getEventById = async (
  id: string,
  performQuery: PerformQuery,
): Promise<AuditEvent | null> => {
  const result = await performQuery(GET_AUDIT_EVENT_BY_ID_QUERY, { id });

  return parseAuditEventByIdResponse(result as Record<string, unknown>);
};

/**
 * Get all premade profiles
 */
export const getPremadeProfiles = async (
  performQuery: PerformQuery,
): Promise<{ id: string; name: string }[]> => {
  const result = (await performQuery(GET_PREMADE_PROFILES_QUERY)) as Record<
    string,
    unknown
  >;

  return parsePremadeProfilesResponse(result);
};

/**
 * Get unique suggestions for autocomplete based on a search term
 */
export const getSuggestions = async (
  params: { term: string },
  performQuery: PerformQuery,
): Promise<unknown[]> => {
  const term = params.term;
  const filter = {
    or: [
      { executorId: { includesInsensitive: term } },
      { executorName: { includesInsensitive: term } },
      { targetId: { includesInsensitive: term } },
      { targetName: { includesInsensitive: term } },
      { resourceId: { includesInsensitive: term } },
      { resourceName: { includesInsensitive: term } },
    ],
  };

  const result = await performQuery(GET_SUGGESTIONS_QUERY, { filter });

  return parseSuggestionsResponse(result as Record<string, unknown>, term);
};

/**
 * Delete history records by time range
 */
export const deleteAuditHistory = async (
  performQuery: PerformQuery,
  startDate?: number,
  endDate?: number,
): Promise<number> => {
  const result = (await performQuery(DELETE_AUDIT_HISTORY_MUTATION, {
    startDate: startDate ? new Date(startDate).toISOString() : null,
    endDate: endDate ? new Date(endDate).toISOString() : null,
  })) as {
    errors?: Array<{ message: string }>;
    data?: { deleteAuditHistory?: { integer?: number } };
  };

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data?.deleteAuditHistory?.integer || 0;
};
