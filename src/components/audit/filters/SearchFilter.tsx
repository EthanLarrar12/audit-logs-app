import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterGroup } from './FilterGroup';
import { styles } from './SearchFilter.styles';

interface SearchFilterProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export function SearchFilter({ label, value, onChange, placeholder, isLoading }: SearchFilterProps) {
    return (
        <FilterGroup label={label}>
            <div className={styles.searchContainer}>
                {isLoading ? (
                    <Loader2 className={styles.loader} />
                ) : (
                    <Search className={styles.searchIcon} />
                )}
                <Input
                    className={styles.searchInput}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className={styles.clearSearchButton}
                    >
                        <X className={styles.clearIcon} />
                    </button>
                )}
            </div>
        </FilterGroup>
    );
}
