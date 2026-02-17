import { useRef } from "react";
import { AUDIT_HEADERS } from "@/constants/auditHeaders";
import { Loader2 } from "lucide-react";
import { Virtuoso, Components } from "react-virtuoso"; // Added imports
import { AuditEvent } from "@/types/audit";
import { AuditEventRow } from "./AuditEventRow";
import { AuditTableSkeleton } from "./AuditTableSkeleton";
import { EmptyState } from "./EmptyState";
import { styles } from "./AuditTable.styles";

interface AuditTableProps {
  events: AuditEvent[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  onRefresh: () => void;
}

export function AuditTable({
  events,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  hasFilters,
  onResetFilters,
  onRefresh,
}: AuditTableProps) {
  // No manual IntersectionObserver needed with Virtuoso

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
    <div className={styles.container}>
      {/* Table header */}
      <div className={styles.header}>
        <div className={styles.headerItemTime}>{AUDIT_HEADERS.TIME}</div>
        <div className={styles.headerItemUser}>{AUDIT_HEADERS.ACTOR}</div>
        <div className={styles.headerItemAction}>{AUDIT_HEADERS.ACTION}</div>
        <div className={styles.headerItemTarget}>{AUDIT_HEADERS.TARGET}</div>
        <div className={styles.headerItemResource}>{AUDIT_HEADERS.RESOURCE}</div>
      </div>

      {/* Virtuoso List - Container Scroll Mode */}
      <Virtuoso
        style={{ flex: 1 }}
        className="scrollbar-stable"
        data={events}
        endReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        itemContent={(index, event) => (
          <div className="mb-2" dir="rtl">
            <AuditEventRow key={event.id} event={event} />
          </div>
        )}
        components={{
          Footer: () => (
            <div className={styles.sentinel}>
              {isFetchingNextPage && <Loader2 className={styles.loader} />}
            </div>
          ),
        }}
      />
    </div>
  );
}
