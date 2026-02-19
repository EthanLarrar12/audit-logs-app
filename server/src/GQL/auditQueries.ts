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
                action: historyAction
                resourceName
                resourceId: resourceId
                targetId: targetId
                targetName
                recordDatumByActionId {
                    changes
                }
            }
        }
    }
`;

/**
 * Query to fetch a single audit event by ID
 */
export const GET_AUDIT_EVENT_BY_ID_QUERY = `
    query EventById($id: UUID!) {
        recordById(id: $id) {
            id
            actionId
            updatedAt: insertTime
            category: targetType
            actorId: executorId
            actorUsername: executorName
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
    query GetSearchFilters($searchTerm: String!, $resultLimit: Int!, $resultOffset: Int!) {
        getSearchFilters(searchTerm: $searchTerm, resultLimit: $resultLimit, resultOffset: $resultOffset) {
            nodes {
                id
                name
                type
            }
        }
    }
`;
