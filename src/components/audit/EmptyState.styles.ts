import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    container: 'flex flex-col items-center justify-center py-16 px-4',
    iconWrapper: 'w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4',
    icon: 'w-8 h-8 text-primary',
    title: 'text-lg font-semibold text-foreground mb-2',
    description: 'text-sm text-muted-foreground text-center max-w-md mb-6',
    actionsMap: 'flex gap-3',
    refreshButtonContent: 'gap-2',
    refreshIcon: 'w-4 h-4',
});
