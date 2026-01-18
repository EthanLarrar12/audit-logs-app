import { AuditEvent, AuditEventPage } from '../../shared/types/audit';

export type { AuditEvent, AuditEventPage };

export interface AuditFilters {
  searchInput?: string;
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

