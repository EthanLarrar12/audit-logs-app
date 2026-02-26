import { AuditQueryParams } from "../../../../types/audit";
import { FilterContextData } from "../../filterContextTypes";
import { GlobalFilterHandler } from "./types";

export const RlsGlobalHandler: GlobalFilterHandler = {
  isApplicable() {
    return true; // RLS should always be evaluated
  },

  buildFilters(
    params: AuditQueryParams,
    contextData: FilterContextData,
    userId: string,
  ) {
    return null;
  },
};
