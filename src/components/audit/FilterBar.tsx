import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Filter,
  X,
  RotateCcw,
  Search,
  Loader2,
  Check,
  ChevronsUpDown,
  User as UserIcon,
  Target as TargetIcon,
  Box as BoxIcon,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { AuditFilters } from '@/types/audit';
import { AUDIT_CATEGORIES, getSubcategoryName, getActionIcon } from '@/constants/filterOptions';
import { CategoryBadge } from './CategoryBadge';
import { fetchPremadeProfiles, fetchSuggestions, SuggestionResult } from '@/lib/api';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [premadeProfiles, setPremadeProfiles] = useState<{ id: string, name: string }[]>([]);
  const [profileSearchText, setProfileSearchText] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

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

  useEffect(() => {
    if (!isProfileOpen) setProfileSearchText('');
  }, [isProfileOpen]);

  // Handle autocomplete suggestions fetching
  useEffect(() => {
    const term = searchValues.searchInput;
    if (!term || term.length < 2) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggestionsLoading(true);
      try {
        const data = await fetchSuggestions(term);
        setSuggestions(data);
        if (data.length > 0) {
          setIsSuggestionsOpen(true);
        } else {
          setIsSuggestionsOpen(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValues.searchInput]);

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
      {/* Header with Reset Button only */}
      <div className={styles.header}>
        <div /> {/* Spacer to keep reset button on the left */}
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

      {/* Main filters grid */}
      <div className={styles.controlsContainer}>
        {/* Permanent First row */}
        <div className={styles.firstFiltersRow}>
          {/* General Search with Autocomplete */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>
              חיפוש כללי (מבצע, יעד, משאב)
            </label>
            <Popover open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
              <PopoverTrigger asChild>
                <div className={styles.searchContainer}>
                  {isSuggestionsLoading ? (
                    <Loader2 className={styles.loader} />
                  ) : (
                    <Search className={styles.searchIcon} />
                  )}
                  <Input
                    className={styles.searchInput}
                    placeholder="הקלידו לחיפוש..."
                    value={searchValues.searchInput || ''}
                    onChange={(e) => handleSearchChange('searchInput', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsSuggestionsOpen(false);
                      }
                    }}
                    onFocus={() => {
                      if (suggestions.length > 0) setIsSuggestionsOpen(true);
                    }}
                  />
                  {searchValues.searchInput && (
                    <button
                      onClick={() => handleSearchChange('searchInput', '')}
                      className={styles.clearSearchButton}
                    >
                      <X className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={cn(styles.searchableDropdownContent, "w-[var(--radix-popover-trigger-width)]")}
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()} // Don't steal focus from input
              >
                <div className={styles.searchableDropdownList} dir="rtl">
                  {suggestions.map((suggestion) => {
                    const actionIcon = getActionIcon(suggestion.text);

                    return (
                      <div
                        key={`${suggestion.text}-${suggestion.type}`}
                        className={styles.searchableDropdownItem}
                        onClick={() => {
                          handleSearchChange('searchInput', suggestion.text);
                          setIsSuggestionsOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {actionIcon ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 opacity-70 flex items-center justify-center">
                                {(() => {
                                  const IconComponent = actionIcon;
                                  return <IconComponent className="h-4 w-4 text-slate-500" />;
                                })()}
                              </div>
                              <span>{suggestion.text}</span>
                            </div>
                          ) : (
                            <CategoryBadge
                              category={suggestion.type}
                              label={suggestion.text}
                              className="bg-transparent border-none p-0 h-auto lowercase"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
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
              {/* Actor Search (Permanent) */}
              <div className={styles.filterGroup}>
                <label className={styles.label}>
                  מזהה/שם המבצע
                </label>
                <div className={styles.searchContainer}>
                  <Search className={styles.searchIcon} />
                  <Input
                    className={styles.searchInput}
                    placeholder="חיפוש לפי מבצע..."
                    value={searchValues.actorSearch || ''}
                    onChange={(e) => handleSearchChange('actorSearch', e.target.value)}
                  />
                </div>
              </div>

              {/* Category filter */}
              <div className={styles.largeFilterGroup}>
                <label className={styles.label}>
                  קטגוריה
                </label>
                <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      dir="rtl"
                      className={cn(styles.largeTrigger, "justify-between text-right px-3")}
                    >
                      <div className={styles.triggerWrapperRight}>
                        {filters.category && filters.category.length > 0 ? (
                          <div className="flex gap-1 items-center overflow-hidden">
                            {filters.category.slice(0, 1).map(catId => (
                              <CategoryBadge key={catId} category={catId} className="h-6 py-0 px-2" />
                            ))}
                            {filters.category.length > 1 && (
                              <div className={styles.plusChip}>+{filters.category.length - 1}</div>
                            )}
                          </div>
                        ) : (
                          <span className={styles.placeholderText}>כל הקטגוריות</span>
                        )}
                      </div>
                      <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={styles.searchableDropdownContent} align="end">
                    <div className={styles.searchableDropdownList} dir="rtl">
                      <div
                        className={cn(
                          styles.searchableDropdownItem,
                          (!filters.category || filters.category.length === 0) && styles.searchableDropdownItemSelected
                        )}
                        onClick={() => {
                          updateFilter('category', null);
                          updateFilter('action', null);
                          setIsCategoryOpen(false);
                        }}
                      >
                        <span>כל הקטגוריות</span>
                        {(!filters.category || filters.category.length === 0) && <Check className="h-4 w-4" />}
                      </div>
                      {AUDIT_CATEGORIES.map((cat) => {
                        const isSelected = filters.category?.includes(cat.id);
                        return (
                          <div
                            key={cat.id}
                            className={cn(
                              styles.searchableDropdownItem,
                              isSelected && styles.searchableDropdownItemSelected
                            )}
                            onClick={() => {
                              toggleMultiFilter('category', cat.id);
                              // If we unselect a category, we might need to clear actions that belonged only to it
                              // For simplicity, we filter actions later in the component
                            }}
                          >
                            <CategoryBadge category={cat.id} />
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Subcategory (Action) filter */}
              <div className={styles.largeFilterGroup}>
                <label className={styles.label}>
                  תת-קטגוריה
                </label>
                <Popover open={isActionOpen} onOpenChange={setIsActionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      dir="rtl"
                      disabled={selectedCategories.length === 0}
                      className={cn(styles.largeTrigger, "justify-between text-right px-3")}
                    >
                      <div className={styles.triggerWrapperRight}>
                        {filters.action && filters.action.length > 0 ? (
                          <div className="flex gap-1 items-center overflow-hidden">
                            {filters.action.slice(0, 1).map(actionId => (
                              <CategoryBadge
                                key={actionId}
                                category={AUDIT_CATEGORIES.find(c => c.subcategories.some(s => s.id === actionId))?.id || 'USER'}
                                label={getSubcategoryName(actionId)}
                                icon={getActionIcon(actionId)}
                                className="h-6 py-0 px-2"
                              />
                            ))}
                            {filters.action.length > 1 && (
                              <div className={styles.plusChip}>+{filters.action.length - 1}</div>
                            )}
                          </div>
                        ) : (
                          <span className={styles.placeholderText}>
                            {selectedCategories.length === 0 ? "בחר קטגוריה תחילה" : "כל התת-קטגוריות"}
                          </span>
                        )}
                      </div>
                      <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={styles.searchableDropdownContent} align="end">
                    <div className={styles.searchableDropdownList} dir="rtl">
                      <div
                        className={cn(
                          styles.searchableDropdownItem,
                          (!filters.action || filters.action.length === 0) && styles.searchableDropdownItemSelected
                        )}
                        onClick={() => {
                          updateFilter('action', null);
                          setIsActionOpen(false);
                        }}
                      >
                        <span>כל התת-קטגוריות</span>
                        {(!filters.action || filters.action.length === 0) && <Check className="h-4 w-4" />}
                      </div>
                      {selectedCategories.flatMap(c => c.subcategories).map((sub) => {
                        const isSelected = filters.action?.includes(sub.id);
                        const catId = AUDIT_CATEGORIES.find(c => c.subcategories.some(s => s.id === sub.id))?.id || 'USER';
                        return (
                          <div
                            key={sub.id}
                            className={cn(
                              styles.searchableDropdownItem,
                              isSelected && styles.searchableDropdownItemSelected
                            )}
                            onClick={() => {
                              toggleMultiFilter('action', sub.id);
                            }}
                          >
                            <CategoryBadge
                              category={catId}
                              label={sub.name}
                              icon={getActionIcon(sub.id)}
                            />
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        );
                      })}
                    </div>
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
                      {filterDef.searchField === 'premadeProfile' ? (
                        <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              dir="rtl"
                              aria-expanded={isProfileOpen}
                              className={cn(styles.selectTrigger, "justify-between text-right px-3")}
                            >
                              <div className={styles.triggerWrapperRight}>
                                <span className={cn("truncate", !filters.premadeProfile && styles.placeholderText)}>
                                  {filters.premadeProfile
                                    ? premadeProfiles.find((p) => p.id === filters.premadeProfile)?.name
                                    : "בחר פרופיל..."}
                                </span>
                              </div>
                              <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className={styles.searchableDropdownContent} align="end">
                            <div className={styles.searchableDropdownSearch} dir="rtl">
                              <Search className="h-4 w-4 opacity-50" />
                              <input
                                placeholder="חיפוש פרופיל..."
                                className={styles.searchableDropdownSearchInput}
                                value={profileSearchText}
                                onChange={(e) => setProfileSearchText(e.target.value)}
                              />
                            </div>
                            <div className={styles.searchableDropdownList} dir="rtl">
                              <div
                                className={cn(
                                  styles.searchableDropdownItem,
                                  !filters.premadeProfile && styles.searchableDropdownItemSelected
                                )}
                                onClick={() => {
                                  updateFilter('premadeProfile', null);
                                  setIsProfileOpen(false);
                                }}
                              >
                                <span>כל הפרופילים</span>
                                {!filters.premadeProfile && <Check className="h-4 w-4" />}
                              </div>
                              {premadeProfiles
                                .filter((p) => p.name.includes(profileSearchText))
                                .map((profile) => (
                                  <div
                                    key={profile.id}
                                    className={cn(
                                      styles.searchableDropdownItem,
                                      filters.premadeProfile === profile.id && styles.searchableDropdownItemSelected
                                    )}
                                    onClick={() => {
                                      updateFilter('premadeProfile', profile.id);
                                      setIsProfileOpen(false);
                                    }}
                                  >
                                    <span>{profile.name}</span>
                                    {filters.premadeProfile === profile.id && <Check className="h-4 w-4" />}
                                  </div>
                                ))}
                              {premadeProfiles.filter((p) => p.name.includes(profileSearchText)).length === 0 && (
                                <div className={styles.searchableDropdownNoResults}>
                                  לא נמצאו תוצאות
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
