import { AuditQueryParams } from "../../../../types/audit";
import { FilterContextData } from "../../filterContextTypes";
import { GlobalFilterHandler } from "./types";
import { getRlsFilters } from "../../../../utils/auth";

export const RlsGlobalHandler: GlobalFilterHandler = {
  isApplicable() {
    return true; // RLS should always be evaluated
  },

  buildFilters(
    params: AuditQueryParams,
    contextData: FilterContextData,
    userId: string,
  ) {
    const rls = getRlsFilters(userId);
    return rls ? rls : null;
  },
};
