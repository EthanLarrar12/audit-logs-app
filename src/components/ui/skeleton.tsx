import * as React from "react";
import { cn } from "@/lib/utils";
import { styles } from "./skeleton.styles";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.skeleton, className)} {...props} />;
}

export { Skeleton };
