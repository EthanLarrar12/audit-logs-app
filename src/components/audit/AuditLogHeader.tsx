import { RefreshCw, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { styles } from './AuditLogHeader.styles';

interface AuditLogHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
}

export function AuditLogHeader({
  onRefresh,
  onExport,
  isLoading,
}: AuditLogHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.titleContainer}>
          <div className={styles.iconWrapper}>
            <Shield className={styles.icon} />
          </div>
          <div>
            <h1 className={styles.title}>יומן ביקורת</h1>
          </div>
        </div>

        <div className={styles.actionsContainer}>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className={styles.buttonContent}
          >
            <Download className="w-4 h-4" />
            ייצוא לאקסל
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className={styles.buttonContent}
          >
            <RefreshCw className={cn(styles.refreshIcon, isLoading && styles.refreshIconSpin)} />
            רענון
          </Button>
        </div>
      </div>
    </header>
  );
}
