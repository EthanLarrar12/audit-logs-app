import React from "react";
import { Filter, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
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
