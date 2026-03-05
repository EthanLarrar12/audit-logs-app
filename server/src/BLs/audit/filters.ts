import { AuditQueryParams } from "../../types/audit";
import { MirageObjectType } from "../../types/mirage";
import { PerformQuery } from "../../../sdks/performQuery";
import { isPermitted } from "../../../sdks/STS";
import { CATEGORY_PERMISSIONS } from "../../constants/permissions";
import { FilterContextBuilder } from "./filterContext";
import { FilterContextData, GraphQLError } from "./filterContextTypes";
import { getCategoryHandler } from "./handlers";
import { GLOBAL_HANDLERS } from "./handlers/global";

/**
 * Build the PostGraphile filter object based on query parameters and permissions
 */
export const buildAuditFilters = async (
  params: AuditQueryParams,
  performQuery: PerformQuery,
  userId: string,
): Promise<Record<string, unknown>> => {
  const filter: Record<string, unknown> = {};
  const globalAndFilters: Record<string, unknown>[] = [];
  const contextBuilder = new FilterContextBuilder();
  let contextData: FilterContextData = {};

  // --- Target Type (Category) Permission Check ---
  const allowedCategories = (
    Object.keys(CATEGORY_PERMISSIONS) as MirageObjectType[]
  ).filter((category) => isPermitted(CATEGORY_PERMISSIONS[category]!));

  // Determine the categories to actually query (intersection)
  const categoriesToQuery = params.category?.length
    ? (params.category as MirageObjectType[]).filter((c) =>
        allowedCategories.includes(c),
      )
    : allowedCategories;

  // Phase 1: Build Query Context using Category Handlers
  for (const category of categoriesToQuery) {
    const handler = getCategoryHandler(category);
    if (handler.buildQueryContext) {
      handler.buildQueryContext(params, contextBuilder, userId);
    }
  }

  // Phase 1.5: Build Query Context using Global Handlers
  for (const globalHandler of GLOBAL_HANDLERS) {
    if (globalHandler.isApplicable(params)) {
      if (globalHandler.buildQueryContext) {
        globalHandler.buildQueryContext(params, contextBuilder, userId);
      }
    }
  }

  // Phase 2: Execute Context Query
  if (contextBuilder.hasFragments()) {
    const query = contextBuilder.buildQuery();
    const variables = contextBuilder.getVariables();
    const result = (await performQuery(query, variables)) as {
      data?: FilterContextData;
      errors?: GraphQLError[];
    };

    if (result.errors) {
      throw new Error(
        `GraphQL Errors in Filter Context: ${result.errors
          .map((e) => e.message)
          .join(", ")}`,
      );
    }
    contextData = result.data || {};
  }

  // Phase 3: Gather Specific Category Filters
  const categoryOrFilters: Record<string, unknown>[] = [];
  for (const category of categoriesToQuery) {
    const handler = getCategoryHandler(category);
    const categoryFilter = handler.buildFilters(params, contextData, userId);
    if (categoryFilter) {
      categoryOrFilters.push(categoryFilter);
    }
  }

  // Self-event arm: always allow the user to see events where they personally appear,
  // regardless of category-level permissions.
  const selfEventFilter = {
    or: [
      { executorId: { equalTo: userId } },
      { targetId: { equalTo: userId } },
      { resourceId: { equalTo: userId } },
    ],
  };

  if (categoryOrFilters.length > 0) {
    // Category-permitted events OR the user's own events
    globalAndFilters.push({ or: [...categoryOrFilters, selfEventFilter] });
  } else {
    // No category permissions at all — still surface the user's own events
    globalAndFilters.push(selfEventFilter);
  }

  // --- Phase 4: Synchronous Global Filters via Handlers ---
  for (const globalHandler of GLOBAL_HANDLERS) {
    if (globalHandler.isApplicable(params)) {
      const globalFilter = globalHandler.buildFilters(
        params,
        contextData,
        userId,
      );
      if (globalFilter) {
        if (Array.isArray(globalFilter)) {
          globalAndFilters.push(...globalFilter);
        } else {
          globalAndFilters.push(globalFilter);
        }
      }
    }
  }

  if (globalAndFilters.length > 0) {
    filter.and = globalAndFilters;
  }

  return filter;
};
