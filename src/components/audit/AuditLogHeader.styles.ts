import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    header: 'space-y-1',
    topRow: 'flex items-center justify-between',
    titleContainer: 'flex items-center gap-3',
    iconWrapper: `w-10 h-10 rounded-lg ${t.colors.bgBrand}/10 flex items-center justify-center`,
    icon: `w-5 h-5 ${t.colors.textBrand}`,
    title: `${t.typography.h1} ${t.typography.bold} ${t.colors.textPrimary}`,
    actionsContainer: 'flex items-center gap-2',
    buttonContent: 'gap-2',
    refreshIcon: 'w-4 h-4',
    refreshIconSpin: 'animate-spin',
}));
