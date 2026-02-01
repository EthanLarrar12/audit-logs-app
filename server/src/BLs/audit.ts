import { AuditEvent, AuditEventPage, AuditQueryParams } from '../types/audit';
import { GET_AUDIT_EVENTS_QUERY, GET_AUDIT_EVENT_BY_ID_QUERY, GET_SUGGESTIONS_QUERY } from '../GQL/auditQueries';
import { GET_PREMADE_PROFILES_QUERY, GET_PROFILE_VALUES_QUERY } from '../GQL/profileQueries';
import { parseAuditEventsResponse, parseAuditEventByIdResponse, parseSuggestionsResponse } from '../parsers/auditParser';
import { parsePremadeProfilesResponse, parseProfileValuesResponse } from '../parsers/profileParser';
import { PerformQuery } from '../../sdks/performQuery';
import { getRlsFilters } from '../utils/auth';

/**
 * Business logic layer for audit events
 * Handles data access via PostGraphile GraphQL
 */
/**
 * Get paginated and filtered audit events
 */
export const getEvents = async (params: AuditQueryParams, performQuery: PerformQuery, userId: string): Promise<AuditEventPage> => {
    // 1. Construct Filter Object
    const filter: any = {};
    const andFilters: any[] = [];

    // Apply RLS Filters
    andFilters.push(getRlsFilters(userId));

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
        const profileValuesResult: any = await performQuery(
            GET_PROFILE_VALUES_QUERY,
            { condition: { profileId: params.premadeProfile } }
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
        if (params.exactSearch) {
            const searchType = params.searchType;
            if (searchType) {
                const typeFilters: any[] = [];
                typeFilters.push({
                    and: [
                        { executor: { equalTo: term } },
                        { executorType: { equalTo: searchType } }
                    ]
                });
                typeFilters.push({
                    and: [
                        { target: { equalTo: term } },
                        { targetType: { equalTo: searchType } }
                    ]
                });
                typeFilters.push({
                    and: [
                        { resource: { equalTo: term } },
                        { resourceType: { equalTo: searchType } }
                    ]
                });
                andFilters.push({ or: typeFilters });
            } else {
                andFilters.push({
                    or: [
                        { executor: { equalTo: term } },
                        { target: { equalTo: term } },
                        { resource: { equalTo: term } }
                    ]
                });
            }
        } else {
            andFilters.push({
                or: [
                    { actionId: { includesInsensitive: term } },
                    { executor: { includesInsensitive: term } },
                    { executorName: { includesInsensitive: term } },
                    { target: { includesInsensitive: term } },
                    { targetName: { includesInsensitive: term } },
                    { resource: { includesInsensitive: term } },
                    { resourceName: { includesInsensitive: term } }
                ]
            });
        }
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

    const result = await performQuery(
        GET_AUDIT_EVENTS_QUERY,
        variables
    );

    // 4. Parse and return response
    return parseAuditEventsResponse(result as any, params.page || 1);
}

/**
 * Get single audit event by ID
 */
export const getEventById = async (id: string, performQuery: PerformQuery): Promise<AuditEvent | null> => {
    const result = await performQuery(
        GET_AUDIT_EVENT_BY_ID_QUERY,
        { id }
    );

    return parseAuditEventByIdResponse(result as any);
}

/**
 * Get all premade profiles
 */
export const getPremadeProfiles = async (performQuery: PerformQuery): Promise<{ id: string, name: string }[]> => {
    const result: any = await performQuery(GET_PREMADE_PROFILES_QUERY);

    return parsePremadeProfilesResponse(result as any);
}

/**
 * Get unique suggestions for autocomplete based on a search term
 */
export const getSuggestions = async (params: { term: string }, performQuery: PerformQuery): Promise<any[]> => {
    const term = params.term;
    const filter = {
        or: [
            { executor: { includesInsensitive: term } },
            { executorName: { includesInsensitive: term } },
            { target: { includesInsensitive: term } },
            { targetName: { includesInsensitive: term } },
            { resource: { includesInsensitive: term } },
            { resourceName: { includesInsensitive: term } }
        ]
    };

    const result = await performQuery(
        GET_SUGGESTIONS_QUERY,
        { filter }
    );

    return parseSuggestionsResponse(result as any, term);
}


