import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    header: 'space-y-1',
    topRow: 'flex items-center justify-between',
    titleContainer: 'flex items-center gap-4',
    iconWrapper: `w-14 h-14 rounded-xl ${t.colors.bgBrand}/10 flex items-center justify-center`,
    icon: `w-5 h-5 ${t.colors.textBrand}`,
    logo: 'w-12 h-12 object-contain',
    title: `text-lg ${t.colors.textPrimary} tracking-tight`,
    actionsContainer: 'flex items-center gap-2',
    buttonContent: 'gap-2',
    refreshIcon: 'w-4 h-4',
    refreshIconSpin: 'animate-spin',
}));
