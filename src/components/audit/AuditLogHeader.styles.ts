import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    header: 'space-y-1',
    topRow: 'flex items-center justify-between',
    titleContainer: 'flex items-center gap-3',
    iconWrapper: 'w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center',
    icon: 'w-5 h-5 text-primary',
    title: 'text-2xl font-bold text-foreground',
    subtitle: 'text-sm text-muted-foreground',
    actionsContainer: 'flex items-center gap-2',
    buttonContent: 'gap-2',
    refreshIcon: 'w-4 h-4',
    refreshIconSpin: 'animate-spin',
});
