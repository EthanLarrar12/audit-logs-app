import { AuditQueryParams } from "../../types/audit";
import { MirageObjectType } from "../../types/mirage";
import { PerformQuery } from "../../../sdks/performQuery";
import { getRlsFilters } from "../../utils/auth";
import { isPermitted } from "../../../sdks/STS";
import { CATEGORY_PERMISSIONS } from "../../constants/permissions";
import {
  GET_PROFILE_VALUES_QUERY,
  GET_USER_ALLOWED_PARAMETERS_QUERY,
} from "../../GQL/profileQueries";
import {
  parseProfileValuesResponse,
  parseUserAllowedParametersResponse,
} from "../../parsers/profileParser";

/**
 * Build the PostGraphile filter object based on query parameters and permissions
 */
export const buildAuditFilters = async (
  params: AuditQueryParams,
  performQuery: PerformQuery,
  userId: string,
): Promise<Record<string, unknown>> => {
  const filter: Record<string, unknown> = {};
  const andFilters: Record<string, unknown>[] = [];

  // Apply RLS Filters
  const rls = getRlsFilters(userId);
  if (rls) {
    andFilters.push(rls);
  }

  // Date Range
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

  // Actor Username
  if (params.actorUsername) {
    andFilters.push({
      executorId: { includesInsensitive: params.actorUsername },
    });
  }

  // Action
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

  // --- Category (Target Type) Permission Check ---
  const allowedCategories: MirageObjectType[] = [];
  for (const type of Object.values(MirageObjectType)) {
    const requiredPermissions = CATEGORY_PERMISSIONS[type];
    if (requiredPermissions) {
      if (isPermitted(requiredPermissions)) {
        allowedCategories.push(type);
      }
    }
  }

  // Apply the allowed categories filter
  if (params.category && params.category.length > 0) {
    const requestedCategories = params.category;
    const permittedRequestedCategories = requestedCategories.filter((c) =>
      allowedCategories.includes(c as MirageObjectType),
    );

    if (permittedRequestedCategories.length === 0) {
      andFilters.push({ targetId: { equalTo: "___NONE___" } });
    } else {
      andFilters.push({ targetType: { in: permittedRequestedCategories } });
    }
  } else {
    if (allowedCategories.length === 0) {
      andFilters.push({ targetId: { equalTo: "___NONE___" } });
    } else {
      andFilters.push({ targetType: { in: allowedCategories } });
    }
  }

  // --- Parameter (Resource Type) Permission Check ---
  const canReadParams = isPermitted({ profilePermissions: ["read"] });
  if (!canReadParams) {
    andFilters.push({
      resourceType: { notEqualTo: MirageObjectType.PARAMETER },
    });
  } else {
    const canUpdateParams = isPermitted({ profilePermissions: ["update"] });
    if (!canUpdateParams) {
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
        andFilters.push({
          resourceType: { notEqualTo: MirageObjectType.PARAMETER },
        });
      }
    }
  }

  // --- Premade Profile Filter ---
  if (params.premadeProfile) {
    const profileValuesResult = (await performQuery(GET_PROFILE_VALUES_QUERY, {
      condition: { profileId: params.premadeProfile },
    })) as Record<string, unknown>;

    const values = parseProfileValuesResponse(profileValuesResult);

    if (values.length > 0) {
      // Map logic: if parameterId exists, it's a PARAMETER, so use parameterId:valueId
      // Otherwise, it might be another type (not fully specified in schema but safe to assume valueId)
      // Since the requirement is specifically "we want the resource or target type PARAMETER and the id to be parameter_id:value_id"

      const resourceIds = values.map((v) => {
        if (v.parameterId) {
          return `${v.parameterId}:${v.valueId}`;
        }
        return v.valueId;
      });

      andFilters.push({
        resourceId: { in: resourceIds },
      });
    } else {
      andFilters.push({ resourceId: { equalTo: "___NONE___" } });
    }
  }

  // General Search Input
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

  return filter;
};
