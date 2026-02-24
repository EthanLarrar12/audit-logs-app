import { AuditQueryParams } from "../../../../types/audit";
import { GlobalFilterHandler } from "./types";

export const SearchGlobalHandler: GlobalFilterHandler = {
  isApplicable(params: AuditQueryParams) {
    return (
      !!params.actorUsername ||
      !!(params.action && params.action.length > 0) ||
      !!params.actorSearch ||
      !!params.targetSearch ||
      !!params.resourceSearch ||
      !!(params.searchInput && params.searchInput.length > 0)
    );
  },

  buildFilters(params: AuditQueryParams) {
    const filters: Record<string, unknown>[] = [];

    // Actor Username
    if (params.actorUsername) {
      filters.push({
        executorId: { includesInsensitive: params.actorUsername },
      });
    }

    // Action
    if (params.action && params.action.length > 0) {
      filters.push({ historyAction: { in: params.action } });
    }

    // Search Inputs (OR logic)
    if (params.actorSearch) {
      filters.push({
        and: [
          { executorId: { includesInsensitive: params.actorSearch } },
          { executorType: { equalTo: "USER" } },
        ],
      });
    }

    if (params.targetSearch) {
      filters.push({
        or: [{ targetId: { includesInsensitive: params.targetSearch } }],
      });
    }

    if (params.resourceSearch) {
      filters.push({
        resourceId: { includesInsensitive: params.resourceSearch },
      });
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
            filters.push({ or: typeFilters });
          } else {
            filters.push({
              or: [
                { executorId: { equalTo: term } },
                { targetId: { equalTo: term } },
                { resourceId: { equalTo: term } },
              ],
            });
          }
        } else {
          filters.push({
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

    return filters.length > 0 ? filters : null;
  },
};
