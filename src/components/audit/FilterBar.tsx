import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar as CalendarIcon, Filter, X, RotateCcw, Search, Loader2 } from 'lucide-react';
import { AuditFilters } from '@/types/audit';
import { AUDIT_CATEGORIES, getSubcategoryName, getActionIcon } from '@/constants/filterOptions';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { styles } from './FilterBar.styles';

interface FilterBarProps {
  filters: AuditFilters;
  onFiltersChange: (filters: AuditFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function FilterBar({ filters, onFiltersChange, onReset, isLoading }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});

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

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues(prev => ({ ...prev, [field]: value }));
    // Debounce is handled per field in a separate effect or single one
  };

  // Generic debounce for all search fields
  useEffect(() => {
    const timer = setTimeout(() => {
      let changed = false;
      const updatedFilters = { ...filters };

      Object.entries(searchValues).forEach(([field, value]) => {
        if (filters[field] !== (value || null)) {
          updatedFilters[field] = value || null;
          changed = true;
        }
      });

      if (changed) {
        onFiltersChange(updatedFilters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValues]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== null).length;

  // Resolve filters to display
  const currentCategory = filters.category ? AUDIT_CATEGORIES.find(c => c.id === filters.category) : null;
  const currentSubcategory = (currentCategory && filters.action)
    ? currentCategory.subcategories.find(s => s.id === filters.action)
    : null;

  const displayFilters = [
    ...(currentCategory?.filters || []),
    ...(currentSubcategory?.filters || [])
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
        >
          <Filter className={styles.filterIcon} />
          מסננים
          {activeFilterCount > 0 && (
            <span className={styles.activeFilterBadge}>
              {activeFilterCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className={styles.resetButton}
          >
            <RotateCcw className={styles.resetIcon} />
            איפוס
          </Button>
        )}
      </div>

      {/* Filter controls */}
      {isExpanded && (
        <div className={styles.controlsContainer}>
          {/* Main filters grid */}
          <div className={styles.filtersGrid}>
            {/* Category filter */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                קטגוריה
              </label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(v) => {
                  const newCategory = v === 'all' ? null : v;
                  // Reset all dynamic filters when category changes
                  const newFilters = { ...filters };
                  Object.keys(newFilters).forEach(key => {
                    if (!['category', 'action', 'dateFrom', 'dateTo'].includes(key)) {
                      delete (newFilters as any)[key];
                    }
                  });
                  onFiltersChange({
                    ...newFilters,
                    category: newCategory,
                    action: null
                  });
                }}
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <div className={styles.categoryWrapper}>
                    {filters.category ? (
                      <CategoryBadge category={filters.category} />
                    ) : (
                      <span className={styles.placeholderText}>כל הקטגוריות</span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className={styles.flexCenterMuted}>
                      כל הקטגוריות
                    </div>
                  </SelectItem>
                  {AUDIT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className={styles.flexCenter}>
                        <CategoryBadge category={cat.id} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory (Action) filter */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                תת-קטגוריה
              </label>
              <Select
                value={filters.action || 'all'}
                onValueChange={(v) => updateFilter('action', v === 'all' ? null : v)}
                disabled={!filters.category}
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <div className={styles.categoryWrapper}>
                    {filters.action ? (
                      <CategoryBadge
                        category={filters.category!}
                        label={getSubcategoryName(filters.action)}
                        icon={getActionIcon(filters.action)}
                      />
                    ) : (
                      <span className={styles.placeholderText}>
                        {!filters.category ? "בחר קטגוריה תחילה" : "כל התת-קטגוריות"}
                      </span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className={styles.flexCenterMuted}>
                      כל התת-קטגוריות
                    </div>
                  </SelectItem>
                  {filters.category &&
                    AUDIT_CATEGORIES.find(c => c.id === filters.category)
                      ?.subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          <div className={styles.flexCenter}>
                            <CategoryBadge
                              category={filters.category!}
                              label={sub.name}
                              icon={getActionIcon(sub.id)}
                            />
                          </div>
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>


            {/* Date From */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                מתאריך
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      styles.dateButton,
                      !filters.dateFrom && styles.dateButtonEmpty
                    )}
                  >
                    <CalendarIcon className={styles.dateButtonIcon} />
                    {filters.dateFrom
                      ? format(filters.dateFrom, 'dd/MM/yyyy HH:mm:ss', { locale: he })
                      : 'תאריך התחלה'}
                    {filters.dateFrom && (
                      <div
                        role="button"
                        className={styles.dateButtonClear}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          updateFilter('dateFrom', null);
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <X className={styles.clearIcon} />
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.calendarPopover} align="start" side="bottom">
                  <DateTimePicker
                    date={filters.dateFrom}
                    setDate={(date) => updateFilter('dateFrom', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                עד תאריך
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      styles.dateButton,
                      !filters.dateTo && styles.dateButtonEmpty
                    )}
                  >
                    <CalendarIcon className={styles.dateButtonIcon} />
                    {filters.dateTo
                      ? format(filters.dateTo, 'dd/MM/yyyy HH:mm:ss', { locale: he })
                      : 'תאריך סיום'}
                    {filters.dateTo && (
                      <div
                        role="button"
                        className={styles.dateButtonClear}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          updateFilter('dateTo', null);
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <X className={styles.clearIcon} />
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.calendarPopover} align="start" side="bottom">
                  <DateTimePicker
                    date={filters.dateTo}
                    setDate={(date) => updateFilter('dateTo', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Dynamic Search bars - appear as a new row below */}
          {displayFilters.length > 0 && (
            <div className={styles.dynamicFiltersGrid}>
              {displayFilters.map((filterDef) => (
                <div key={filterDef.searchField} className={styles.filterGroup}>
                  <label className={styles.label}>
                    {filterDef.name}
                  </label>
                  <div className={styles.searchContainer}>
                    {isLoading ? (
                      <Loader2 className={styles.loader} />
                    ) : (
                      <Search className={styles.searchIcon} />
                    )}
                    <Input
                      type="text"
                      value={searchValues[filterDef.searchField] || ''}
                      onChange={(e) => handleSearchChange(filterDef.searchField, e.target.value)}
                      className={styles.searchInput}
                    />
                    {searchValues[filterDef.searchField] && (
                      <button
                        onClick={() => handleSearchChange(filterDef.searchField, '')}
                        className={styles.clearSearchButton}
                      >
                        <X className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
