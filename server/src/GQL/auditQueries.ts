/**
 * GraphQL queries for audit events
 */

export const DELETE_AUDIT_HISTORY_MUTATION = `
    mutation DeleteAuditHistory($startDate: String, $endDate: String) {
        deleteAuditHistory(input: { startDate: $startDate, endDate: $endDate }) {
            integer
        }
    }
`;

/**
 * Query to fetch paginated and filtered audit events
 */
export const GET_AUDIT_EVENTS_QUERY = `
    query AuditEvents($filter: RecordFilter, $first: Int!, $offset: Int!, $orderBy: [RecordsOrderBy!]) {
        allRecords(
            filter: $filter
            first: $first
            offset: $offset
            orderBy: $orderBy
        ) {
            totalCount
            nodes {
                id
                actionId
                updatedAt: insertTime
                category: targetType
                actorId: executorId
                actorUsername: executorName
                actorType: executorType
                action: historyAction
                resourceName
                resourceId: resourceId
                targetId: targetId
                targetName
            }
        }
    }
`;

/**
 * Query to fetch a single audit event by ID
 */
export const GET_AUDIT_EVENT_BY_ID_QUERY = `
    query EventById($id: BigInt!) {
        recordById(id: $id) {
            id
            actionId
            updatedAt: insertTime
            category: targetType
            actorId: executorId
            actorUsername: executorName
            actorType: executorType
            action: historyAction
            resourceName: resourceName
            resourceId: resourceId
            targetId: targetId
            targetName: targetName
            recordDatumByActionId {
                changes
            }
        }
    }
`;
/**
 * Query to fetch unique values for autocomplete suggestions
 */
export const GET_SUGGESTIONS_QUERY = `
    query Suggestions($filter: RecordFilter) {
        allRecords(
            filter: $filter
            first: 50
        ) {
            nodes {
                executorId
                executorName
                actorType: executorType
                targetId
                targetName
                resourceId
                resourceName
                targetType
                resourceType
            }
        }
    }
`;

/**
 * Query to fetch search filters via DB function
 */
export const GET_SEARCH_FILTERS_QUERY = `
    query GetSearchFilters($searchValue: String!, $resultLimit: Int!, $resultOffset: Int!) {
        getSearchFilters(searchValue: $searchValue, resultLimit: $resultLimit, resultOffset: $resultOffset) {
            nodes {
                id
                name
                type
            }
        }
    }
`;

/**
 * Function to dynamically generate dictionary translations query
 * It dynamically constructs the complex value filters based on compound value objects.
 */
export const getTranslationsQuery = (values: { parameterId: string; valueId: string }[]) => {
    let valueFiltersBlock = "";
    if (values.length > 0) {
        const orConditions = values.map(({ parameterId, valueId }) => {
            // Escape strings carefully for GraphQL string injection
            return `{ digitalParameterId: { equalTo: "${parameterId}" }, id: { equalTo: "${valueId}" } }`;
        }).join(", ");

        valueFiltersBlock = `
      allDigitalValues(filter: { or: [ ${orConditions} ] }) {
        nodes {
          id
          digitalParameterId
          name
        }
      }
    `;
    }

    return `
      query GetTranslations($paramIds: [String!]) {
        allDigitalParameters(filter: { id: { in: $paramIds } }) {
          nodes {
            id
            name
          }
        }
        ${valueFiltersBlock}
      }
  `;
};
