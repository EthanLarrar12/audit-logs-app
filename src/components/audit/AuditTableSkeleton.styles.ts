import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    container: 'w-full space-y-3',
    headerRow: 'grid grid-cols-7 gap-4 px-4 py-3 bg-table-header rounded-lg',
    row: 'grid grid-cols-7 gap-4 px-4 py-4 bg-card rounded-lg border animate-pulse-subtle',
    cellGroup: 'space-y-2',

    // Skeletons
    skelDate: 'h-4 w-24',
    skelTime: 'h-4 w-16',
    skelUser: 'h-4 w-20',
    skelUserSub: 'h-4 w-24',
    skelAction: 'h-4 w-20',
    skelTarget: 'h-4 w-16',
    skelTargetSub: 'h-4 w-12',

    skelTextLong: 'h-4 w-32',
    skelTextShort: 'h-3 w-20',
    skelBadge: 'h-6 w-14 rounded-full',
    skelTextMedium: 'h-4 w-28',
    skelTextTiny: 'h-3 w-16',
    skelIcon: 'h-8 w-8 rounded',
});
