import React, { useState, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SuggestionResult } from "@/lib/api";
import { getActionIcon } from "@/constants/filterOptions";
import { CategoryBadge } from "../CategoryBadge";
import { FilterGroup } from "./FilterGroup";
import { styles } from "./GeneralSearch.styles";
import { useSuggestions } from "@/hooks/useSuggestions";
import { Virtuoso } from "react-virtuoso";

interface GeneralSearchProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onSelect: (val: string, type: string | null, isExact?: boolean) => void;
  onClear: () => void;
}

export const GeneralSearch: React.FC<GeneralSearchProps> = ({
  label,
  value,
  onChange,
  onSelect,
  onClear,
}) => {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSuggestions(value);

  const suggestions = data ? data.pages.flatMap((page) => page) : [];

  useEffect(() => {
    if (!value) {
      setIsSuggestionsOpen(false);
    }
  }, [value]);

  const handlePopoverOpenChange = (open: boolean): void => {
    if (open && !value) return;
    setIsSuggestionsOpen(open);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
    setIsSuggestionsOpen(true);
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === "Enter") {
      onSelect(value, null, false);
      setIsSuggestionsOpen(false);
    }
  };

  const handleInputFocus = (): void => {
    if (value && suggestions.length > 0) {
      setIsSuggestionsOpen(true);
    }
  };

  const handleClearSearch = (): void => {
    onClear();
    setIsSuggestionsOpen(false);
  };

  const handleSelectCurrentValue = (): void => {
    onSelect(value, null, false);
    setIsSuggestionsOpen(false);
  };

  const handleSelectSuggestion = (id: string, type: string | null): void => {
    onSelect(id, type, true);
    setIsSuggestionsOpen(false);
  };

  const renderRow = (index: number) => {
    // Render "Current Value" option as the first item if it exists
    if (index === 0 && value) {
      return (
        <div
          className={cn(
            styles.searchableDropdownItem,
            "border-b border-slate-50 italic",
          )}
          onClick={handleSelectCurrentValue}
        >
          <div className="flex items-center gap-2 text-brand">
            <Search className="h-4 w-4 opacity-70" />
            <span>חפש את: "{value}"</span>
          </div>
        </div>
      );
    }

    const suggestionIndex = value ? index - 1 : index;
    const suggestion = suggestions[suggestionIndex];

    if (!suggestion) return null;

    const actionIcon = getActionIcon(suggestion.id);

    // Determine if we should show a header
    const prevSuggestion =
      suggestionIndex > 0 ? suggestions[suggestionIndex - 1] : null;
    const showHeader =
      !prevSuggestion || suggestion.type !== prevSuggestion.type;

    // Map types to Hebrew labels
    const typeLabels: Record<string, string> = {
      USER: "משתמשים",
      SHOS: "שוס",
      ENTITY: "ישויות",
      DYNAMIC_TAG: "תגיות דינמיות",
      END_SYSTEM: "מערכות קצה",
      PROFILE: "פרופילים",
      DISTRIBUTION_GROUP: "קבוצות תפוצה",
      PARAMETER: "פרמטרים",
      SYSTEM: "מערכת",
    };

    return (
      <div
        className={styles.searchableDropdownItem}
        onClick={() => handleSelectSuggestion(suggestion.id, suggestion.type)}
      >
        <div className="w-full">
          {showHeader && (
            <div className="px-1 py-1 text-xs font-semibold text-muted-foreground bg-slate-50 border-b border-t border-slate-100 sticky top-0 z-10 w-full text-right mb-2">
              {typeLabels[suggestion.type] || suggestion.type}
            </div>
          )}
          <div className="flex items-center gap-2">
            {actionIcon ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 opacity-70 flex items-center justify-center">
                  {(() => {
                    const IconComponent = actionIcon;
                    return <IconComponent className="h-4 w-4 text-slate-500" />;
                  })()}
                </div>
                <span>
                  {suggestion.name
                    ? `${suggestion.name} (${suggestion.id})`
                    : suggestion.id}
                </span>
              </div>
            ) : (
              <CategoryBadge
                category={suggestion.type}
                label={
                  suggestion.name
                    ? `${suggestion.name} (${suggestion.id})`
                    : suggestion.id
                }
                className="bg-transparent border-none p-0 h-auto lowercase"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const totalCount = suggestions.length + (value ? 1 : 0);

  return (
    <FilterGroup label={label}>
      <Popover open={isSuggestionsOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <div className={styles.searchContainer}>
            {isLoading && suggestions.length === 0 ? (
              <Loader2 className={styles.loader} />
            ) : (
              <Search className={styles.searchIcon} />
            )}
            <Input
              className={styles.searchInput}
              placeholder="הקלידו לחיפוש..."
              value={value || ""}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={handleInputFocus}
            />
            {value && (
              <button
                onClick={handleClearSearch}
                className={styles.clearSearchButton}
              >
                <X className={styles.clearIcon} />
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            styles.searchableDropdownContent,
            "w-[var(--radix-popover-trigger-width)]",
          )}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className={styles.searchableDropdownList} dir="rtl">
            {totalCount > 0 ? (
              <Virtuoso
                className="scrollbar-thin scrollbar-webkit"
                style={{ height: Math.min(totalCount * 36, 300) }} // Adjust height as needed
                totalCount={totalCount}
                itemContent={renderRow}
                endReached={() =>
                  hasNextPage && !isFetchingNextPage && fetchNextPage()
                }
                footer={() =>
                  isFetchingNextPage ? (
                    <div className="p-2 flex justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : null
                }
              />
            ) : (
              !isLoading && (
                <div className="p-2 text-center text-muted-foreground">
                  לא נמצאו תוצאות
                </div>
              )
            )}
          </div>
        </PopoverContent>
      </Popover>
    </FilterGroup>
  );
};
