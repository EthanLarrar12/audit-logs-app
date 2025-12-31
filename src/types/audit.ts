import { AuditEvent, AuditEventPage } from '../../shared/types/audit';

export type { AuditEvent, AuditEventPage };

export interface AuditFilters {
  searchInput: string | null;
  actorSearch: string | null;
  targetSearch: string | null;
  resourceSearch: string | null;
  actorUsername: string | null;
  category: string | null;
  action: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
