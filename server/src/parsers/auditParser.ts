import { AuditEvent, AuditEventPage } from '../types/audit';

/**
 * Parser utilities for transforming GraphQL responses to domain models
 */

interface GraphQLAuditNode {
    id: string;
    actionId: string;
    updatedAt: string | number;
    category: string;
    actorId: string;
    actorUsername: string;
    action: string;
    resourceName?: string;
    resourceId?: string;
    resource?: string;
    targetId: string;
    target: string;
    targetName: string;
    recordDatumByActionId?: {
        changes?: {
            before?: any;
            after?: any;
        };
    };
}

interface GraphQLAuditEventsResponse {
    data?: {
        allRecords?: {
            totalCount: number;
            nodes: GraphQLAuditNode[];
        };
    };
    errors?: Array<{ message: string }>;
}

interface GraphQLAuditEventByIdResponse {
    data?: {
        recordById?: GraphQLAuditNode;
    };
    errors?: Array<{ message: string }>;
}

/**
 * Parse a single GraphQL node to AuditEvent
 */
export function parseAuditEventNode(node: GraphQLAuditNode): AuditEvent {
    const changes = node.recordDatumByActionId?.changes;

    // Handle timestamp conversion - could be string or number
    let timestamp: string;
    if (typeof node.updatedAt === 'number') {
        timestamp = new Date(node.updatedAt).toISOString();
    } else {
        timestamp = new Date(parseInt(node.updatedAt)).toISOString();
    }

    return {
        id: node.id,
        created_at: timestamp,
        category: node.category,
        actor_type: 'user',
        actor_id: node.actorId,
        actor_username: node.actorUsername,
        action: node.action,
        resource_name: node.resourceName || node.resource || '',
        resource_id: node.resourceId || node.resource || '',
        target_id: node.targetId || node.target,
        target_name: node.targetName || node.target,
        before_state: changes?.before || null,
        after_state: changes?.after || null,
        context: null
    };
}

/**
 * Parse the full paginated audit events response
 */
export function parseAuditEventsResponse(
    response: GraphQLAuditEventsResponse,
    page: number
): AuditEventPage {
    // Handle errors
    if (response.errors && response.errors.length > 0) {
        throw new Error(`GraphQL Errors: ${response.errors.map(e => e.message).join(', ')}`);
    }

    // Handle missing data
    if (!response.data || !response.data.allRecords) {
        throw new Error('No data returned from GraphQL');
    }

    const { nodes } = response.data.allRecords;

    // Parse all nodes
    const items: AuditEvent[] = nodes.map(parseAuditEventNode);

    return {
        page,
        items
    };
}

/**
 * Parse single audit event by ID response
 */
export function parseAuditEventByIdResponse(
    response: GraphQLAuditEventByIdResponse
): AuditEvent | null {
    // Handle errors
    if (response.errors && response.errors.length > 0) {
        console.error('GraphQL Error:', response.errors);
        return null;
    }

    // Handle missing data
    const node = response.data?.recordById;
    if (!node) {
        return null;
    }

    return parseAuditEventNode(node);
}
