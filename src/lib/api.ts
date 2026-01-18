import { AuditFilters, AuditEventPage } from '@/types/audit';

const API_BASE_URL = 'http://localhost:3001';

interface FetchAuditEventsParams {
    page: number;
    filters: AuditFilters;
}

export async function fetchAuditEvents({
    page,
    filters,
}: FetchAuditEventsParams): Promise<AuditEventPage> {
    const params = new URLSearchParams();

    // Pagination
    params.append('page', page.toString());

    // Sorting (Defaulting to created_at desc as per spec default is desc, field created_at seems appropriate)
    params.append('sort', 'created_at');
    params.append('order', 'desc');

    // Filters mapping (Fixed params according to API spec)
    if (filters.searchInput) {
        params.append('searchInput', filters.searchInput);
    }
    if (filters.actorSearch) {
        params.append('actorSearch', filters.actorSearch);
    }
    if (filters.targetSearch) {
        params.append('targetSearch', filters.targetSearch);
    }
    if (filters.resourceSearch) {
        params.append('resourceSearch', filters.resourceSearch);
    }
    if (filters.premadeProfile) {
        params.append('premadeProfile', filters.premadeProfile);
    }

    if (filters.actorUsername) {
        params.append('actorUsername', filters.actorUsername);
    }

    if (filters.action) {
        if (Array.isArray(filters.action)) {
            filters.action.forEach(a => params.append('action', a));
        } else {
            params.append('action', filters.action);
        }
    }


    if (filters.dateFrom) {
        params.append('from', filters.dateFrom.toISOString());
    }

    if (filters.dateTo) {
        params.append('to', filters.dateTo.toISOString());
    }

    if (filters.category) {
        if (Array.isArray(filters.category)) {
            filters.category.forEach(c => params.append('category', c));
        } else {
            params.append('category', filters.category);
        }
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

export async function fetchPremadeProfiles(): Promise<{ id: string, name: string }[]> {
    const response = await fetch(`${API_BASE_URL}/audit/premade-profiles`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
}
