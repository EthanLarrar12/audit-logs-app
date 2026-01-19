import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    trigger: 'w-full h-10 text-sm justify-between text-right px-3',
    triggerWrapper: 'flex-1 flex justify-start overflow-hidden text-right',
    placeholder: t.colors.textSecondary,
    plusChip: `px-1.5 py-0.5 ${t.typography.xs} ${t.typography.medium} ${t.colors.bgBrand} ${t.colors.textInverse} rounded-md shrink-0`,
    content: 'p-0 min-w-[240px] border shadow-md rounded-md bg-white overflow-hidden',
    list: 'max-h-[300px] overflow-auto p-1 scrollbar-thin',
    item: `flex items-center justify-between px-3 py-2.5 ${t.typography.sm} rounded-md cursor-pointer hover:bg-slate-50 hover:text-foreground ${t.colors.transition} text-right w-full`,
    itemSelected: `bg-primary/10 ${t.colors.textBrand} font-medium`,
}));
