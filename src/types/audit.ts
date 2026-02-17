import { AuditEvent, AuditEventPage } from "../../shared/types/audit";

export type { AuditEvent, AuditEventPage };

export enum FilterField {
  SEARCH_INPUT = "searchInput",
  GENERAL_SEARCH_OBJECTS = "generalSearchObjects",
  SEARCH_INPUT_IS_EXACT = "searchInputIsExact",
  SEARCH_INPUT_TYPE = "searchInputType",
  ACTOR_SEARCH = "actorSearch",
  TARGET_SEARCH = "targetSearch",
  RESOURCE_SEARCH = "resourceSearch",
  ACTOR_USERNAME = "actorUsername",
  CATEGORY = "category",
  ACTION = "action",
  PREMADE_PROFILE = "premadeProfile",
  DATE_FROM = "dateFrom",
  DATE_TO = "dateTo",
}

export interface AuditFilters {
  searchInput?: string[];
  generalSearchObjects?: { id: string; name?: string; type: string }[];
  searchInputIsExact?: boolean;
  searchInputType?: string;
  actorSearch?: string;
  targetSearch?: string;
  resourceSearch?: string;
  actorUsername?: string;
  category?: string[];
  action?: string[];
  premadeProfile?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
