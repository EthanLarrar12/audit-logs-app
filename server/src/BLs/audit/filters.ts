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
import {
  GraphQLError,
  GraphQLUserAllowedParametersResponse,
  GraphQLProfileValuesResponse,
} from "../../parsers/profileParser.types";
import {
  GraphQLFilter,
  GraphQLFilterVariable,
  GraphQLContextResult,
} from "../../types/graphql";

/**
 * Build the PostGraphile filter object based on query parameters and permissions
 */
import { FilterContextBuilder } from "./filterContext";
import {
  PROFILE_VALUES_FRAGMENT,
  USER_ALLOWED_PARAMETERS_FRAGMENT,
} from "../../GQL/profileQueries";

export const buildAuditFilters = async (
  params: AuditQueryParams,
  performQuery: PerformQuery,
  userId: string,
): Promise<GraphQLFilterVariable> => {
  const filter: GraphQLFilterVariable = {};
  const andFilters: GraphQLFilter[] = [];
  const contextBuilder = new FilterContextBuilder();

  // --- Register Context Requirements ---

  // 1. Parameter Permission Check
  // We need to know if the user is allowed to see parameters, and if so, which ones.
  // The decision logic is partly synchronous (isPermitted check) and partly async (fetching allowed params).
  // To keep it modular, we'll just check if we need to fetch data.
  const canReadParams = isPermitted({ profilePermission: ["read"] });
  const canUpdateParams = isPermitted({ profilePermission: ["update"] });
  const shouldFetchAllowedParams = canReadParams && !canUpdateParams;

  if (shouldFetchAllowedParams) {
    contextBuilder.addFragment(
      "allowedParams",
      USER_ALLOWED_PARAMETERS_FRAGMENT,
    );
    contextBuilder.addVariable("userId", "String!", userId);
  }

  // 2. Premade Profile
  if (params.premadeProfile) {
    contextBuilder.addFragment("premadeProfileValues", PROFILE_VALUES_FRAGMENT);
    contextBuilder.addVariable(
      "condition",
      "MiragePremadeProfileDigitalParameterValueCondition",
      { profileId: params.premadeProfile },
    );
  }

  let contextData: Record<string, unknown> = {};
  if (contextBuilder.hasFragments()) {
    const query = contextBuilder.buildQuery();
    const variables = contextBuilder.getVariables();
    const result = (await performQuery(
      query,
      variables,
    )) as GraphQLContextResult;

    if (result.errors) {
      throw new Error(
        `GraphQL Errors in Filter Context: ${result.errors
          .map((e: GraphQLError) => e.message)
          .join(", ")}`,
      );
    }
    contextData = result.data || {};
  }

  // --- Apply Filters based on Context ---

  // 1. Parameter Permission Filter
  if (!canReadParams) {
    andFilters.push({
      resourceType: { notEqualTo: MirageObjectType.PARAMETER },
    });
  } else if (!canUpdateParams) {
    // We fetched allowed params
    if (contextData.allowedParams) {
      const allowedParams = parseUserAllowedParametersResponse({
        data: {
          allMiragePremadeProfileOwners:
            contextData.allowedParams as NonNullable<
              GraphQLUserAllowedParametersResponse["data"]
            >["allMiragePremadeProfileOwners"],
        },
      });
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

  // 2. Premade Profile Filter
  if (params.premadeProfile) {
    if (contextData.premadeProfileValues) {
      const values = parseProfileValuesResponse({
        data: {
          allMiragePremadeProfileDigitalParameterValues:
            contextData.premadeProfileValues as NonNullable<
              GraphQLProfileValuesResponse["data"]
            >["allMiragePremadeProfileDigitalParameterValues"],
        },
      });

      if (values.length > 0) {
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
    } else {
      // Should not happen if logic is correct, but safe fallback
      // actually if we requested it but got nothing, it means empty result probably
    }
  }

  // --- Synchronous Checks (unchanged) ---

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
    andFilters.push({ historyAction: { in: params.action } });
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
            { executorId: { includesInsensitive: term } },
            { targetId: { includesInsensitive: term } },
            { resourceId: { includesInsensitive: term } },
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
