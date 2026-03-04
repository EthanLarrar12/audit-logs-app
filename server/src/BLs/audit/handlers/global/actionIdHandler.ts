import { AuditQueryParams } from "../../../../types/audit";
import { GlobalFilterHandler } from "./types";

export const ActionIdGlobalHandler: GlobalFilterHandler = {
  isApplicable(params: AuditQueryParams) {
    return !!params.actionId;
  },

  buildFilters(params: AuditQueryParams) {
    if (!params.actionId) return null;
    return { actionId: { equalTo: params.actionId } };
  },
};
