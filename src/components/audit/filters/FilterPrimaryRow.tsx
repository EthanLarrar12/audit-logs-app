import React from "react";
import { AuditFilters } from "@/types/audit";
import { GeneralSearch } from "./GeneralSearch";
import { DateFilter } from "./DateFilter";
import { styles } from "../FilterBar.styles";

interface FilterPrimaryRowProps {
  filters: AuditFilters;
  searchValues: Record<string, string>;
  generalSearchObjects: { id: string; name?: string; type: string }[];
  handleGeneralSearchChange: (val: string) => void;
  handleGeneralSearchSelect: (
    val: string,
    type: string | null,
    isExact?: boolean,
    name?: string,
  ) => void;
  handleGeneralSearchClear: () => void;
  handleGeneralSearchRemove: (id: string) => void;
  handleDateFromChange: (date: Date | undefined) => void;
  handleDateToChange: (date: Date | undefined) => void;
}

export const FilterPrimaryRow: React.FC<FilterPrimaryRowProps> = ({
  filters,
  searchValues,
  generalSearchObjects,
  handleGeneralSearchChange,
  handleGeneralSearchSelect,
  handleGeneralSearchClear,
  handleGeneralSearchRemove,
  handleDateFromChange,
  handleDateToChange,
}) => {
  return (
    <div className={styles.firstFiltersRow}>
      <GeneralSearch
        label="חיפוש כללי (שם/מזהה/מייל)"
        value={searchValues.searchInput || ""}
        onChange={handleGeneralSearchChange}
        onSelect={handleGeneralSearchSelect}
        onClear={handleGeneralSearchClear}
        selectedItems={generalSearchObjects}
        onRemove={handleGeneralSearchRemove}
      />

      <DateFilter
        label="מתאריך"
        value={filters.dateFrom}
        onChange={handleDateFromChange}
        placeholder="תאריך התחלה"
      />

      <DateFilter
        label="עד תאריך"
        value={filters.dateTo}
        onChange={handleDateToChange}
        placeholder="תאריך סיום"
      />
    </div>
  );
};
