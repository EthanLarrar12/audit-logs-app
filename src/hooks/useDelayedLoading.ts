import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

/**
 * A hook that returns true if the provided loading state remains true for more than the delay duration.
 * Useful for preventing loading flickers for very fast requests.
 * 
 * @param isLoading The base loading state (e.g. from a query)
 * @param delay The delay in milliseconds before showing the loader (default: 200ms)
 * @returns boolean indicating if the loader should be shown
 */
export function useDelayedLoading(isLoading: boolean, delay: number = 200): boolean {
    const [showLoader, setShowLoader] = useState(false);

    const debouncedShow = useMemo(
        () => debounce(() => setShowLoader(true), delay),
        [delay]
    );

    useEffect(() => {
        if (isLoading) {
            debouncedShow();
        } else {
            debouncedShow.cancel();
            setShowLoader(false);
        }

        return () => {
            debouncedShow.cancel();
        };
    }, [isLoading, debouncedShow]);

    return showLoader;
}
