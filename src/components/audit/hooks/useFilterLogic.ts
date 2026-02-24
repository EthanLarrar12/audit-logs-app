import { useState, useEffect, useCallback } from "react";
import { AuditFilters, FilterField } from "@/types/audit";
import { AUDIT_CATEGORIES } from "@/constants/filterOptions";
import { fetchPremadeProfiles } from "@/lib/api";

interface UseFilterLogicProps {
  filters: AuditFilters;
  onFiltersChange: (filters: AuditFilters) => void;
  onReset: () => void;
}

// Helper to determine valid dynamic filters based on selections
const getValidFilters = (currentFilters: AuditFilters): Set<string> => {
  const selectedCategoryIds = (currentFilters.category as string[]) || [];
  const selectedActionIds = (currentFilters.action as string[]) || [];

  const validFields = new Set<string>();

  // Add fields from selected categories
  const activeCategories = AUDIT_CATEGORIES.filter((c) =>
    selectedCategoryIds.includes(c.id),
  );
  activeCategories.forEach((cat) => {
    cat.filters?.forEach((f) => validFields.add(f.searchField));
  });

  // Add fields from valid subcategories of selected categories
  // Note: We filter subcategories by actions AND check if they belong to active categories
  const activeSubcategories = activeCategories
    .flatMap((c) => c.subcategories)
    .filter((s) => selectedActionIds.includes(s.id));

  activeSubcategories.forEach((sub) => {
    sub.filters?.forEach((f) => validFields.add(f.searchField));
  });

  return validFields;
};

// Helper to get ALL possible dynamic fields to know what to clear
const getAllDynamicFields = (): Set<string> => {
  const allFields = new Set<string>();
  AUDIT_CATEGORIES.forEach((cat) => {
    cat.filters?.forEach((f) => allFields.add(f.searchField));
    cat.subcategories.forEach((sub) => {
      sub.filters?.forEach((f) => allFields.add(f.searchField));
    });
  });
  return allFields;
};

