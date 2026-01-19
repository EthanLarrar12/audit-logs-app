import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    searchContainer: 'relative w-full',
    searchIcon: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textSecondary} pointer-events-none`,
    searchInput: 'pr-10',
    clearSearchButton: `absolute left-3 top-1/2 transform -translate-y-1/2 ${t.colors.textSecondary} hover:${t.colors.textPrimary}`,
    loader: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textBrand} animate-spin pointer-events-none`,
    clearIcon: 'w-4 h-4',
}));
