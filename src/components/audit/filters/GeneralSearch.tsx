import React, { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { fetchSuggestions, SuggestionResult } from '@/lib/api';
import { getActionIcon } from '@/constants/filterOptions';
import { CategoryBadge } from '../CategoryBadge';
import { FilterGroup } from './FilterGroup';
import { styles } from './GeneralSearch.styles';

interface GeneralSearchProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    onSelect: (val: string, isExact?: boolean) => void;
    onClear: () => void;
}

export function GeneralSearch({ label, value, onChange, onSelect, onClear }: GeneralSearchProps) {
    const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

    useEffect(() => {
        if (!value || value.length < 2) {
            setSuggestions([]);
            if (!value) setIsSuggestionsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSuggestionsLoading(true);
            try {
                const data = await fetchSuggestions(value);
                setSuggestions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSuggestionsLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [value]);

    return (
        <FilterGroup label={label}>
            <Popover
                open={isSuggestionsOpen}
                onOpenChange={(open) => {
                    if (open && !value) return;
                    setIsSuggestionsOpen(open);
                }}
            >
                <PopoverTrigger asChild>
                    <div className={styles.searchContainer}>
                        {isSuggestionsLoading ? (
                            <Loader2 className={styles.loader} />
                        ) : (
                            <Search className={styles.searchIcon} />
                        )}
                        <Input
                            className={styles.searchInput}
                            placeholder="הקלידו לחיפוש..."
                            value={value || ''}
                            onChange={(e) => {
                                onChange(e.target.value);
                                setIsSuggestionsOpen(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSelect(value, false);
                                    setIsSuggestionsOpen(false);
                                }
                            }}
                            onFocus={() => {
                                if (value && suggestions.length > 0) {
                                    setIsSuggestionsOpen(true);
                                }
                            }}
                        />
                        {value && (
                            <button
                                onClick={() => {
                                    onClear();
                                    setIsSuggestionsOpen(false);
                                    setSuggestions([]);
                                }}
                                className={styles.clearSearchButton}
                            >
                                <X className={styles.clearIcon} />
                            </button>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className={cn(styles.searchableDropdownContent, "w-[var(--radix-popover-trigger-width)]")}
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className={styles.searchableDropdownList} dir="rtl">
                        {value && (
                            <div
                                className={cn(styles.searchableDropdownItem, "border-b border-slate-50 italic")}
                                onClick={() => {
                                    onSelect(value, false);
                                    setIsSuggestionsOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-2 text-brand">
                                    <Search className="h-4 w-4 opacity-70" />
                                    <span>חפש את: "{value}"</span>
                                </div>
                            </div>
                        )}

                        {suggestions.map((suggestion) => {
                            const actionIcon = getActionIcon(suggestion.id);

                            return (
                                <div
                                    key={`${suggestion.id}-${suggestion.type}`}
                                    className={styles.searchableDropdownItem}
                                    onClick={() => {
                                        onSelect(suggestion.id, true);
                                        setIsSuggestionsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        {actionIcon ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 opacity-70 flex items-center justify-center">
                                                    {(() => {
                                                        const IconComponent = actionIcon;
                                                        return <IconComponent className="h-4 w-4 text-slate-500" />;
                                                    })()}
                                                </div>
                                                <span>{suggestion.name ? `${suggestion.name} (${suggestion.id})` : suggestion.id}</span>
                                            </div>
                                        ) : (
                                            <CategoryBadge
                                                category={suggestion.type}
                                                label={suggestion.name ? `${suggestion.name} (${suggestion.id})` : suggestion.id}
                                                className="bg-transparent border-none p-0 h-auto lowercase"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </FilterGroup>
    );
}
