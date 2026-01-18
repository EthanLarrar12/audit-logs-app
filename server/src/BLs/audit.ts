import { withPostGraphileContext } from 'postgraphile';
import { graphql } from 'graphql';
import { pgPool } from '../server';
import { AuditEvent, AuditEventPage, AuditQueryParams } from '../types/audit';
import { getGraphQLSchema } from '../GQL/schema';
import { GET_AUDIT_EVENTS_QUERY, GET_AUDIT_EVENT_BY_ID_QUERY } from '../GQL/auditQueries';
import { GET_PREMADE_PROFILES_QUERY, GET_PROFILE_VALUES_QUERY } from '../GQL/profileQueries';
import { parseAuditEventsResponse, parseAuditEventByIdResponse } from '../parsers/auditParser';
import { parsePremadeProfilesResponse, parseProfileValuesResponse } from '../parsers/profileParser';

/**
 * Business logic layer for audit events
 * Handles data access via PostGraphile GraphQL
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
        if (params.category && params.category.length > 0) {
            andFilters.push({ targetType: { in: params.category } });
        }
        if (params.action && params.action.length > 0) {
            andFilters.push({ midurAction: { in: params.action } });
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

        if (params.premadeProfile) {
            const schema = getGraphQLSchema();
            const profileValuesResult: any = await withPostGraphileContext(
                { pgPool },
                async (context: any) => {
                    return await graphql({
                        schema,
                        source: GET_PROFILE_VALUES_QUERY,
                        contextValue: context,
                        variableValues: { condition: { profileId: params.premadeProfile } }
                    });
                }
            );

            const values = parseProfileValuesResponse(profileValuesResult as any);

            if (values.length > 0) {
                andFilters.push({
                    resource: { in: values }
                });
            } else {
                // If profile has no values, don't match anything
                andFilters.push({ resource: { equalTo: '___NONE___' } });
            }
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

        // 3. Execute GraphQL Query
        const variables: any = {
            first,
            offset,
            orderBy: [orderBy]
        };

        // Only include filter if it has conditions
        if (andFilters.length > 0) {
            variables.filter = filter;
        }

        const schema = getGraphQLSchema();

        const result = await withPostGraphileContext(
            { pgPool },
            async (context: any) => {
                return await graphql({
                    schema,
                    source: GET_AUDIT_EVENTS_QUERY,
                    contextValue: context,
                    variableValues: variables
                });
            }
        );

        // 4. Parse and return response
        return parseAuditEventsResponse(result as any, params.page || 1);
    }

    /**
     * Get single audit event by ID
     */
    static async getEventById(id: string): Promise<AuditEvent | null> {
        const schema = getGraphQLSchema();

        const result = await withPostGraphileContext(
            { pgPool },
            async (context: any) => {
                return await graphql({
                    schema,
                    source: GET_AUDIT_EVENT_BY_ID_QUERY,
                    contextValue: context,
                    variableValues: { id }
                });
            }
        );

        return parseAuditEventByIdResponse(result as any);
    }

    /**
     * Get all premade profiles
     */
    static async getPremadeProfiles(): Promise<{ id: string, name: string }[]> {
        const schema = getGraphQLSchema();
        const result: any = await withPostGraphileContext(
            { pgPool },
            async (context: any) => {
                return await graphql({
                    schema,
                    source: GET_PREMADE_PROFILES_QUERY,
                    contextValue: context
                });
            }
        );

        return parsePremadeProfilesResponse(result as any);
    }
}

