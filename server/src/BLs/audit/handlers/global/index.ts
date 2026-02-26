import { GlobalFilterHandler } from "./types";
import { PremadeProfileGlobalHandler } from "./premadeProfileHandler";
import { DateRangeGlobalHandler } from "./dateRangeHandler";
import { SearchGlobalHandler } from "./searchHandler";

export const GLOBAL_HANDLERS: GlobalFilterHandler[] = [
  PremadeProfileGlobalHandler,
  DateRangeGlobalHandler,
  SearchGlobalHandler,
];

export * from "./types";
