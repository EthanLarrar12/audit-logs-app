import { PAGE_SIZE } from '../constants/pagination';
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

        // Category filter (exact match)
        if (params.category) {
            filtered = filtered.filter((e) => e.category === params.category);
        }

        // Action filter (exact match)
        if (params.action) {
            filtered = filtered.filter((e) => e.action === params.action);
        }

        // Actor search (name OR ID)
        if (params.actorSearch) {
            const searchLower = params.actorSearch.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.actor_username?.toLowerCase().includes(searchLower) ||
                    e.actor_id?.toLowerCase().includes(searchLower)
            );
        }

        // Target search (name OR ID)
        if (params.targetSearch) {
            const searchLower = params.targetSearch.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.target_name?.toLowerCase().includes(searchLower) ||
                    e.target_id?.toLowerCase().includes(searchLower)
            );
        }

        // Resource search (name OR ID)
        if (params.resourceSearch) {
            const searchLower = params.resourceSearch.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.resource_name.toLowerCase().includes(searchLower) ||
                    e.resource_id.toLowerCase().includes(searchLower)
            );
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
                    e.resource_name.toLowerCase().includes(searchLower)
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
        const page: number = params.page || 1;

        const startIndex: number = (page - 1) * PAGE_SIZE;
        const endIndex: number = startIndex + PAGE_SIZE;
        const paginatedEvents: AuditEvent[] = events.slice(startIndex, endIndex);

        return {
            page,
            items: paginatedEvents,
        };
    }
}
