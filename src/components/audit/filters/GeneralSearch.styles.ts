import { makeStyles } from "@/lib/makeStyles";

export const styles = makeStyles((t) => ({
  searchContainer:
    "relative w-full border rounded-md border-input bg-background px-3 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  loader: `w-4 h-4 ${t.colors.textBrand} animate-spin pointer-events-none mr-2`,
  searchIcon: `w-4 h-4 ${t.colors.textSecondary} pointer-events-none ml-2`,
  searchInput:
    "bg-transparent placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  clearSearchButton: `${t.colors.textSecondary} hover:${t.colors.textPrimary} ml-auto`,
  clearIcon: "w-4 h-4",
  searchableDropdownContent:
    "p-0 w-[var(--radix-popover-trigger-width)] border shadow-md rounded-md bg-white overflow-hidden",
  searchableDropdownList: "p-1",
  searchableDropdownItem: `flex items-center justify-between px-3 py-2.5 ${t.typography.sm} rounded-md cursor-pointer hover:bg-slate-50 hover:text-foreground ${t.colors.transition} text-right w-full`,
  searchableDropdownItemSelected: `bg-primary/10 ${t.colors.textBrand} font-medium`,
}));
