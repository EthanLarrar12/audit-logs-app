import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    container: 'p-3 bg-background border rounded-md shadow-sm',
    timeSection: 'border-t p-3 pt-4 mt-2',
    timeHeader: 'flex items-center gap-2',
    clockIcon: 'h-4 w-4 text-muted-foreground',
    timeLabel: 'text-sm font-medium',
    timeInputsContainer: 'flex gap-2 mt-2 items-center',
    timeInputGroup: 'grid gap-1 text-center',
    inputLabel: 'text-xs',
    timeInput: 'w-16 h-8 text-center',
    separator: 'text-muted-foreground mt-4',
});
