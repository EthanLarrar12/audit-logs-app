import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    container: `${t.colors.bgCard} ${t.colors.border} rounded-lg p-4 space-y-4 border`,
    header: 'flex items-center justify-between',
    expandButton: `flex items-center gap-2 ${t.typography.sm} ${t.typography.medium} ${t.colors.textPrimary} hover:${t.colors.textBrand} ${t.colors.transition}`,
    activeFilterBadge: `mr-1 px-2 py-0.5 ${t.typography.xs} ${t.typography.medium} ${t.colors.bgBrand} ${t.colors.textInverse} rounded-full`,
    resetButton: `${t.colors.textSecondary} hover:${t.colors.textPrimary} gap-1.5`,
    controlsContainer: 'space-y-4 animate-fade-in',
    searchContainer: 'relative max-w-md',
    loader: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textBrand} animate-spin pointer-events-none`,
    searchIcon: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textSecondary} pointer-events-none`,
    searchInput: 'pr-10',
    clearSearchButton: `absolute left-3 top-1/2 transform -translate-y-1/2 ${t.colors.textSecondary} hover:${t.colors.textPrimary}`,
    filtersGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4',
    filterGroup: 'space-y-1.5',
    label: `${t.typography.xs} ${t.typography.medium} ${t.colors.textSecondary} uppercase tracking-wider`,
    selectTrigger: 'w-full',
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
    placeholderText: t.colors.textSecondary,
}));
