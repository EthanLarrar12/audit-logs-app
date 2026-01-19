import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    container: `${t.colors.bgCard} ${t.colors.border} rounded-lg p-4 space-y-4 border`,
    header: 'flex items-center justify-between min-h-10',
    expandButton: `flex items-center gap-2 ${t.typography.sm} ${t.typography.medium} ${t.colors.textPrimary} hover:${t.colors.textBrand} ${t.colors.transition}`,
    activeFilterBadge: `mr-1 px-2 py-0.5 ${t.typography.xs} ${t.typography.medium} ${t.colors.bgBrand} ${t.colors.textInverse} rounded-full`,
    resetButton: `${t.colors.textSecondary} hover:${t.colors.textPrimary} gap-1.5`,
    controlsContainer: 'space-y-4 animate-fade-in',
    generalSearchRow: 'w-full',
    searchContainer: 'relative w-full',
    loader: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textBrand} animate-spin pointer-events-none`,
    searchIcon: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textSecondary} pointer-events-none`,
    searchInput: 'pr-10',
    clearSearchButton: `absolute left-3 top-1/2 transform -translate-y-1/2 ${t.colors.textSecondary} hover:${t.colors.textPrimary}`,
    filtersGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4',
    firstFiltersRow: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    secondFiltersRow: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
    dynamicFiltersGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
    filterGroup: 'space-y-1.5',
    largeFilterGroup: 'space-y-1.5',
    label: `${t.typography.xs} ${t.typography.medium} ${t.colors.textSecondary} uppercase tracking-wider`,
    selectTrigger: 'w-full',
    largeTrigger: 'w-full h-10 text-sm',
    dateButton: `w-full justify-start text-right ${t.typography.normal}`,
    dateButtonEmpty: t.colors.textSecondary,
    dateButtonIcon: 'ml-2 h-4 w-4',
    dateButtonClear: 'mr-auto h-4 w-4 hover:text-destructive',
    calendarPopover: 'w-auto p-0',
    calendar: 'pointer-events-auto',

    // Icons
    filterIcon: 'w-4 h-4',
    resetIcon: 'w-3.5 h-3.5',
    clearIcon: 'w-4 h-4',

    // Helpers
    flexCenter: 'flex justify-center w-full',
    flexCenterMuted: `flex justify-center w-full ${t.colors.textSecondary}`,
    categoryWrapper: 'flex-1 flex justify-center overflow-hidden',
    triggerWrapperRight: 'flex-1 flex justify-start overflow-hidden text-right',
    placeholderText: t.colors.textSecondary,
    plusChip: `px-1.5 py-0.5 ${t.typography.xs} ${t.typography.medium} ${t.colors.bgBrand} ${t.colors.textInverse} rounded-md shrink-0`,

    // Searchable Dropdown
    searchableDropdownContent: 'p-0 min-w-[320px] max-w-[400px] border shadow-md rounded-md bg-white overflow-hidden',
    searchableDropdownList: 'max-h-[240px] overflow-auto p-1 scrollbar-thin',
    searchableDropdownItem: `flex items-center justify-between px-3 py-2.5 ${t.typography.sm} rounded-md cursor-pointer hover:bg-slate-50 hover:text-foreground ${t.colors.transition} text-right w-full`,
    searchableDropdownItemSelected: `bg-primary/10 ${t.colors.textBrand} font-medium`,
    searchableDropdownSearch: 'p-1.5 flex items-center gap-2 bg-slate-50 border-none',
    searchableDropdownSearchInput: `h-7 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 ${t.typography.sm} text-right placeholder:text-muted-foreground`,
    searchableDropdownNoResults: `p-3 text-center ${t.typography.sm} ${t.colors.textSecondary}`,
}));
