import { AuditQueryParams } from "../../../../types/audit";
import { GlobalFilterHandler } from "./types";

export const DateRangeGlobalHandler: GlobalFilterHandler = {
  isApplicable(params: AuditQueryParams) {
    return !!params.from || !!params.to;
  },

  buildFilters(params: AuditQueryParams) {
    const filters: Record<string, unknown>[] = [];

    if (params.from) {
      filters.push({
        insertTime: { greaterThanOrEqualTo: new Date(params.from).getTime() },
      });
    }

    if (params.to) {
      filters.push({
        insertTime: { lessThanOrEqualTo: new Date(params.to).getTime() },
      });
    }

    return filters.length > 0 ? filters : null;
  },
};
