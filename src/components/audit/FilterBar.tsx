import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar as CalendarIcon, Filter, X, RotateCcw, Search, Loader2 } from 'lucide-react';
import { AuditFilters } from '@/types/audit';
import { actionTypes, resourceTypes } from '@/constants/filterOptions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  const [searchTerm, setSearchTerm] = useState(filters.searchInput || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.searchInput || '')) {
        updateFilter('searchInput', searchTerm || null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync internal state with external filters (e.g. on reset)
  useEffect(() => {
    setSearchTerm(filters.searchInput || '');
  }, [filters.searchInput]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  const updateFilter = <K extends keyof AuditFilters>(
    key: K,
    value: AuditFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== null).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
        >
          <Filter className="w-4 h-4" />
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
            <RotateCcw className="w-3.5 h-3.5" />
            איפוס
          </Button>
        )}
      </div>

      {/* Filter controls */}
      {isExpanded && (
        <div className={styles.controlsContainer}>
          {/* Search bar - full width restricted */}
          <div className={styles.searchContainer}>
            {isLoading ? (
              <Loader2 className={styles.loader} />
            ) : (
              <Search className={styles.searchIcon} />
            )}
            <Input
              type="text"
              placeholder="חיפוש לפי שם משתמש או מזהה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={styles.clearSearchButton}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Other filters grid */}
          <div className={styles.filtersGrid}>
            {/* Action filter */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                פעולה
              </label>
              <Select
                value={filters.action || 'all'}
                onValueChange={(v) => updateFilter('action', v === 'all' ? null : v)}
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="כל הפעולות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הפעולות</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actor Type filter */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                שחקן
              </label>
              <Select
                value={filters.actor_type || 'all'}
                onValueChange={(v) =>
                  updateFilter(
                    'actor_type',
                    v === 'all' ? null : (v as 'user' | 'system' | 'service')
                  )
                }
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="כל השחקנים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל השחקנים</SelectItem>
                  <SelectItem value="user">משתמש</SelectItem>
                  <SelectItem value="system">מערכת</SelectItem>
                  <SelectItem value="service">שירות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resource Type filter */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                משאב
              </label>
              <Select
                value={filters.resource_type || 'all'}
                onValueChange={(v) => updateFilter('resource_type', v === 'all' ? null : v)}
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="כל המשאבים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המשאבים</SelectItem>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Outcome filter */}
            <div className={styles.filterGroup}>
              <label className={styles.label}>
                תוצאה
              </label>
              <Select
                value={filters.outcome || 'all'}
                onValueChange={(v) =>
                  updateFilter('outcome', v === 'all' ? null : (v as 'success' | 'failure'))
                }
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="כל התוצאות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל התוצאות</SelectItem>
                  <SelectItem value="success">הצלחה</SelectItem>
                  <SelectItem value="failure">כישלון</SelectItem>
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
                      ? format(filters.dateFrom, 'd בMMM yyyy', { locale: he })
                      : 'תאריך התחלה'}
                    {filters.dateFrom && (
                      <X
                        className={styles.dateButtonClear}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFilter('dateFrom', null);
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.calendarPopover} align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom || undefined}
                    onSelect={(date) => updateFilter('dateFrom', date || null)}
                    initialFocus
                    className={styles.calendar}
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
                      ? format(filters.dateTo, 'd בMMM yyyy', { locale: he })
                      : 'תאריך סיום'}
                    {filters.dateTo && (
                      <X
                        className={styles.dateButtonClear}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFilter('dateTo', null);
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.calendarPopover} align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo || undefined}
                    onSelect={(date) => updateFilter('dateTo', date || null)}
                    initialFocus
                    className={styles.calendar}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
