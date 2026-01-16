import { withPostGraphileContext } from 'postgraphile';
import { graphql } from 'graphql';
import { pgPool } from '../server';
import { AuditEvent, AuditEventPage, AuditQueryParams } from '../types/audit';

// Define the shape of the GraphQL response for safety
interface GraphQLResponse {
    data: {
        allRecords: {
            totalCount: number;
            nodes: any[];
        };
        recordById?: any;
    };
    errors?: any[];
}

/**
 * Business logic layer for audit events
 * Handles data access via PostGraphile ORM pattern
 */
export class AuditService {
    /**
     * Get paginated and filtered audit events
     */
    static async getEvents(params: AuditQueryParams): Promise<AuditEventPage> {
        // 1. Construct Filter Object
        const filter: any = {};
        const andFilters: any[] = [];

        if (params.from) {
            andFilters.push({ updatedTime: { greaterThanOrEqualTo: new Date(params.from).getTime() } });
        }
        if (params.to) {
            andFilters.push({ updatedTime: { lessThanOrEqualTo: new Date(params.to).getTime() } });
        }
        if (params.actorUsername) {
            andFilters.push({ executor: { includesInsensitive: params.actorUsername } });
        }
        if (params.category) {
            andFilters.push({ targetType: { equalTo: params.category } });
        }
        if (params.action) {
            andFilters.push({ midurAction: { equalTo: params.action } });
        }

        // Search Inputs (OR logic)
        if (params.actorSearch) {
            andFilters.push({
                or: [
                    { executor: { includesInsensitive: params.actorSearch } }
                ]
            });
        }

        if (params.targetSearch) {
            andFilters.push({
                or: [
                    { target: { includesInsensitive: params.targetSearch } }
                ]
            });
        }

        if (params.resourceSearch) {
            andFilters.push({ resource: { includesInsensitive: params.resourceSearch } });
        }

        if (params.searchInput) {
            const term = params.searchInput;
            andFilters.push({
                or: [
                    { actionId: { includesInsensitive: term } },
                    { executor: { includesInsensitive: term } },
                    { target: { includesInsensitive: term } },
                    { resource: { includesInsensitive: term } }
                ]
            });
        }

        if (andFilters.length > 0) {
            filter.and = andFilters;
        }

        // 2. Pagination & Sorting
        const first = 10; // Default page size
        const offset = ((params.page || 1) - 1) * first;

        let orderBy = 'UPDATED_TIME_DESC'; // Default sort
        if (params.sort) {
            const direction = params.order === 'asc' ? 'ASC' : 'DESC';
            switch (params.sort) {
                case 'created_at': orderBy = `UPDATED_TIME_${direction}`; break;
                case 'action': orderBy = `MIDUR_ACTION_${direction}`; break;
                case 'actor_username': orderBy = `EXECUTOR_${direction}`; break;
                case 'target_name': orderBy = `TARGET_${direction}`; break;
                default: orderBy = `UPDATED_TIME_${direction}`;
            }
        }

        // 3. GraphQL Query
        const query = `
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

        const variables = {
            filter,
            first,
            offset,
            orderBy: [orderBy]
        };

        const result = await withPostGraphileContext(
            { pgPool },
            async (context: any) => {
                return await graphql(
                    await context.getGraphQLSchema(),
                    query,
                    null,
                    context,
                    variables
                ) as GraphQLResponse;
            }
        );

        if (result.errors) {
            throw new Error(`GraphQL Errors: ${result.errors.map(e => e.message).join(', ')}`);
        }

        if (!result.data) {
            throw new Error('No data returned from GraphQL');
        }

        const { totalCount, nodes } = result.data.allRecords;

        // 4. Map to AuditEvent interface
        const items: AuditEvent[] = nodes.map((node: any) => {
            const changes = node.recordDatumByActionId?.changes;

            return {
                id: node.id,
                created_at: new Date(parseInt(node.updatedAt)).toISOString(),
                category: node.category,
                actor_type: 'user',
                actor_id: node.actorId,
                actor_username: node.actorUsername,
                action: node.action,
                resource_name: node.resourceName || '',
                resource_id: node.resourceId || '',
                target_id: node.targetId,
                target_name: node.targetName,
                before_state: changes?.before || null,
                after_state: changes?.after || null,
                context: null
            };
        });

        const pageResult: AuditEventPage = {
            page: params.page || 1,
            items
        };
        return pageResult;
    }

    /**
     * Get single audit event by ID
     */
    static async getEventById(id: string): Promise<AuditEvent | null> {
        const result = await withPostGraphileContext(
            { pgPool },
            async (context: any) => {
                const query = `
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

                return await graphql(
                    await context.getGraphQLSchema(),
                    query,
                    null,
                    context,
                    { id }
                ) as GraphQLResponse;
            }
        );

        if (result.errors) {
            console.error("GraphQL Error", result.errors);
            return null;
        }

        const node = result.data?.recordById;
        if (!node) return null;

        const changes = node.recordDatumByActionId?.changes;

        const event: AuditEvent = {
            id: node.id,
            created_at: new Date(parseInt(node.updatedAt)).toISOString(),
            category: node.category,
            actor_type: 'user',
            actor_id: node.actorId,
            actor_username: node.actorUsername,
            action: node.action,
            resource_name: node.resource || '',
            resource_id: node.resource || '',
            target_id: node.target,
            target_name: node.target,
            before_state: changes?.before || null,
            after_state: changes?.after || null,
            context: null
        };
        return event;
    }
}
