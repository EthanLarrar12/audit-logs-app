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
        <div className="flex justify-end -mb-2">
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

        {/* Expanders / Rest of filters button */}
        <div className="flex justify-start py-2">
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
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>

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
      </div>
    </div>
  );
};
