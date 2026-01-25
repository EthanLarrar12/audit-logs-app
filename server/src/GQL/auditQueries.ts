/**
* GraphQL queries for audit events
*/

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
                updatedAt: updatedTime
                category: targetType
                actorType: executorType
                actorId: executor
                actorUsername: executorName
                action: midurAction
                resourceName
                resourceId: resource
                targetId: target
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
            updatedAt: updatedTime
            category: targetType
            actorId: executor
            actorUsername: executorName
            action: midurAction
            resourceName: resourceName
            resourceId: resource
            targetId: target
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
                executor
                executorName
                target
                targetName
                resource
                resourceName
                targetType
                resourceType
            }
        }
    }
`;
