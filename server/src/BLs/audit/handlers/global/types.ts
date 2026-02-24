import { AuditQueryParams } from "../../../../types/audit";
import { FilterContextBuilder } from "../../filterContext";
import { FilterContextData } from "../../filterContextTypes";

export interface GlobalFilterHandler {
  /**
   * Evaluates if this global handler needs to execute based on the incoming request parameters.
   */
  isApplicable: (params: AuditQueryParams) => boolean;

  /**
   * Adds necessary fragments and variables to the single context query.
   * Executed only if `isApplicable` is true.
   */
  buildQueryContext?: (
    params: AuditQueryParams,
    contextBuilder: FilterContextBuilder,
    userId: string,
  ) => void;

  /**
   * Receives the parsed global query response and returns generic filters.
   * Executed only if `isApplicable` is true.
   * Returns a PostGraphile filter block to be `AND`ed against all other data.
   */
  buildFilters: (
    params: AuditQueryParams,
    contextData: FilterContextData,
    userId: string,
  ) => Record<string, unknown>[] | Record<string, unknown> | null;
}
