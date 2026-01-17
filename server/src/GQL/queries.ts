/**
 * GraphQL queries for audit events
 * Centralized location for all GraphQL query strings
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
                actorType: targetType
                actorId: executor
                actorUsername: executor
                action: midurAction
                resourceName: resource
                resourceId: resource
                targetId: target
                targetName: target
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
            actorUsername: executor
            action: midurAction
            resource: resource
            target: target
            recordDatumByActionId {
                changes
            }
        }
    }
`;
