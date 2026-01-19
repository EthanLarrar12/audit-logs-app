import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FilterGroup } from './FilterGroup';
import { styles } from './DateFilter.styles';

interface DateFilterProps {
    label: string;
    value: Date | null | undefined;
    onChange: (date: Date | null) => void;
    placeholder: string;
}

export function DateFilter({ label, value, onChange, placeholder }: DateFilterProps) {
    return (
        <FilterGroup label={label}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            styles.dateButton,
                            !value && styles.dateButtonEmpty
                        )}
                    >
                        <CalendarIcon className={styles.dateButtonIcon} />
                        {value
                            ? format(value, 'dd/MM/yyyy HH:mm:ss', { locale: he })
                            : placeholder}
                        {value && (
                            <div
                                role="button"
                                className={styles.dateButtonClear}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onChange(null);
                                }}
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                            >
                                <X className={styles.clearIcon} />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.calendarPopover} align="start" side="bottom">
                    <DateTimePicker
                        date={value || undefined}
                        setDate={onChange}
                    />
                </PopoverContent>
            </Popover>
        </FilterGroup>
    );
}
