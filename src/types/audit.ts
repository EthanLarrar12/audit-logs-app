// Audit Event Schema (immutable - as per specification)
export interface AuditEvent {
  id: string; // UUID
  created_at: string; // ISO8601
  actor_type: 'user' | 'system' | 'service';
  actor_id: string | null;
  actor_name: string | null; // Display name for the actor
  actor_ip: string | null;
  actor_user_agent: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  target_type: string | null;
  target_id: string | null;
  outcome: 'success' | 'failure';
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  context: Record<string, unknown> | null;
  request_id: string | null;
  trace_id: string | null;
}

export interface AuditFilters {
  action: string | null;
  actor_type: 'user' | 'system' | 'service' | null;
  resource_type: string | null;
  outcome: 'success' | 'failure' | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
