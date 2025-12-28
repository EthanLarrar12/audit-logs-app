// Audit Event Schema (immutable - as per specification)
export interface AuditEvent {
  id: string; // UUID
  created_at: string; // ISO8601
  category: string;
  actor_type: 'user' | 'system' | 'service';
  actor_id: string | null;
  actor_username: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  target_id: string | null;
  target_name: string | null;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  context: Record<string, unknown> | null;
}

export interface AuditEventPage {
  page: number;
  pageSize: number;
  total: number;
  items: AuditEvent[];
}

export interface AuditFilters {
  searchInput: string | null;
  category: string | null;
  action: string | null;
  resource_type: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
