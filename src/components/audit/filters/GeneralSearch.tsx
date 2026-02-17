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
  onSelect: (
    val: string,
    type: string | null,
    isExact?: boolean,
    name?: string,
  ) => void;
  onClear: () => void;
  selectedItems?: { id: string; name?: string; type: string }[];
  onRemove?: (id: string) => void;
}

export const GeneralSearch: React.FC<GeneralSearchProps> = ({
  label,
  value,
  onChange,
  onSelect,
  onClear,
  selectedItems = [],
  onRemove,
}) => {
  // const [selectedItem, setSelectedItem] = useState<{ ... } | null>(null); // Removed internal state

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
    // Handle backspace to remove last item if input is empty
    if (
      e.key === "Backspace" &&
      !value &&
      selectedItems.length > 0 &&
      onRemove
    ) {
      onRemove(selectedItems[selectedItems.length - 1].id);
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
    onSelect(value, null, false, value); // Pass value as name too
    setIsSuggestionsOpen(false);
  };

  const handleSelectSuggestion = (
    id: string,
    type: string | null,
    name?: string,
  ): void => {
    onSelect(id, type, true, name);
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
      <div className="w-full">
        {showHeader && (
          <div className="px-1 py-1 text-xs font-semibold text-muted-foreground bg-slate-50 border-b border-t border-slate-100 sticky top-0 z-10 w-full text-right mb-2">
            {typeLabels[suggestion.type] || suggestion.type}
          </div>
        )}
        <div
          className={styles.searchableDropdownItem}
          onClick={() =>
            handleSelectSuggestion(
              suggestion.id,
              suggestion.type,
              suggestion.name,
            )
          }
        >
          <div className="w-full">
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
      </div>
    );
  };

  const totalCount = suggestions.length + (value ? 1 : 0);
  const showScrollbar = totalCount > 1;

  return (
    <FilterGroup label={label}>
      <Popover open={isSuggestionsOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              styles.searchContainer,
              "flex flex-nowrap items-center h-10 overflow-x-auto overflow-y-hidden scrollbar-none",
            )}
          >
            {/* Render Chips */}
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center flex-shrink-0 p-1 bg-slate-100 rounded-full mr-1 max-w-[200px]"
              >
                <CategoryBadge
                  category={item.type || "default"}
                  label={item.name || item.id}
                  className="bg-transparent border-none p-0 pr-1 truncate text-xs"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove && onRemove(item.id);
                  }}
                  className="p-0.5 hover:bg-slate-200 rounded-full ml-1"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}

            {/* Render Input */}
            <div className="flex-1 min-w-[100px] flex items-center flex-shrink-0 h-full">
              {isLoading &&
                suggestions.length === 0 &&
                !selectedItems.length ? (
                <Loader2 className={styles.loader} />
              ) : (
                selectedItems.length === 0 && (
                  <Search className={styles.searchIcon} />
                )
              )}
              <Input
                className={cn(
                  styles.searchInput,
                  "h-full min-w-[50px] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0",
                )}
                placeholder={selectedItems.length > 0 ? "" : "הקלידו לחיפוש..."}
                value={value || ""}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
              />
            </div>

            {(value || selectedItems.length > 0) && (
              <button
                onClick={handleClearSearch}
                className={cn(
                  styles.clearSearchButton,
                  "self-center flex-shrink-0 ml-2 relative left-auto top-auto transform-none",
                )}
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
                className={cn({
                  "scrollbar-thin scrollbar-webkit": showScrollbar,
                  "overflow-hidden": !showScrollbar,
                })}
                style={{ height: Math.min(totalCount * 44, 300) }} // Adjust height as needed
                totalCount={totalCount}
                itemContent={renderRow}
                endReached={() =>
                  hasNextPage && !isFetchingNextPage && fetchNextPage()
                }
                components={{
                  Footer: () =>
                    isFetchingNextPage ? (
                      <div className="p-2 flex justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : null,
                }}
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
