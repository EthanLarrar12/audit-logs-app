import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    container: 'h-full flex flex-col space-y-2',
    header: `grid grid-cols-12 gap-4 px-4 py-2 ${t.typography.xs} ${t.typography.medium} ${t.colors.textSecondary} uppercase tracking-wider`,
    headerItemTime: 'col-span-2',
    headerItemUser: 'col-span-2',
    headerItemAction: 'col-span-3 text-right',
    headerItemTarget: 'col-span-3 text-right',
    headerItemResource: 'col-span-2 text-right',
    rowsContainer: 'space-y-2',
    sentinel: 'h-10 w-full flex items-center justify-center py-4',
    loader: `animate-spin ${t.colors.textSecondary} w-6 h-6`,
}));
