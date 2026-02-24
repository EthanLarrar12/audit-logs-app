import { AuditQueryParams } from "../../../../types/audit";
import { FilterContextBuilder } from "../../filterContext";
import { FilterContextData } from "../../filterContextTypes";
import { GlobalFilterHandler } from "./types";
import { PROFILE_VALUES_FRAGMENT } from "../../../../GQL/profileQueries";
import { parseProfileValuesResponse } from "../../../../parsers/profileParser";

export const PremadeProfileGlobalHandler: GlobalFilterHandler = {
  isApplicable(params: AuditQueryParams) {
    return !!params.premadeProfile;
  },

  buildQueryContext(
    params: AuditQueryParams,
    contextBuilder: FilterContextBuilder,
  ) {
    if (params.premadeProfile) {
      contextBuilder.addFragment(
        "premadeProfileValues",
        PROFILE_VALUES_FRAGMENT,
      );
      contextBuilder.addVariable(
        "condition",
        "MiragePremadeProfileDigitalParameterValueCondition",
        { profileId: params.premadeProfile },
      );
    }
  },

  buildFilters(params: AuditQueryParams, contextData: FilterContextData) {
    if (!params.premadeProfile || !contextData.premadeProfileValues) {
      return null;
    }

    const values = parseProfileValuesResponse({
      data: {
        allMiragePremadeProfileDigitalParameterValues:
          contextData.premadeProfileValues,
      },
    });

    if (values.length > 0) {
      const resourceIds = values.map((v) => {
        if (v.parameterId) {
          return `${v.parameterId}:${v.valueId}`;
        }
        return v.valueId;
      });

      return {
        resourceId: { in: resourceIds },
      };
    } else {
      return { resourceId: { equalTo: "___NONE___" } };
    }
  },
};
