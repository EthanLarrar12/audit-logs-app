import { AuditEvent, AuditEventPage, AuditQueryParams } from "../types/audit";
import {
  GET_AUDIT_EVENTS_QUERY,
  GET_AUDIT_EVENT_BY_ID_QUERY,
  GET_SEARCH_FILTERS_QUERY, // Updated query
  DELETE_AUDIT_HISTORY_MUTATION,
} from "../GQL/auditQueries";
import {
  GET_PREMADE_PROFILES_QUERY,
  GET_PROFILE_VALUES_QUERY,
} from "../GQL/profileQueries";
import {
  parseAuditEventsResponse,
  parseAuditEventByIdResponse,
  parseSearchFiltersResponse, // Updated parser
} from "../parsers/auditParser";
import {
  parsePremadeProfilesResponse,
  parseProfileValuesResponse,
} from "../parsers/profileParser";
import { PerformQuery } from "../../sdks/performQuery";
import { getRlsFilters } from "../utils/auth";
import { BadGatewayException } from "../../sdks/exceptions";
import { isPermitted, Permissions } from "../../sdks/STS"; // Added STS import
import { GET_USER_ALLOWED_PARAMETERS_QUERY } from "../GQL/profileQueries"; // Added query import
import { parseUserAllowedParametersResponse } from "../parsers/profileParser"; // Added parser import
import { MirageObjectType } from "../types/mirage"; // Added MirageObjectType import
import { CATEGORY_PERMISSIONS } from "../constants/permissions"; // Added permissions import

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

  // Compartmentalization Logic for Parameters is now handled in the allowed categories section

  // --- Category (Target Type) Permission Check ---

  // --- Category (Target Type) Permission Check ---

  // Permissions are defined in server/src/constants/permissions.ts
  // Default behavior is DENY if not listed there

  const allowedCategories: MirageObjectType[] = [];

  for (const type of Object.values(MirageObjectType)) {
    const requiredPermissions = CATEGORY_PERMISSIONS[type];
    if (requiredPermissions) {
      if (isPermitted(requiredPermissions)) {
        allowedCategories.push(type);
      }
    }
  }

  if (params.action && params.action.length > 0) {
    andFilters.push({ midurAction: { in: params.action } });
  }

  // Search Inputs (OR logic)
  if (params.actorSearch) {
    andFilters.push({
      and: [
        { executorId: { includesInsensitive: params.actorSearch } },
        { executorType: { equalTo: "USER" } },
      ],
    });
  }

  // --- Parameter (Resource Type) Permission Check ---
  const canReadParams = isPermitted({ profilePermissions: ["read"] });
  if (!canReadParams) {
    // User cannot read parameters at all -> Exclude all parameters
    andFilters.push({
      resourceType: { notEqualTo: MirageObjectType.PARAMETER },
    });
  } else {
    const canUpdateParams = isPermitted({ profilePermissions: ["update"] });
    if (!canUpdateParams) {
      // User can read but not update -> Restrict to allowed parameters
      const allowedParamsResult = await performQuery(
        GET_USER_ALLOWED_PARAMETERS_QUERY,
        { userId },
      );
      const allowedParams = parseUserAllowedParametersResponse(
        allowedParamsResult as Record<string, unknown>,
      );
      const allowedIds = allowedParams.map((p) => p.valueId);

      if (allowedIds.length > 0) {
        andFilters.push({
          or: [
            { resourceType: { notEqualTo: MirageObjectType.PARAMETER } },
            {
              and: [
                { resourceType: { equalTo: MirageObjectType.PARAMETER } },
                { resourceId: { in: allowedIds } },
              ],
            },
          ],
        });
      } else {
        // Can read params but has no allowed IDs -> Exclude all parameters
        andFilters.push({
          resourceType: { notEqualTo: MirageObjectType.PARAMETER },
        });
      }
    }
  }

  // Apply the allowed categories filter
  // If user provided a specific category filter, we must intersect it with allowedCategories
  if (params.category && params.category.length > 0) {
    const requestedCategories = params.category;
    // Strict filtering: Only allow if explicitly requested AND permitted
    const permittedRequestedCategories = requestedCategories.filter((c) =>
      allowedCategories.includes(c as MirageObjectType),
    );

    if (permittedRequestedCategories.length === 0) {
      // User requested categories they are not allowed to see
      // Return a filter that matches nothing
      andFilters.push({ targetId: { equalTo: "___NONE___" } });
    } else {
      andFilters.push({ targetType: { in: permittedRequestedCategories } });
    }
  } else {
    // User did not request a specific category, so we restrict to ALL allowed categories
    // This ensures they don't see unauthorized types in the general list
    if (allowedCategories.length === 0) {
      andFilters.push({ targetId: { equalTo: "___NONE___" } });
    } else {
      andFilters.push({ targetType: { in: allowedCategories } });
    }
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

  if (params.searchInput && params.searchInput.length > 0) {
    const terms = params.searchInput;
    const exactSearch = params.exactSearch;
    const searchType = params.searchType;

    terms.forEach((term) => {
      if (exactSearch) {
        if (searchType) {
          const typeFilters: Record<string, unknown>[] = [];

          if (searchType === "USER") {
            typeFilters.push({
              and: [
                { executorId: { equalTo: term } },
                { executorType: { equalTo: searchType } },
              ],
            });
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
            { executorName: { includesInsensitive: term } },
            { targetName: { includesInsensitive: term } },
            { resourceName: { includesInsensitive: term } },
          ],
        });
      }
    });
  }

  if (andFilters.length > 0) {
    filter.and = andFilters;
  }

  // 2. Pagination & Sorting
  const rawPageSize = params.pageSize || 10; // Default to 10 (reverted per user request)
  const first = rawPageSize > 200 ? 200 : rawPageSize; // Max 200
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
  params: { term: string; page?: number; limit?: number },
  performQuery: PerformQuery,
): Promise<unknown[]> => {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const offset = (page - 1) * limit;

  const result = await performQuery(GET_SEARCH_FILTERS_QUERY, {
    searchTerm: params.term,
    resultLimit: limit,
    resultOffset: offset,
  });

  return parseSearchFiltersResponse(result as Record<string, unknown>);
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
    throw new BadGatewayException(result.errors[0].message);
  }

  return result.data?.deleteAuditHistory?.integer || 0;
};
