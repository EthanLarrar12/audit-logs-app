import { makeStyles } from "@/lib/makeStyles";

export const styles = makeStyles((t) => ({
  baseBadge: `inline-flex items-center gap-2 px-3 py-1 ${t.typography.xs} ${t.typography.medium} uppercase tracking-wider rounded-full border shrink-0 whitespace-nowrap`,
  icon: "w-3.5 h-3.5",

  // Categories
  User: t.colors.blue,
  Entity: t.colors.emerald,
  Shos: t.colors.rose,
  DynamicTag: t.colors.purple,
  EndSystem: t.colors.amber,
  Profile: t.colors.indigo,
  DistributionGroup: t.colors.cyan,
  System: t.colors.badgeSystem,

  // Target Types
  user: t.colors.blue,
  account: t.colors.indigo,
  storage: t.colors.emerald,
  api_group: t.colors.amber,
  database: t.colors.purple,
  report: t.colors.cyan,
  session: t.colors.rose,
  role: t.colors.orange,

  // Default
  default: `${t.colors.bgSecondary} ${t.colors.textSecondary} ${t.colors.border}`,
}));
