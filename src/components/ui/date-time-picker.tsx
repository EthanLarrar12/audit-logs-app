import * as React from 'react';
import { Calendar } from './calendar';
import { Input } from './input';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from './date-time-picker.styles';

interface DateTimePickerProps {
    date: Date | null;
    setDate: (date: Date | null) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
    const [selectedDateTime, setSelectedDateTime] = React.useState<Date | null>(date);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const newDateTime = new Date(selectedDate);
            if (selectedDateTime) {
                newDateTime.setHours(selectedDateTime.getHours());
                newDateTime.setMinutes(selectedDateTime.getMinutes());
                newDateTime.setSeconds(selectedDateTime.getSeconds());
            } else {
                newDateTime.setHours(0, 0, 0, 0);
            }
            setSelectedDateTime(newDateTime);
            setDate(newDateTime);
        } else {
            setSelectedDateTime(null);
            setDate(null);
        }
    };

    const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', value: string) => {
        if (!selectedDateTime) return;

        const newDateTime = new Date(selectedDateTime);
        const intValue = parseInt(value, 10) || 0;

        if (type === 'hours') {
            newDateTime.setHours(Math.min(23, Math.max(0, intValue)));
        } else if (type === 'minutes') {
            newDateTime.setMinutes(Math.min(59, Math.max(0, intValue)));
        } else if (type === 'seconds') {
            newDateTime.setSeconds(Math.min(59, Math.max(0, intValue)));
        }

        setSelectedDateTime(newDateTime);
        setDate(newDateTime);
    };

    React.useEffect(() => {
        setSelectedDateTime(date);
    }, [date]);

    return (
        <div className={styles.container}>
            <Calendar
                mode="single"
                selected={selectedDateTime || undefined}
                onSelect={handleDateSelect}
                initialFocus
            />
            <div className={styles.timeSection}>
                <div className={styles.timeHeader}>
                    <Clock className={styles.clockIcon} />
                    <Label className={styles.timeLabel}>שעה</Label>
                </div>
                <div className={styles.timeInputsContainer}>
                    <div className={styles.timeInputGroup}>
                        <Label htmlFor="hours" className={styles.inputLabel}>שעות</Label>
                        <Input
                            id="hours"
                            type="number"
                            min={0}
                            max={23}
                            className={styles.timeInput}
                            value={selectedDateTime ? selectedDateTime.getHours().toString().padStart(2, '0') : ''}
                            onChange={(e) => handleTimeChange('hours', e.target.value)}
                            disabled={!selectedDateTime}
                        />
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.timeInputGroup}>
                        <Label htmlFor="minutes" className={styles.inputLabel}>דקות</Label>
                        <Input
                            id="minutes"
                            type="number"
                            min={0}
                            max={59}
                            className={styles.timeInput}
                            value={selectedDateTime ? selectedDateTime.getMinutes().toString().padStart(2, '0') : ''}
                            onChange={(e) => handleTimeChange('minutes', e.target.value)}
                            disabled={!selectedDateTime}
                        />
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.timeInputGroup}>
                        <Label htmlFor="seconds" className={styles.inputLabel}>שניות</Label>
                        <Input
                            id="seconds"
                            type="number"
                            min={0}
                            max={59}
                            className={styles.timeInput}
                            value={selectedDateTime ? selectedDateTime.getSeconds().toString().padStart(2, '0') : ''}
                            onChange={(e) => handleTimeChange('seconds', e.target.value)}
                            disabled={!selectedDateTime}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
