import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { Search, Loader2, X, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SuggestionResult } from "@/lib/api";
import { getActionIcon } from "@/constants/filterOptions";
import { CategoryBadge } from "../CategoryBadge";
import { FilterGroup } from "./FilterGroup";
import { styles } from "./GeneralSearch.styles";
import { useSuggestions } from "@/hooks/useSuggestions";
import { Virtuoso } from "react-virtuoso";
import pizponGif from "@/assets/pizpon.gif";

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
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isPizponActive, setIsPizponActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(1);

  const updateVisibleCount = useCallback(() => {
    if (!containerRef.current || !measureRef.current) return;
    if (selectedItems.length === 0) {
      setVisibleCount(1);
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    if (containerWidth === 0) return;

    // We need space for: the input placeholder/field, padding, and clear buttons.
    const RESERVED_WIDTH = 85;
    const BADGE_WIDTH = 45;

    let availableWidth = containerWidth - RESERVED_WIDTH;
    let count = 0;

    const chipNodes = Array.from(measureRef.current.children) as HTMLElement[];

    for (let i = 0; i < chipNodes.length; i++) {
      const chipWidth = chipNodes[i].offsetWidth + 4; // Add 4px for mr-1 gap
      const isLastItem = i === chipNodes.length - 1;

      const requiredWidth = chipWidth + (isLastItem ? 0 : BADGE_WIDTH);

      if (availableWidth >= requiredWidth) {
        count++;
        availableWidth -= chipWidth;
      } else {
        break;
      }
    }

    setVisibleCount(Math.max(1, count));
  }, [selectedItems]);

  useLayoutEffect(() => {
    updateVisibleCount();

    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateVisibleCount();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [updateVisibleCount]);

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

  const triggerPizponIfNeeded = (val: string) => {
    if (val === "לא הוא משוכנע") {
      setIsPizponActive(true);
      setTimeout(() => {
        setIsPizponActive(false);
      }, 5000);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === "Enter") {
      triggerPizponIfNeeded(value);
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
    triggerPizponIfNeeded(value);
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
                      return (
                        <IconComponent className="h-4 w-4 text-slate-500" />
                      );
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

  const showAll = isExpanded || selectedItems.length <= visibleCount;
  const visibleItems = showAll
    ? selectedItems
    : selectedItems.slice(0, visibleCount);
  const hiddenItems = showAll ? [] : selectedItems.slice(visibleCount);

  return (
    <FilterGroup label={label}>
      <Popover open={isSuggestionsOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <div
            ref={containerRef}
            onClick={() => inputRef.current?.focus()}
            className={cn(
              styles.searchContainer,
              "flex items-center transition-all duration-200 cursor-text overflow-hidden relative",
              isExpanded
                ? "flex-wrap h-auto min-h-10 py-1 gap-y-1"
                : "flex-nowrap h-10",
            )}
          >
            {/* Hidden container to measure chips width accurately */}
            <div
              ref={measureRef}
              className="absolute opacity-0 pointer-events-none flex whitespace-nowrap -z-10 h-0 overflow-hidden"
              style={{ width: "2000px" }}
              aria-hidden="true"
            >
              {selectedItems.map((item) => (
                <div
                  key={`measure-${item.id}`}
                  className="flex items-center flex-shrink-0 p-1 bg-slate-100 rounded-full mr-1 max-w-[200px]"
                >
                  <CategoryBadge
                    category={item.type || "default"}
                    label={item.name || item.id}
                    className="bg-transparent border-none p-0 pr-1 truncate text-xs"
                  />
                  <div className="p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>

            {/* Render Chips */}
            {visibleItems.map((item) => (
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

            {!showAll && hiddenItems.length > 0 && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsExpanded(true);
                      }}
                      className="flex items-center flex-shrink-0 p-1 px-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-full mr-1 cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-semibold text-slate-600">
                        +{hiddenItems.length}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[300px] flex flex-wrap gap-1 p-2"
                  >
                    {hiddenItems.map((item) => (
                      <CategoryBadge
                        key={item.id}
                        category={item.type || "default"}
                        label={item.name || item.id}
                        className="bg-slate-100 border border-slate-200 p-0.5 pr-1.5 pl-1.5 truncate text-[10px]"
                      />
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {isExpanded && selectedItems.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="flex items-center justify-center flex-shrink-0 p-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-full mr-1 cursor-pointer transition-colors w-7 h-7"
                title="הצג פחות"
              >
                <ChevronUp className="h-4 w-4 text-slate-600" />
              </button>
            )}

            {/* Render Input */}
            <div
              className={cn(
                "flex-1 min-w-[40px] flex items-center flex-shrink-0 cursor-text",
                isExpanded ? "h-8" : "h-full",
              )}
              onClick={(e) => {
                inputRef.current?.focus();
                setIsSuggestionsOpen(true);
              }}
            >
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
                ref={inputRef}
                className={cn(
                  styles.searchInput,
                  "w-full min-w-[20px] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-full",
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
                style={{
                  height: Math.min(
                    (value ? 45 : 0) + // Height for "Search for..." option
                      suggestions.reduce((acc, curr, index) => {
                        const prev = index > 0 ? suggestions[index - 1] : null;
                        const hasHeader = !prev || curr.type !== prev.type;
                        return acc + 44 + (hasHeader ? 28 : 0); // Item height + header height
                      }, 0),
                    300,
                  ),
                }}
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
      {isPizponActive && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          <img
            src={pizponGif}
            className="absolute w-64 h-auto animate-pizpon-bounce"
            alt="Pizpon"
          />
        </div>
      )}
    </FilterGroup>
  );
};
