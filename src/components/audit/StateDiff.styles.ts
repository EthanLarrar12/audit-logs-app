import { makeStyles } from "@/lib/makeStyles";

export const styles = makeStyles((t) => ({
    container: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs",
    objectContainer: "font-mono text-xs bg-slate-50 rounded p-2 border border-slate-200 overflow-auto",
    list: "list-none m-0 p-0",
    listItem: "p-1 rounded mb-1 whitespace-pre-wrap break-all flex",
    prefix: "font-semibold select-none opacity-50 mr-2 min-w-[12px]",
    key: "font-bold",
    section: "space-y-1",
    sectionTitle: "font-semibold text-slate-500 uppercase tracking-wider text-[10px]",
    emptyMessage: "text-sm text-slate-500 italic col-span-2",

    // Dynamic styles
    removed: "bg-red-100 border-l-2 border-red-400 text-red-800",
    added: "bg-green-100 border-l-2 border-green-400 text-green-800",
    updated: "bg-yellow-100 border-l-2 border-yellow-400 text-yellow-800",
    textDefault: "text-slate-600",
    nestedLine: "border-l border-slate-200 ml-2 pl-2",
    propertyRow: "flex items-start",
}));
