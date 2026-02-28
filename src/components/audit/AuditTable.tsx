import { useRef, useState, useEffect } from "react";
import { AUDIT_HEADERS } from "@/constants/auditHeaders";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { Virtuoso, Components } from "react-virtuoso"; // Added imports
import { AuditEvent } from "@/types/audit";
import { cn } from "@/lib/utils";
import excelIcon from "@/assets/exportToExcel.svg";
import { AuditEventRow } from "./AuditEventRow";
import { AuditTableSkeleton } from "./AuditTableSkeleton";
import teamJpg from "@/assets/team.jpg";
import { EmptyState } from "./EmptyState";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [clickSequence, setClickSequence] = useState<string[]>([]);
  const [showTeam, setShowTeam] = useState(false);

  useEffect(() => {
    const targetSequence = [
      "ACTOR",
      "ACTOR",
      "ACTOR",
      "ACTION",
      "TARGET",
      "TARGET",
    ].join(",");
    
    if (clickSequence.join(",") === targetSequence) {
      setShowTeam(true);
      setClickSequence([]);
      const timer = setTimeout(() => setShowTeam(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [clickSequence]);

  const handleHeaderClick = (header: string) => {
    setClickSequence((prev) => [...prev, header].slice(-6));
  };

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
                <RefreshCw
                  className={cn(styles.icon, isSpinning && styles.spinningIcon)}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>רענון</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                {" "}
                {/* Wrap in div to allow tooltip on disabled button */}
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
                    <img
                      src={excelIcon}
                      className={cn(
                        styles.icon,
                        (!hasFilters || isExporting) && "opacity-50",
                      )}
                    />
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isExporting
                  ? "מייצא נתונים..."
                  : hasFilters
                    ? AUDIT_HEADERS.EXPORT_TO_EXCEL
                    : "יש לבחור סינון לפחות אחד כדי לייצא"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className={styles.headerItemTime}>{AUDIT_HEADERS.TIME}</div>
        <div
          className={cn(
            styles.headerItemUser,
            "cursor-pointer relative z-10 select-none hover:text-brand transition-colors",
          )}
          onClick={() => handleHeaderClick("ACTOR")}
        >
          {AUDIT_HEADERS.ACTOR}
        </div>
        <div
          className={cn(
            styles.headerItemAction,
            "cursor-pointer relative z-10 select-none hover:text-brand transition-colors",
          )}
          onClick={() => handleHeaderClick("ACTION")}
        >
          {AUDIT_HEADERS.ACTION}
        </div>
        <div
          className={cn(
            styles.headerItemTarget,
            "cursor-pointer relative z-10 select-none hover:text-brand transition-colors",
          )}
          onClick={() => handleHeaderClick("TARGET")}
        >
          {AUDIT_HEADERS.TARGET}
        </div>
        <div className={styles.headerItemResource}>
          {AUDIT_HEADERS.RESOURCE}
        </div>
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
      {showTeam && (
        <div
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500 cursor-pointer"
          onClick={() => setShowTeam(false)}
        >
          <div
            className="flex flex-col items-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <h1
              className="text-5xl font-bold text-white mb-8 animate-bounce tracking-wide drop-shadow-xl"
              dir="rtl"
            >
              יא מצאת את צוות הפיתוח 🎉
            </h1>
            <img
              src={teamJpg}
              alt="צוות הפיתוח"
              className="max-w-4xl max-h-[70vh] rounded-2xl shadow-[0_0_50px_rgba(53,173,144,0.6)] border-4 border-primary animate-in zoom-in duration-700 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
