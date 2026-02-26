import { AuditQueryParams } from "../../../types/audit";
import { FilterContextBuilder } from "../filterContext";
import { CategoryFilterHandler } from "./types";
import { MirageObjectType } from "../../../types/mirage";
import { isPermitted } from "../../../../sdks/STS";
import { FilterContextData } from "../filterContextTypes";
import { USER_ALLOWED_PARAMETERS_FRAGMENT } from "../../../GQL/profileQueries";
import { parseUserAllowedParametersResponse } from "../../../parsers/profileParser";

export const UserFilterHandler: CategoryFilterHandler = {
  buildQueryContext(
    params: AuditQueryParams,
    contextBuilder: FilterContextBuilder,
    userId: string,
  ) {
    // 1. Parameter Permission Check
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
  },

  buildFilters(
    params: AuditQueryParams,
    contextData: FilterContextData,
    userId: string,
  ) {
    const userAndFilters: Record<string, unknown>[] = [];
    userAndFilters.push({ targetType: { equalTo: MirageObjectType.USER } });

    // 1. Parameter Permission Filter
    const canReadParams = isPermitted({ profilePermission: ["read"] });
    const canUpdateParams = isPermitted({ profilePermission: ["update"] });

    if (!canReadParams) {
      userAndFilters.push({
        or: [
          { resourceType: { notEqualTo: MirageObjectType.PARAMETER } },
          { resourceType: { isNull: true } },
        ],
      });
    } else if (!canUpdateParams) {
      // We fetched allowed params
      if (contextData.allowedParams) {
        const allowedParams = parseUserAllowedParametersResponse({
          data: {
            allMiragePremadeProfileOwners: contextData.allowedParams,
          },
        });
        const allowedIds = allowedParams.map(
          (p) => `${p.parameterId}:${p.valueId}`,
        );

        if (allowedIds.length > 0) {
          userAndFilters.push({
            or: [
              { resourceType: { notEqualTo: MirageObjectType.PARAMETER } },
              { resourceType: { isNull: true } },
              {
                and: [
                  { resourceType: { equalTo: MirageObjectType.PARAMETER } },
                  { resourceId: { in: allowedIds } },
                ],
              },
            ],
          });
        } else {
          userAndFilters.push({
            or: [
              { resourceType: { notEqualTo: MirageObjectType.PARAMETER } },
              { resourceType: { isNull: true } },
            ],
          });
        }
      }
    }

    return { and: userAndFilters };
  },
};
