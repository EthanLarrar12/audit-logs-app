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

export const SearchFilter: React.FC<SearchFilterProps> = ({ label, value, onChange, placeholder, isLoading }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.value);
    };

    const handleClear = (): void => {
        onChange('');
    };

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
                    onChange={handleInputChange}
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className={styles.clearSearchButton}
                    >
                        <X className={styles.clearIcon} />
                    </button>
                )}
            </div>
        </FilterGroup>
    );
}
