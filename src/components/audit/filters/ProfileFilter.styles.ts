import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    trigger: 'w-full h-10 text-sm justify-between text-right px-3',
    triggerWrapper: 'flex-1 flex justify-start overflow-hidden text-right',
    placeholder: t.colors.textSecondary,
    searchableDropdownContent: 'p-0 min-w-[320px] max-w-[400px] border shadow-md rounded-md bg-white overflow-hidden',
    searchableDropdownSearch: 'p-1.5 flex items-center gap-2 bg-slate-50 border-none',
    searchableDropdownSearchInput: `h-7 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 ${t.typography.sm} text-right placeholder:text-muted-foreground`,
    searchableDropdownList: 'max-h-[240px] overflow-auto p-1 scrollbar-thin',
    searchableDropdownItem: `flex items-center justify-between px-3 py-2.5 ${t.typography.sm} rounded-md cursor-pointer hover:bg-slate-50 hover:text-foreground ${t.colors.transition} text-right w-full`,
    searchableDropdownItemSelected: `bg-primary/10 ${t.colors.textBrand} font-medium`,
    searchableDropdownNoResults: `p-3 text-center ${t.typography.sm} ${t.colors.textSecondary}`,
}));
