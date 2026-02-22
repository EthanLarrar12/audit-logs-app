import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { useShadowContainer } from "@/lib/shadow-Root-Context";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const container = useShadowContainer();
  return (
    <PopoverPrimitive.Portal container={container as HTMLElement}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        onInteractOutside={(e) => {
          // Fix for Radix UI inside Shadow DOM
          const target = e.detail.originalEvent.target as HTMLElement;
          if (target.closest?.('.audit-logs-wrapper')) {
            const path = e.detail.originalEvent.composedPath();
            // If the click actually originated inside the popover content, don't close
            if (typeof ref !== 'function' && ref?.current && path.includes(ref.current as any)) {
              e.preventDefault();
            }
          }
          props.onInteractOutside?.(e);
        }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
