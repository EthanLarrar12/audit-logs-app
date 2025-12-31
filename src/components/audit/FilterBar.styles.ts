import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    container: 'bg-card border rounded-lg p-4 space-y-4',
    header: 'flex items-center justify-between',
    expandButton: 'flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors',
    activeFilterBadge: 'mr-1 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full',
    resetButton: 'text-muted-foreground hover:text-foreground gap-1.5',
    controlsContainer: 'space-y-4 animate-fade-in',
    searchContainer: 'relative max-w-md',
    loader: 'absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary animate-spin pointer-events-none',
    searchIcon: 'absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none',
    searchInput: 'pr-10',
    clearSearchButton: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground',
    filtersGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4',
    filterGroup: 'space-y-1.5',
    label: 'text-xs font-medium text-muted-foreground uppercase tracking-wider',
    selectTrigger: 'w-full',
    dateButton: 'w-full justify-start text-right font-normal',
    dateButtonEmpty: 'text-muted-foreground',
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
    flexCenterMuted: 'flex justify-center w-full text-muted-foreground',
    categoryWrapper: 'flex-1 flex justify-center overflow-hidden',
    placeholderText: 'text-muted-foreground',
});
