import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    baseBadge: `inline-flex items-center gap-1.5 px-2.5 py-1 ${t.typography.xs} ${t.typography.medium} rounded-full border`,
    user: t.colors.badgeUser,
    system: t.colors.badgeSystem,
    service: t.colors.badgeService,
    icon: 'w-3 h-3',
}));
