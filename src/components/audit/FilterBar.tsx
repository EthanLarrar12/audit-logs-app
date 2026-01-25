import React, { useState, useEffect } from 'react';
import {
  Filter,
  RotateCcw,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { AuditFilters } from '@/types/audit';
import { AUDIT_CATEGORIES, getSubcategoryName, getActionIcon } from '@/constants/filterOptions';
import { fetchPremadeProfiles } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { styles } from './FilterBar.styles';
import { CategoryBadge } from './CategoryBadge';

// Sub-components
import { GeneralSearch } from './filters/GeneralSearch';
import { DateFilter } from './filters/DateFilter';
import { MultiSelectFilter } from './filters/MultiSelectFilter';
import { SearchFilter } from './filters/SearchFilter';
import { ProfileFilter } from './filters/ProfileFilter';

interface FilterBarProps {
  filters: AuditFilters;
  onFiltersChange: (filters: AuditFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function FilterBar({ filters, onFiltersChange, onReset, isLoading }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [premadeProfiles, setPremadeProfiles] = useState<{ id: string, name: string }[]>([]);

  const toggleMultiFilter = (field: 'category' | 'action', value: string) => {
    const current = (filters[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    updateFilter(field, updated.length > 0 ? updated : null);
  };

  useEffect(() => {
    fetchPremadeProfiles().then(setPremadeProfiles).catch(console.error);
  }, []);

  // Sync internal state with external filters (e.g. on reset)
  useEffect(() => {
    setSearchValues({
      searchInput: filters.searchInput || '',
      actorUsername: filters.actorUsername || '',
      actorSearch: filters.actorSearch || '',
      targetSearch: filters.targetSearch || '',
      resourceSearch: filters.resourceSearch || '',
    });
  }, [filters.searchInput, filters.actorUsername, filters.actorSearch, filters.targetSearch, filters.resourceSearch]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  const updateFilter = <K extends keyof AuditFilters>(
    key: K,
    value: AuditFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateFilters = (updates: Partial<AuditFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues(prev => ({ ...prev, [field]: value }));
    if (field === 'searchInput') {
      updateFilter('searchInputIsExact', false);
      updateFilter('searchInputType', undefined);
    }
  };

  // Generic debounce for all search fields
  useEffect(() => {
    const timer = setTimeout(() => {
      let changed = false;
      const updatedFilters = { ...filters };

      Object.entries(searchValues).forEach(([field, value]) => {
        // Skip searchInput as we want explicit search for it
        if (field === 'searchInput') return;

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
  }, [searchValues]);

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    // Exclude top row filters and internal flags
    if (['searchInput', 'searchInputIsExact', 'searchInputType', 'dateFrom', 'dateTo'].includes(key)) return false;

    // Check if filter is active
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;

    return true;
  });

  const activeFilterCount = activeFilters.length;

  const hasAnyActiveFilter = Object.values(filters).some(v => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string' && v.trim() === '') return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  });

  // Resolve filters to display (aggregate from all selected categories and actions)
  const selectedCategories = Array.isArray(filters.category)
    ? AUDIT_CATEGORIES.filter(c => (filters.category as string[]).includes(c.id))
    : [];

  const selectedActions = Array.isArray(filters.action)
    ? selectedCategories.flatMap(c => c.subcategories).filter(s => (filters.action as string[]).includes(s.id))
    : [];

  const allApplicableFilters = [
    ...selectedCategories.flatMap(c => c.filters || []),
    ...selectedActions.flatMap(s => s.filters || [])
  ].filter(f => f.searchField !== 'actorSearch');

  // Deduplicate filters by searchField
  const displayFilters = allApplicableFilters.filter((filter, index, self) =>
    index === self.findIndex((f) => f.searchField === filter.searchField)
  );

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
        <div className={styles.firstFiltersRow}>
          <GeneralSearch
            label="חיפוש כללי (מבצע, יעד, משאב)"
            value={searchValues.searchInput || ''}
            onChange={(val) => handleSearchChange('searchInput', val)}
            onSelect={(val, type, isExact) => {
              updateFilters({
                searchInputIsExact: isExact,
                searchInputType: type || undefined,
                searchInput: val
              });
            }}
            onClear={() => {
              handleSearchChange('searchInput', '');
              updateFilters({
                searchInput: null,
                searchInputIsExact: false,
                searchInputType: undefined
              });
            }}
          />

          <DateFilter
            label="מתאריך"
            value={filters.dateFrom}
            onChange={(date) => updateFilter('dateFrom', date)}
            placeholder="תאריך התחלה"
          />

          <DateFilter
            label="עד תאריך"
            value={filters.dateTo}
            onChange={(date) => updateFilter('dateTo', date)}
            placeholder="תאריך סיום"
          />
        </div>

        {/* Expanders / Rest of filters button */}
        <div className="flex justify-start py-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            <Filter className={styles.filterIcon} />
            מסננים נוספים
            {activeFilterCount > 0 && (
              <span className={styles.activeFilterBadge}>
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className={styles.firstFiltersRow}>
              <SearchFilter
                label="מזהה/שם המבצע"
                placeholder="חיפוש לפי מבצע..."
                value={searchValues.actorSearch || ''}
                onChange={(val) => handleSearchChange('actorSearch', val)}
              />

              <MultiSelectFilter
                label="קטגוריה"
                placeholder="כל הקטגוריות"
                selected={(filters.category as string[]) || []}
                onToggle={(id) => toggleMultiFilter('category', id)}
                onClear={() => {
                  updateFilter('category', null);
                  updateFilter('action', null);
                }}
                options={AUDIT_CATEGORIES.map(cat => ({
                  id: cat.id,
                  renderItem: () => <CategoryBadge category={cat.id} />,
                  renderBadge: () => <CategoryBadge category={cat.id} className="h-6 py-0 px-2" />
                }))}
              />

              <MultiSelectFilter
                label="תת-קטגוריה"
                placeholder={selectedCategories.length === 0 ? "בחר קטגוריה תחילה" : "כל התת-קטגוריות"}
                disabled={selectedCategories.length === 0}
                selected={(filters.action as string[]) || []}
                onToggle={(id) => toggleMultiFilter('action', id)}
                onClear={() => updateFilter('action', null)}
                options={selectedCategories.flatMap(c => c.subcategories).map(sub => {
                  const catId = AUDIT_CATEGORIES.find(c => c.subcategories.some(s => s.id === sub.id))?.id || 'USER';
                  return {
                    id: sub.id,
                    renderItem: () => (
                      <CategoryBadge
                        category={catId}
                        label={sub.name}
                        icon={getActionIcon(sub.id)}
                      />
                    ),
                    renderBadge: () => (
                      <CategoryBadge
                        category={catId}
                        label={getSubcategoryName(sub.id)}
                        icon={getActionIcon(sub.id)}
                        className="h-6 py-0 px-2"
                      />
                    )
                  };
                })}
              />
            </div>

            {/* Dynamic Search bars */}
            {displayFilters.length > 0 && (
              <div className={styles.dynamicFiltersGrid}>
                {displayFilters.map((filterDef) => (
                  <React.Fragment key={filterDef.searchField}>
                    {filterDef.searchField === 'premadeProfile' ? (
                      <ProfileFilter
                        label={filterDef.name}
                        value={filters.premadeProfile || null}
                        profiles={premadeProfiles}
                        onChange={(id) => updateFilter('premadeProfile', id)}
                      />
                    ) : (
                      <SearchFilter
                        label={filterDef.name}
                        value={searchValues[filterDef.searchField] || ''}
                        onChange={(val) => handleSearchChange(filterDef.searchField, val)}
                        isLoading={isLoading}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
