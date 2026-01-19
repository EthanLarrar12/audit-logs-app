import { makeStyles } from '@/lib/makeStyles';

export const styles = makeStyles((t) => ({
    container: 'space-y-1.5',
    label: `${t.typography.xs} ${t.typography.medium} ${t.colors.textSecondary} uppercase tracking-wider`,
}));
