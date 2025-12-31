import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    baseBadge: 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
    emptyBadge: 'inline-flex items-center px-2 py-0.5 text-xs text-muted-foreground',
    icon: 'w-3 h-3',

    user: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
    account: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30',
    storage: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    api_group: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    database: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
    report: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
    session: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
    role: 'bg-orange-500/15 text-orange-600 border-orange-500/30',

    default: 'bg-muted text-muted-foreground border-border',
});
