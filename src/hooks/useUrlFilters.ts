import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuditFilters } from '@/types/audit';

/**
 * Generic hook to sync audit filters with URL search parameters
 * Automatically handles any filter fields without requiring code changes
 */
export function useUrlFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Mapping of filter keys to their URL parameter names
     * Add new mappings here if you want different URL param names
     */
    const filterToUrlMap: Record<keyof AuditFilters, string> = {
        category: 'category',
        action: 'action',
        searchInput: 'search',
        actorUsername: 'actorUsername',
        actorSearch: 'actorSearch',
        targetSearch: 'targetSearch',
        resourceSearch: 'resourceSearch',
        premadeProfile: 'premadeProfile',
        dateFrom: 'dateFrom',
        dateTo: 'dateTo',
    };

    /**
     * Fields that should be parsed as Date objects
     */
    const dateFields: Set<keyof AuditFilters> = new Set(['dateFrom', 'dateTo']);

    /**
     * Parse URL parameters into AuditFilters object
     * Automatically handles all filter fields generically
     */
    const getFiltersFromUrl = useCallback((): AuditFilters => {
        const filters: AuditFilters = {};

        // Iterate through all possible filter fields
        Object.entries(filterToUrlMap).forEach(([filterKey, urlParam]) => {
            const value = searchParams.get(urlParam);

            if (value) {
                const key = filterKey as keyof AuditFilters;

                // Handle date fields
                if (dateFields.has(key)) {
                    const parsed = new Date(value);
                    if (!isNaN(parsed.getTime())) {
                        (filters as any)[key] = parsed;
                    }
                } else {
                    // Handle string fields
                    (filters as any)[key] = value;
                }
            }
        });

        return filters;
    }, [searchParams]);

    /**
     * Update URL with current filters
     * Automatically handles all filter fields generically
     */
    const syncFiltersToUrl = useCallback((filters: AuditFilters) => {
        const params = new URLSearchParams();

        // Iterate through all filter fields
        Object.entries(filterToUrlMap).forEach(([filterKey, urlParam]) => {
            const key = filterKey as keyof AuditFilters;
            const value = filters[key];

            if (value !== null && value !== undefined) {
                // Handle date fields
                if (dateFields.has(key) && value instanceof Date) {
                    params.set(urlParam, value.toISOString());
                }
                // Handle string fields
                else if (typeof value === 'string') {
                    params.set(urlParam, value);
                }
            }
        });

        // Update URL without triggering navigation
        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    return {
        getFiltersFromUrl,
        syncFiltersToUrl,
    };
}
