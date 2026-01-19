import React from 'react';
import { cn } from '@/lib/utils';
import { styles } from './FilterGroup.styles';

interface FilterGroupProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}

export function FilterGroup({ label, children, className }: FilterGroupProps) {
    return (
        <div className={cn(styles.container, className)}>
            <label className={styles.label}>{label}</label>
            {children}
        </div>
    );
}
