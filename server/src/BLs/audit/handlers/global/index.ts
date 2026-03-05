import { GlobalFilterHandler } from "./types";
import { PremadeProfileGlobalHandler } from "./premadeProfileHandler";
import { DateRangeGlobalHandler } from "./dateRangeHandler";
import { SearchGlobalHandler } from "./searchHandler";
import { ActionIdGlobalHandler } from "./actionIdHandler";

export const GLOBAL_HANDLERS: GlobalFilterHandler[] = [
  PremadeProfileGlobalHandler,
  DateRangeGlobalHandler,
  SearchGlobalHandler,
  ActionIdGlobalHandler,
];

export * from "./types";
