import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles({
    baseBadge: 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
    user: 'bg-badge-user/15 text-badge-user border-badge-user/30',
    system: 'bg-badge-system/15 text-badge-system border-badge-system/30',
    service: 'bg-badge-service/15 text-badge-service border-badge-service/30',
    icon: 'w-3 h-3',
});
