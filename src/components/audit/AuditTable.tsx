import { useRef, useState } from "react";
import { AUDIT_HEADERS } from "@/constants/auditHeaders";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { Virtuoso, Components } from "react-virtuoso"; // Added imports
import { AuditEvent } from "@/types/audit";
import { cn } from "@/lib/utils";
import excelIcon from "@/assets/exportToExcel.svg";
import { AuditEventRow } from "./AuditEventRow";
import { AuditTableSkeleton } from "./AuditTableSkeleton";
import { EmptyState } from "./EmptyState";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  isExporting: boolean;
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
  isExporting,
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
      {/* Table header */}
      <div className={styles.header}>
        <div className={styles.actionContainer}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className={styles.iconButton}
                disabled={isLoading || isSpinning}
              >
                <RefreshCw className={cn(styles.icon, isSpinning && styles.spinningIcon)} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>רענון</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block"> {/* Wrap in div to allow tooltip on disabled button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onExport}
                  className={styles.iconButton}
                  disabled={!hasFilters || isExporting}
                >
                  {isExporting ? (
                    <Loader2 className={cn(styles.icon, "animate-spin")} />
                  ) : (
                    <img src={excelIcon} className={cn(styles.icon, (!hasFilters || isExporting) && "opacity-50")} />
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isExporting ? 'מייצא נתונים...' : (hasFilters ? AUDIT_HEADERS.EXPORT_TO_EXCEL : 'יש לבחור סינון לפחות אחד כדי לייצא')}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className={styles.headerItemTime}>{AUDIT_HEADERS.TIME}</div>
        <div className={styles.headerItemUser}>{AUDIT_HEADERS.ACTOR}</div>
        <div className={styles.headerItemAction}>{AUDIT_HEADERS.ACTION}</div>
        <div className={styles.headerItemTarget}>{AUDIT_HEADERS.TARGET}</div>
        <div className={styles.headerItemResource}>{AUDIT_HEADERS.RESOURCE}</div>
      </div>

      {/* Virtuoso List - Container Scroll Mode */}
      <Virtuoso
        className={styles.virtuoso}
        data={events}
        endReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        itemContent={(index, event) => (
          <div className={styles.rowWrapper} dir="rtl">
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
