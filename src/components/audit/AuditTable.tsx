import { useRef, useState } from "react";
import { AUDIT_HEADERS } from "@/constants/auditHeaders";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
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
  onExport: () => void;
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
  onExport,
}: AuditTableProps) {
  // No manual IntersectionObserver needed with Virtuoso

  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    onRefresh();
    setTimeout(() => setIsSpinning(false), 1000);
  };

  if (isLoading) {
    return <AuditTableSkeleton rows={5} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        hasFilters={hasFilters}
        onResetFilters={onResetFilters}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center px-4 py-2 border-b bg-card">
        <Button
          variant="default"
          size="sm"
          onClick={handleRefresh}
          className="gap-1.5 h-9"
          disabled={isLoading || isSpinning}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          רענון
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="flex items-center gap-2 hover:bg-muted/50"
        >
          <img src="/exportToExcel.svg" className="w-4 h-4" />
          {AUDIT_HEADERS.EXPORT_TO_EXCEL}
        </Button>
      </div>
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
