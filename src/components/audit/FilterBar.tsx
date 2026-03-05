import React from "react";
import { Filter, RotateCcw, X, Link2 } from "lucide-react";
import { AuditFilters } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { styles } from "./FilterBar.styles";

import { useFilterLogic } from "./hooks/useFilterLogic";
import { FilterPrimaryRow } from "./filters/FilterPrimaryRow";
import { FilterExpandedArea } from "./filters/FilterExpandedArea";

interface FilterBarProps {
  filters: AuditFilters;
  onFiltersChange: (filters: AuditFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
  onFilterByActionIdReady?: (fn: (id: string) => void) => void;
}

export const FilterBar: React.FC<FilterBarProps> = (props) => {
  const { filters, onReset, isLoading } = props;

  const {
    isExpanded,
    setIsExpanded,
    searchValues,
    premadeProfiles,
    generalSearchObjects,
    activeFilterCount,
    hasAnyActiveFilter,
    handleGeneralSearchChange,
    handleGeneralSearchSelect,
    handleGeneralSearchRemove,
    handleGeneralSearchClear,
    handleDateFromChange,
    handleDateToChange,
    handleActorSearchChange,
    handleCategoryToggle,
    handleCategoryClear,
    handleActionToggle,
    handleActionClear,
    handlePremadeProfileChange,
    handleActionIdFilter,
    handleActionIdClear,
    handleSearchChange,
  } = useFilterLogic(props);

  const handleToggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {/* Main filters grid */}
      <div className={styles.controlsContainer}>
        {/* Permanent First row */}
        <FilterPrimaryRow
          filters={filters}
          searchValues={searchValues}
          generalSearchObjects={generalSearchObjects}
          handleGeneralSearchChange={handleGeneralSearchChange}
          handleGeneralSearchSelect={handleGeneralSearchSelect}
          handleGeneralSearchClear={handleGeneralSearchClear}
          handleGeneralSearchRemove={handleGeneralSearchRemove}
          handleDateFromChange={handleDateFromChange}
          handleDateToChange={handleDateToChange}
        />

        {/* Expanded Area - Moved before toggle for logical flow if desired, but user wants toggle at bottom?
            Actually, let's keep expanded area here, and put the TOGGLE + EXPORT at the very bottom.
        */}
        {/* Action ID active filter chip */}
        {filters.actionId && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium w-fit shadow-sm rtl:flex-row-reverse animate-in fade-in zoom-in-95 duration-200">
            <Link2 className="w-3.5 h-3.5" />
            <span>כל אירועי הפעולה</span>
            <button
              onClick={handleActionIdClear}
              className="mr-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="נקה מסנן פעולה"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {isExpanded && (
          <FilterExpandedArea
            filters={filters}
            searchValues={searchValues}
            premadeProfiles={premadeProfiles}
            isLoading={isLoading}
            handleActorSearchChange={handleActorSearchChange}
            handleCategoryToggle={handleCategoryToggle}
            handleCategoryClear={handleCategoryClear}
            handleActionToggle={handleActionToggle}
            handleActionClear={handleActionClear}
            handleSearchChange={handleSearchChange}
            handlePremadeProfileChange={handlePremadeProfileChange}
          />
        )}

        {/* Footer Row: Toggle (Right) + Reset (Left) */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleToggleExpansion}
            className={styles.expandButton}
          >
            <Filter className={styles.filterIcon} />
            מסננים נוספים
            {activeFilterCount > 0 && (
              <span className={styles.activeFilterBadge}>
                {activeFilterCount}
              </span>
            )}
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className={styles.resetButton}
            disabled={!hasAnyActiveFilter}
          >
            <RotateCcw className={styles.resetIcon} />
            איפוס
          </Button>
        </div>
      </div>
    </div>
  );
};
