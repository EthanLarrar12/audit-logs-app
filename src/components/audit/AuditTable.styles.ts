import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    container: 'h-full flex flex-col space-y-2',
    header: `relative grid grid-cols-12 gap-4 px-4 py-2 border-b items-center ${t.typography.xs} ${t.typography.medium} ${t.colors.textSecondary} uppercase tracking-wider`,
    headerItemTime: 'col-span-2',
    headerItemUser: 'col-span-2',
    headerItemAction: 'col-span-3 text-right',
    headerItemTarget: 'col-span-3 text-right',
    headerItemResource: 'col-span-2 text-right',
    rowsContainer: 'space-y-2',
    sentinel: 'h-10 w-full flex items-center justify-center py-4',
    loader: `animate-spin ${t.colors.textSecondary} w-6 h-6`,
    actionContainer: 'absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10',
    iconButton: 'w-7 h-7',
    icon: 'w-3.5 h-3.5',
    spinningIcon: 'animate-spin',
    virtuoso: 'flex-1 scrollbar-stable',
    rowWrapper: 'mb-2',
}));
