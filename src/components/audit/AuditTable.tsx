import { AuditEvent } from '@/types/audit';
import { AuditEventRow } from './AuditEventRow';
import { AuditTableSkeleton } from './AuditTableSkeleton';
import { EmptyState } from './EmptyState';

interface AuditTableProps {
  events: AuditEvent[];
  isLoading: boolean;
  hasFilters: boolean;
  onResetFilters: () => void;
  onRefresh: () => void;
}

export function AuditTable({
  events,
  isLoading,
  hasFilters,
  onResetFilters,
  onRefresh,
}: AuditTableProps) {
  if (isLoading) {
    return <AuditTableSkeleton rows={5} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        hasFilters={hasFilters}
        onResetFilters={onResetFilters}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-2">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div className="col-span-2">תאריך ושעה</div>
        <div className="col-span-2">שחקן</div>
        <div className="col-span-2">שם משתמש</div>
        <div className="col-span-2">פעולה</div>
        <div className="col-span-2">משאב</div>
        <div className="col-span-2">יעד</div>
      </div>

      {/* Event rows */}
      <div className="space-y-2">
        {events.map((event) => (
          <AuditEventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
