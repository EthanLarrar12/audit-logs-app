import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { styles } from "./calendar.styles";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles.calendar, className)}
      classNames={{
        months: styles.months,
        month: styles.month,
        caption: styles.caption,
        caption_label: styles.caption_label,
        nav: styles.nav,
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          styles.nav_button,
        ),
        nav_button_previous: styles.nav_button_previous,
        nav_button_next: styles.nav_button_next,
        table: styles.table,
        head_row: styles.head_row,
        head_cell: styles.head_cell,
        row: styles.row,
        cell: styles.cell,
        day: cn(buttonVariants({ variant: "ghost" }), styles.day),
        day_range_end: "day-range-end",
        day_selected: styles.day_selected,
        day_today: styles.day_today,
        day_outside: styles.day_outside,
        day_disabled: styles.day_disabled,
        day_range_middle: styles.day_range_middle,
        day_hidden: styles.day_hidden,
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
