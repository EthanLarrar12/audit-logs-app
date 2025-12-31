import { FileSearch, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  onRefresh: () => void;
}

export function EmptyState({ hasFilters, onResetFilters, onRefresh }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <FileSearch className={styles.icon} />
      </div>

      <h3 className={styles.title}>
        לא נמצאו אירועי ביקורת
      </h3>

      <p className={styles.description}>
        {hasFilters
          ? 'אין אירועים התואמים את הקריטריונים הנוכחיים. נסה לשנות את המסננים או לנקות אותם כדי לראות את כל האירועים.'
          : 'עדיין לא נרשמו אירועי ביקורת. אירועים יופיעו כאן כאשר תהיה פעילות במערכת.'}
      </p>

      <div className={styles.actionsMap}>
        {hasFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            נקה מסננים
          </Button>
        )}
        <Button onClick={onRefresh} className={styles.refreshButtonContent}>
          <RefreshCw className={styles.refreshIcon} />
          רענון
        </Button>
      </div>
    </div>
  );
}
