import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    baseBadge: `inline-flex items-center gap-1.5 px-2.5 py-1 ${t.typography.xs} ${t.typography.medium} rounded-full border`,
    emptyBadge: `inline-flex items-center px-2 py-0.5 ${t.typography.xs} ${t.colors.textSecondary}`,
    icon: 'w-3 h-3',

    user: t.colors.blue,
    account: t.colors.indigo,
    storage: t.colors.emerald,
    api_group: t.colors.amber,
    database: t.colors.purple,
    report: t.colors.cyan,
    session: t.colors.rose,
    role: t.colors.orange,

    default: `${t.colors.bgSecondary} ${t.colors.textSecondary} ${t.colors.border}`,
}));
