import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    dateButton: `w-full justify-start text-right ${t.typography.normal}`,
    dateButtonEmpty: t.colors.textSecondary,
    dateButtonIcon: 'ml-2 h-4 w-4',
    dateButtonClear: 'mr-auto h-4 w-4 hover:text-destructive',
    calendarPopover: 'w-auto p-0',
    clearIcon: 'w-4 h-4',
}));
