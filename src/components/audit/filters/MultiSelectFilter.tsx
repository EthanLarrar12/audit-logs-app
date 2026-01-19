import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FilterGroup } from './FilterGroup';
import { styles } from './MultiSelectFilter.styles';

interface MultiSelectOption {
    id: string;
    renderItem: () => React.ReactNode;
    renderBadge: () => React.ReactNode;
}

interface MultiSelectFilterProps {
    label: string;
    selected: string[];
    options: MultiSelectOption[];
    onToggle: (id: string) => void;
    onClear: () => void;
    placeholder: string;
    disabled?: boolean;
}

export function MultiSelectFilter({
    label,
    selected,
    options,
    onToggle,
    onClear,
    placeholder,
    disabled
}: MultiSelectFilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <FilterGroup label={label}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        dir="rtl"
                        disabled={disabled}
                        className={styles.trigger}
                    >
                        <div className={styles.triggerWrapper}>
                            {selected.length > 0 ? (
                                <div className="flex gap-1 items-center overflow-hidden">
                                    {/* Show first selected badge */}
                                    {options.find(o => o.id === selected[0])?.renderBadge()}
                                    {selected.length > 1 && (
                                        <div className={styles.plusChip}>+{selected.length - 1}</div>
                                    )}
                                </div>
                            ) : (
                                <span className={styles.placeholder}>{placeholder}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.content} align="end">
                    <div className={styles.list} dir="rtl">
                        <div
                            className={cn(
                                styles.item,
                                selected.length === 0 && styles.itemSelected
                            )}
                            onClick={() => {
                                onClear();
                                setIsOpen(false);
                            }}
                        >
                            <span>{placeholder}</span>
                            {selected.length === 0 && <Check className="h-4 w-4" />}
                        </div>
                        {options.map((option) => {
                            const isSelected = selected.includes(option.id);
                            return (
                                <div
                                    key={option.id}
                                    className={cn(
                                        styles.item,
                                        isSelected && styles.itemSelected
                                    )}
                                    onClick={() => onToggle(option.id)}
                                >
                                    {option.renderItem()}
                                    {isSelected && <Check className="h-4 w-4" />}
                                </div>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </FilterGroup>
    );
}