export const useFilterLogic = ({
  filters,
  onFiltersChange,
  onReset,
}: UseFilterLogicProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [premadeProfiles, setPremadeProfiles] = useState<
    { id: string; name: string }[]
  >([]);
  const [generalSearchObjects, setGeneralSearchObjects] = useState<
    { id: string; name?: string; type: string }[]
  >([]);

  // Fetch premade profiles on mount
  useEffect(() => {
    fetchPremadeProfiles().then(setPremadeProfiles).catch(console.error);
  }, []);

  // Sync internal state with external filters
  useEffect(() => {
    setSearchValues({
      searchInput: "",
      actorUsername: filters.actorUsername || "",
      actorSearch: filters.actorSearch || "",
      targetSearch: filters.targetSearch || "",
      resourceSearch: filters.resourceSearch || "",
    });
    setGeneralSearchObjects(filters.generalSearchObjects || []);
  }, [
    filters.actorUsername,
    filters.actorSearch,
    filters.targetSearch,
    filters.resourceSearch,
    filters.generalSearchObjects,
  ]);

  // Debounce search values
  useEffect(() => {
    const timer = setTimeout(() => {
      let changed = false;
      const updatedFilters = { ...filters };

      Object.entries(searchValues).forEach(([field, value]) => {
        if (field === "searchInput") return;

        const key = field as keyof AuditFilters;
        if (filters[key] !== (value || null)) {
          (updatedFilters as any)[key] = value || null;
          changed = true;
        }
      });

      if (changed) {
        onFiltersChange(updatedFilters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValues, filters, onFiltersChange]);

  const updateFilters = useCallback(
    (updates: Partial<AuditFilters>) => {
      onFiltersChange({ ...filters, ...updates });
    },
    [filters, onFiltersChange],
  );

  const updateFilter = useCallback(
    <K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange],
  );

  const handleSearchChange = useCallback((field: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const cleanupInvalidFilters = useCallback((currentFilters: AuditFilters) => {
    const validFields = getValidFilters(currentFilters);
    const allFields = getAllDynamicFields();
    const cleanedFilters = { ...currentFilters };
    let hasChanges = false;

    allFields.forEach((field) => {
      if (!validFields.has(field)) {
        // If the field is present and invalid, clear it
        const key = field as keyof AuditFilters;
        if (field === FilterField.CATEGORY || field === FilterField.ACTION) {
          // Array fields
          if (
            Array.isArray(cleanedFilters[field]) &&
            cleanedFilters[field]!.length > 0
          ) {
            delete cleanedFilters[field];
            hasChanges = true;
          }
        } else if (
          field === FilterField.DATE_FROM ||
          field === FilterField.DATE_TO
        ) {
          // Date fields
          if (cleanedFilters[field]) {
            delete cleanedFilters[field];
            hasChanges = true;
          }
        } else if (field === FilterField.SEARCH_INPUT_IS_EXACT) {
          // Boolean fields
          if (cleanedFilters[field] !== undefined) {
            delete cleanedFilters[field];
            hasChanges = true;
          }
        } else {
          // String fields (default)
          if (cleanedFilters[key]) {
            delete cleanedFilters[key]; // Delete is type safe for optional properties
            hasChanges = true;
          }
        }
      }
    });

    return { filters: cleanedFilters, hasChanges };
  }, []);

  const toggleMultiFilter = useCallback(
    (field: "category" | "action", value: string) => {
      const current = (filters[field] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      let newFilters = {
        ...filters,
        [field]: updated.length > 0 ? updated : null,
      };

      // Category dependency logic
      if (field === "category") {
        const selectedCategoryIds = updated;
        // Get all valid subcategories for the currently selected categories
        const validSubcategories = AUDIT_CATEGORIES.filter((c) =>
          selectedCategoryIds.includes(c.id),
        ).flatMap((c) => c.subcategories.map((s) => s.id));

        const currentActions = (filters.action as string[]) || [];
        const validActions = currentActions.filter((a) =>
          validSubcategories.includes(a),
        );

        if (validActions.length !== currentActions.length) {
          newFilters = {
            ...newFilters,
            action: validActions.length > 0 ? validActions : null,
          };
        }
      }

      // Generic cleanup for any invalid dynamic filters
      const { filters: finalFilters } = cleanupInvalidFilters(newFilters);
      onFiltersChange(finalFilters);
    },
    [filters, onFiltersChange, cleanupInvalidFilters],
  );

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (
      [
        "searchInput",
        "generalSearchObjects",
        "searchInputIsExact",
        "searchInputType",
        "dateFrom",
        "dateTo",
      ].includes(key)
    )
      return false;

    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;

    return true;
  });

  const activeFilterCount = activeFilters.length;
  const hasAnyActiveFilter = Object.values(filters).some((v) => {
    if (v === null || v === undefined || v === false) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  });

  // --- Wrapper Handlers --- //

  const handleGeneralSearchChange = useCallback(
    (val: string) => {
      handleSearchChange("searchInput", val);
    },
    [handleSearchChange],
  );

  const handleGeneralSearchSelect = useCallback(
    (val: string, type: string | null, isExact?: boolean, name?: string) => {
      // Determine new item
      const newItem = { id: val, name: name || val, type: type || "default" };

      // Check if duplicate (by ID)
      if (generalSearchObjects.some((item) => item.id === val)) {
        handleSearchChange("searchInput", ""); // Clear input even if duplicate
        return;
      }

      const newObjects = [...generalSearchObjects, newItem];
      const newSearchInput = newObjects.map((o) => o.id);

      // Determine if all items share the same type
      const allTypes = new Set(newObjects.map((o) => o.type));
      const newSearchInputType =
        allTypes.size === 1 ? newObjects[0].type : undefined;

      // Update state and filters
      setGeneralSearchObjects(newObjects);
      handleSearchChange("searchInput", ""); // Clear input text

      updateFilters({
        searchInputIsExact: isExact,
        searchInputType:
          newSearchInputType === "default" ? undefined : newSearchInputType,
        searchInput: newSearchInput,
        generalSearchObjects: newObjects,
      });
    },
    [generalSearchObjects, handleSearchChange, updateFilters],
  );

  const handleGeneralSearchRemove = useCallback(
    (id: string) => {
      const newObjects = generalSearchObjects.filter((item) => item.id !== id);
      const newSearchInput = newObjects.map((o) => o.id);

      const allTypes = new Set(newObjects.map((o) => o.type));
      const newSearchInputType =
        newObjects.length > 0 && allTypes.size === 1
          ? newObjects[0].type
          : undefined;

      setGeneralSearchObjects(newObjects);
      updateFilters({
        searchInput: newSearchInput.length > 0 ? newSearchInput : undefined,
        searchInputType:
          newSearchInputType === "default" ? undefined : newSearchInputType,
        generalSearchObjects: newObjects.length > 0 ? newObjects : undefined,
      });
    },
    [generalSearchObjects, updateFilters],
  );

  const handleGeneralSearchClear = useCallback(() => {
    handleSearchChange("searchInput", "");
    setGeneralSearchObjects([]);
    updateFilters({
      searchInput: undefined,
      searchInputIsExact: false,
      searchInputType: undefined,
      generalSearchObjects: undefined,
    });
  }, [handleSearchChange, updateFilters]);

  const handleDateFromChange = useCallback(
    (date: Date | undefined) => updateFilter("dateFrom", date),
    [updateFilter],
  );
  const handleDateToChange = useCallback(
    (date: Date | undefined) => updateFilter("dateTo", date),
    [updateFilter],
  );
  const handleActorSearchChange = useCallback(
    (val: string) => handleSearchChange("actorSearch", val),
    [handleSearchChange],
  );
  const handleCategoryToggle = useCallback(
    (id: string) => toggleMultiFilter("category", id),
    [toggleMultiFilter],
  );
  const handleCategoryClear = useCallback(() => {
    const newFilters = { ...filters, category: null, action: null };
    const { filters: finalFilters } = cleanupInvalidFilters(newFilters);
    onFiltersChange(finalFilters);
  }, [filters, onFiltersChange, cleanupInvalidFilters]);
  const handleActionToggle = useCallback(
    (id: string) => toggleMultiFilter("action", id),
    [toggleMultiFilter],
  );
  const handleActionClear = useCallback(() => {
    updateFilter("action", null);
  }, [updateFilter]);
  const handlePremadeProfileChange = useCallback(
    (id: string) => updateFilter("premadeProfile", id),
    [updateFilter],
  );

  return {
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
    handleSearchChange, // Exposed for generic dynamic filters
  };
};
