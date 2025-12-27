import { AuditFilters, AuditEventPage } from '@/types/audit';

const API_BASE_URL = 'http://localhost:3001';

interface FetchAuditEventsParams {
    page: number;
    pageSize: number;
    filters: AuditFilters;
}

export async function fetchAuditEvents({
    page,
    pageSize,
    filters,
}: FetchAuditEventsParams): Promise<AuditEventPage> {
    const params = new URLSearchParams();

    // Pagination
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    // Sorting (Defaulting to created_at desc as per spec default is desc, field created_at seems appropriate)
    params.append('sort', 'created_at');
    params.append('order', 'desc');

    // Filters mapping
    if (filters.searchInput) {
        params.append('searchInput', filters.searchInput);
    }

    if (filters.action) {
        params.append('action', filters.action);
    }

    if (filters.resource_type) {
        params.append('resourceType', filters.resource_type);
    }

    if (filters.outcome) {
        params.append('outcome', filters.outcome);
    }

    if (filters.dateFrom) {
        params.append('from', filters.dateFrom.toISOString());
    }

    if (filters.dateTo) {
        params.append('to', filters.dateTo.toISOString());
    }

    if (filters.actor_type) {
        params.append('actorType', filters.actor_type);
    }

    const response = await fetch(`${API_BASE_URL}/audit/events?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ...' // No auth logic as per constraints.
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function fetchAuditEventById(id: string) {
    const response = await fetch(`${API_BASE_URL}/audit/events/${id}`);
    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
}
