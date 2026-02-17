export interface AuditEvent {
  id: string;
  created_at: string;
  category: string;
  actor_type:
    | "USER"
    | "ENTITY"
    | "SHOS"
    | "DYNAMIC_TAG"
    | "END_SYSTEM"
    | "PROFILE"
    | "DISTRIBUTION_GROUP"
    | "PARAMETER"
    | "SYSTEM";
  actor_id: string | null;
  actor_username: string | null;
  action: string;
  resource_name: string;
  resource_id: string;
  resource_type: string | null;
  target_id: string | null;
  target_name: string | null;
  target_type: string | null;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  context: Record<string, unknown> | null;
}

export interface AuditEventPage {
  page: number;
  items: AuditEvent[];
}
