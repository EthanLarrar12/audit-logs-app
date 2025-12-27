import { mockAuditEvents } from '../data/mockData';
import { AuditEvent, AuditEventPage, AuditQueryParams } from '../types/audit';

/**
 * Business logic layer for audit events
 * Handles data access, filtering, sorting, and pagination
 */
export class AuditService {
    /**
     * Get paginated and filtered audit events
     */
    static getEvents(params: AuditQueryParams): AuditEventPage {
        let filteredEvents: AuditEvent[] = [...mockAuditEvents];

        // Apply filters
        filteredEvents = this.applyFilters(filteredEvents, params);

        // Apply sorting
        filteredEvents = this.applySorting(filteredEvents, params);

        // Apply pagination
        return this.applyPagination(filteredEvents, params);
    }

    /**
     * Get single audit event by ID
     */
    static getEventById(id: string): AuditEvent | null {
        const event = mockAuditEvents.find((e) => e.id === id);
        return event || null;
    }

    /**
     * Apply all filters to the event list
     */
    private static applyFilters(
        events: AuditEvent[],
        params: AuditQueryParams
    ): AuditEvent[] {
        let filtered = events;

        // Date range filter
        if (params.from) {
            const fromDate = new Date(params.from);
            filtered = filtered.filter((e) => new Date(e.created_at) >= fromDate);
        }

        if (params.to) {
            const toDate = new Date(params.to);
            filtered = filtered.filter((e) => new Date(e.created_at) <= toDate);
        }

        // Actor username filter (partial match)
        if (params.actorUsername) {
            filtered = filtered.filter((e) =>
                e.actor_username?.toLowerCase().includes(params.actorUsername!.toLowerCase())
            );
        }

        // Actor type filter (exact match)
        if (params.actorType) {
            filtered = filtered.filter((e) => e.actor_type === params.actorType);
        }

        // Target name filter (partial match)
        if (params.targetName) {
            filtered = filtered.filter((e) =>
                e.target_name?.toLowerCase().includes(params.targetName!.toLowerCase())
            );
        }

        // Action filter (exact match)
        if (params.action) {
            filtered = filtered.filter((e) => e.action === params.action);
        }

        // Resource type filter (exact match)
        if (params.resourceType) {
            filtered = filtered.filter((e) => e.resource_type === params.resourceType);
        }

        // Outcome filter (exact match)
        if (params.outcome) {
            filtered = filtered.filter((e) => e.outcome === params.outcome);
        }

        // Full-text search
        if (params.searchInput) {
            const searchLower = params.searchInput.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.id.toLowerCase().includes(searchLower) ||
                    e.actor_username?.toLowerCase().includes(searchLower) ||
                    e.target_name?.toLowerCase().includes(searchLower) ||
                    e.action.toLowerCase().includes(searchLower) ||
                    e.resource_type.toLowerCase().includes(searchLower)
            );
        }

        return filtered;
    }

    /**
     * Apply sorting to the event list
     */
    private static applySorting(
        events: AuditEvent[],
        params: AuditQueryParams
    ): AuditEvent[] {
        const sorted = [...events];

        sorted.sort((a, b) => {
            let aVal: string | number;
            let bVal: string | number;

            switch (params.sort) {
                case 'created_at':
                    aVal = new Date(a.created_at).getTime();
                    bVal = new Date(b.created_at).getTime();
                    break;
                case 'action':
                    aVal = a.action;
                    bVal = b.action;
                    break;
                case 'actor_username':
                    aVal = a.actor_username || '';
                    bVal = b.actor_username || '';
                    break;
                case 'target_name':
                    aVal = a.target_name || '';
                    bVal = b.target_name || '';
                    break;
                default:
                    aVal = new Date(a.created_at).getTime();
                    bVal = new Date(b.created_at).getTime();
            }

            if (params.order === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        return sorted;
    }

    /**
     * Apply pagination and return paginated response
     */
    private static applyPagination(
        events: AuditEvent[],
        params: AuditQueryParams
    ): AuditEventPage {
        const total: number = events.length;
        const page: number = params.page || 1;
        const pageSize: number = params.pageSize || 50;

        const startIndex: number = (page - 1) * pageSize;
        const endIndex: number = startIndex + pageSize;
        const paginatedEvents: AuditEvent[] = events.slice(startIndex, endIndex);

        return {
            page,
            pageSize,
            total,
            items: paginatedEvents,
        };
    }
}
