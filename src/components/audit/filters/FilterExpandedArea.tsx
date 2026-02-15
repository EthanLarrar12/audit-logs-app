import React from "react";
import { AuditFilters } from "@/types/audit";
import {
  AUDIT_CATEGORIES,
  getSubcategoryName,
  getActionIcon,
} from "@/constants/filterOptions";
import { CategoryBadge } from "../CategoryBadge";
import { SearchFilter } from "./SearchFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { ProfileFilter } from "./ProfileFilter";
import { styles } from "../FilterBar.styles";

interface FilterExpandedAreaProps {
  filters: AuditFilters;
  searchValues: Record<string, string>;
  premadeProfiles: { id: string; name: string }[];
  isLoading?: boolean;
  handleActorSearchChange: (val: string) => void;
  handleCategoryToggle: (id: string) => void;
  handleCategoryClear: () => void;
  handleActionToggle: (id: string) => void;
  handleActionClear: () => void;
  handleSearchChange: (field: string, val: string) => void;
  handlePremadeProfileChange: (id: string) => void;
}

export const FilterExpandedArea: React.FC<FilterExpandedAreaProps> = ({
  filters,
  searchValues,
  premadeProfiles,
  isLoading,
  handleActorSearchChange,
  handleCategoryToggle,
  handleCategoryClear,
  handleActionToggle,
  handleActionClear,
  handleSearchChange,
  handlePremadeProfileChange,
}) => {
  // Calculate selected categories and actions for display options
  const selectedCategories = Array.isArray(filters.category)
    ? AUDIT_CATEGORIES.filter((c) =>
        (filters.category as string[]).includes(c.id),
      )
    : [];

  const selectedActions = Array.isArray(filters.action)
    ? selectedCategories
        .flatMap((c) => c.subcategories)
        .filter((s) => (filters.action as string[]).includes(s.id))
    : [];

  const allApplicableFilters = [
    ...selectedCategories.flatMap((c) => c.filters || []),
    ...selectedActions.flatMap((s) => s.filters || []),
  ].filter((f) => f.searchField !== "actorSearch");

  // Deduplicate filters by searchField
  const displayFilters = allApplicableFilters.filter(
    (filter, index, self) =>
      index === self.findIndex((f) => f.searchField === filter.searchField),
  );

  return (
    <>
      <div className={styles.firstFiltersRow}>
        <SearchFilter
          label="מזהה/שם המבצע"
          placeholder="חיפוש לפי מבצע..."
          value={searchValues.actorSearch || ""}
          onChange={handleActorSearchChange}
        />

        <MultiSelectFilter
          label="קטגוריה"
          placeholder="כל הקטגוריות"
          selected={(filters.category as string[]) || []}
          onToggle={handleCategoryToggle}
          onClear={handleCategoryClear}
          options={AUDIT_CATEGORIES.map((cat) => ({
            id: cat.id,
            renderItem: () => <CategoryBadge category={cat.id} />,
            renderBadge: (onRemove) => (
              <CategoryBadge
                category={cat.id}
                className="h-6 py-0 px-2"
                onRemove={onRemove}
              />
            ),
          }))}
        />

        <MultiSelectFilter
          label="תת-קטגוריה"
          placeholder={
            selectedCategories.length === 0
              ? "בחר קטגוריה תחילה"
              : "כל התת-קטגוריות"
          }
          disabled={selectedCategories.length === 0}
          selected={(filters.action as string[]) || []}
          onToggle={handleActionToggle}
          onClear={handleActionClear}
          options={selectedCategories
            .flatMap((c) => c.subcategories)
            .map((sub) => {
              const catId =
                AUDIT_CATEGORIES.find((c) =>
                  c.subcategories.some((s) => s.id === sub.id),
                )?.id || "USER";
              return {
                id: sub.id,
                renderItem: () => (
                  <CategoryBadge
                    category={catId}
                    label={sub.name}
                    icon={getActionIcon(sub.id)}
                  />
                ),
                renderBadge: (onRemove) => (
                  <CategoryBadge
                    category={catId}
                    label={getSubcategoryName(sub.id)}
                    icon={getActionIcon(sub.id)}
                    className="h-6 py-0 px-2"
                    onRemove={onRemove}
                  />
                ),
              };
            })}
        />
      </div>

      {/* Dynamic Search bars */}
      {displayFilters.length > 0 && (
        <div className={styles.dynamicFiltersGrid}>
          {displayFilters.map((filterDef) => (
            <React.Fragment key={filterDef.searchField}>
              {filterDef.searchField === "premadeProfile" ? (
                <ProfileFilter
                  label={filterDef.name}
                  value={filters.premadeProfile || null}
                  profiles={premadeProfiles}
                  onChange={handlePremadeProfileChange}
                />
              ) : (
                <SearchFilter
                  label={filterDef.name}
                  value={searchValues[filterDef.searchField] || ""}
                  onChange={(val) =>
                    handleSearchChange(filterDef.searchField, val)
                  }
                  isLoading={isLoading}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};
