import { AuditQueryParams } from "../../../types/audit";
import { FilterContextBuilder } from "../filterContext";
import { FilterContextData } from "../filterContextTypes";

export interface CategoryFilterHandler {
  /**
   * Adds necessary fragments and variables to the single context query
   * for this specific category.
   */
  buildQueryContext?: (
    params: AuditQueryParams,
    contextBuilder: FilterContextBuilder,
    userId: string,
  ) => void;

  /**
   * Receives the global query response and returns category-specific filters.
   * Returns a PostGraphile filter object (e.g. { targetType: { equalTo: ... } })
   */
  buildFilters: (
    params: AuditQueryParams,
    contextData: FilterContextData,
    userId: string,
  ) => Record<string, unknown> | null;
}
