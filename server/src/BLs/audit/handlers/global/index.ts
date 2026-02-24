import { GlobalFilterHandler } from "./types";
import { PremadeProfileGlobalHandler } from "./premadeProfileHandler";
import { RlsGlobalHandler } from "./rlsHandler";
import { DateRangeGlobalHandler } from "./dateRangeHandler";
import { SearchGlobalHandler } from "./searchHandler";

export const GLOBAL_HANDLERS: GlobalFilterHandler[] = [
  PremadeProfileGlobalHandler,
  RlsGlobalHandler,
  DateRangeGlobalHandler,
  SearchGlobalHandler,
];

export * from "./types";
