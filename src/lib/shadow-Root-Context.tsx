import { createContext, useContext } from "react";

export const ShadowRootContext = createContext<HTMLElement | null>(null);

export function useShadowContainer() {
    return useContext(ShadowRootContext);
}

export function useShadowInteractOutside(ref: React.ForwardedRef<any>, externalHandler?: (e: any) => void) {
    return (e: any) => {
        const target = e.detail.originalEvent.target as HTMLElement;
        if (target?.closest?.('.audit-logs-wrapper')) {
            const path = e.detail.originalEvent.composedPath();
            if (typeof ref !== 'function' && ref?.current && path.includes(ref.current as any)) {
                e.preventDefault();
            }
        }
        externalHandler?.(e);
    };
}
