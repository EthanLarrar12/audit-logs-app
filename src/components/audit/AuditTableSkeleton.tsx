import { Skeleton } from '@/components/ui/skeleton';
import { styles } from './AuditTableSkeleton.styles';

interface AuditTableSkeletonProps {
  rows?: number;
}

export function AuditTableSkeleton({ rows = 5 }: AuditTableSkeletonProps) {
  return (
    <div className={styles.container}>
      {/* Header skeleton */}
      <div className={styles.headerRow}>
        <Skeleton className={styles.skelDate} />
        <Skeleton className={styles.skelTime} />
        <Skeleton className={styles.skelUser} />
        <Skeleton className={styles.skelUserSub} />
        <Skeleton className={styles.skelAction} />
        <Skeleton className={styles.skelTarget} />
        <Skeleton className={styles.skelTargetSub} />
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={styles.row}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className={styles.cellGroup}>
            <Skeleton className={styles.skelTextLong} />
            <Skeleton className={styles.skelTextShort} />
          </div>
          <Skeleton className={styles.skelBadge} />
          <div className={styles.cellGroup}>
            <Skeleton className={styles.skelTextMedium} />
            <Skeleton className={styles.skelTextTiny} />
          </div>
          <div className={styles.cellGroup}>
            <Skeleton className={styles.skelAction} />
            <Skeleton className={styles.skelTextShort} />
          </div>
          <Skeleton className={styles.skelAction} />
          <Skeleton className={styles.skelBadge} />
          <Skeleton className={styles.skelIcon} />
        </div>
      ))}
    </div>
  );
}
