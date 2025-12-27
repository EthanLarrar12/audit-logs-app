import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    container: 'flex flex-col sm:flex-row items-center justify-between gap-4 py-4',
    infoText: 'text-sm text-muted-foreground',
    highlight: 'font-medium text-foreground',
    controls: 'flex items-center gap-4',
    pageSizeSelector: 'flex items-center gap-2',
    selectTrigger: 'w-[70px] h-8',
    navigation: 'flex items-center gap-1',
    navButton: 'h-8 w-8',
});
