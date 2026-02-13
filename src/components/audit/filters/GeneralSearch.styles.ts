import { makeStyles } from "@/lib/makeStyles";

export const styles = makeStyles((t) => ({
  searchContainer: "relative w-full",
  loader: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textBrand} animate-spin pointer-events-none`,
  searchIcon: `absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.colors.textSecondary} pointer-events-none`,
  searchInput: "pr-10",
  clearSearchButton: `absolute left-3 top-1/2 transform -translate-y-1/2 ${t.colors.textSecondary} hover:${t.colors.textPrimary}`,
  clearIcon: "w-4 h-4",
  searchableDropdownContent:
    "p-0 min-w-[320px] max-w-[400px] border shadow-md rounded-md bg-white overflow-hidden",
  searchableDropdownList: "p-1",
  searchableDropdownItem: `flex items-center justify-between px-3 py-2.5 ${t.typography.sm} rounded-md cursor-pointer hover:bg-slate-50 hover:text-foreground ${t.colors.transition} text-right w-full`,
  searchableDropdownItemSelected: `bg-primary/10 ${t.colors.textBrand} font-medium`,
}));
