import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FilterGroup } from "./FilterGroup";
import { styles } from "./MultiSelectFilter.styles";

interface MultiSelectOption {
  id: string;
  renderItem: () => React.ReactNode;
  renderBadge: (onRemove?: () => void) => React.ReactNode;
}

interface MultiSelectFilterProps {
  label: string;
  selected: string[];
  options: MultiSelectOption[];
  onToggle: (id: string) => void;
  onClear: () => void;
  placeholder: string;
  disabled?: boolean;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  selected,
  options,
  onToggle,
  onClear,
  placeholder,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = (): void => {
    onClear();
    setIsOpen(false);
  };

  const handleToggle = (id: string): void => {
    onToggle(id);
  };

  return (
    <FilterGroup label={label}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              styles.trigger,
              "flex items-center justify-between w-full h-auto min-h-10 p-1 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors",
            )}
            role="combobox"
            dir="rtl"
          >
            <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden">
              {selected.length > 0 ? (
                selected.map((id) => {
                  const option = options.find((o) => o.id === id);
                  if (!option) return null;
                  return (
                    <div
                      key={id}
                      className="flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {option.renderBadge ? (
                        option.renderBadge(() => handleToggle(id))
                      ) : (
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg pl-1 pr-2 py-0.5 max-w-[200px]">
                          <span className="text-xs truncate">{id}</span>
                          <div
                            className="cursor-pointer hover:bg-slate-200 rounded-full p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(id);
                            }}
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <span className={cn(styles.placeholder, "px-2")}>
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className={styles.content} align="end">
          <div className={styles.list} dir="rtl">
            <div
              className={cn(
                styles.item,
                selected.length === 0 && styles.itemSelected,
              )}
              onClick={handleClear}
            >
              <span>{placeholder}</span>
              {selected.length === 0 && <Check className="h-4 w-4" />}
            </div>
            {options.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <div
                  key={option.id}
                  className={cn(styles.item, isSelected && styles.itemSelected)}
                  onClick={() => handleToggle(option.id)}
                >
                  {option.renderItem()}
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </FilterGroup>
  );
};
