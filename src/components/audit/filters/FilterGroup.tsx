import React from 'react';
import { cn } from '@/lib/utils';
import { styles } from './FilterGroup.styles';

interface FilterGroupProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({ label, children, className }) => {
    return (
        <div className={cn(styles.container, className)}>
            <label className={styles.label}>{label}</label>
            {children}
        </div>
    );
}
