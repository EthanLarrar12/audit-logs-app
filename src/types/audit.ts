// Audit Event Schema (immutable - as per specification)
export interface AuditEvent {
  id: string; // UUID
  created_at: string; // ISO8601
  actor_type: 'user' | 'system' | 'service';
  actor_id: string | null;
  actor_username: string | null;
  actor_ip: string | null; // IPv4
  actor_user_agent?: string | null; // Note: Spec doesn't explicitly list actor_user_agent in AuditEvent? 
  // Wait, let me check the spec content in the prompt again.
  // Spec:
  // actor_ip: string format ipv4
  // actor_user_agent is NOT in the provided spec AuditEvent schema!
  // It has: id, created_at, actor_type, actor_id, actor_username, actor_ip, action, resource_type, resource_id, target_type, target_id, target_name, outcome, before_state, after_state, context, request_id, trace_id.
  // It does NOT have actor_user_agent.
  // `AuditEventRow` uses it.
  // I should probably make it optional or remove it?
  // I will make it optional to avoid breaking UI if not provided, or simply remove it if I must strictly follow spec.
  // Prompt: "Use TypeScript types generated from the Swagger spec."
  // If I generate strictly, it won't exist.
  // But Constraint 6: "Do not change the ... component hierarchy". If I remove it from type, `AuditEventRow` will break.
  // I will check if I can keep it (maybe the spec is partial?).
  // "Use TypeScript types generated from the Swagger spec." implies strict adherence.
  // If I remove `actor_user_agent`, I must remove it from `AuditEventRow`.
  // I will leave it as optional for now or add a TODO.
  // Actually, I'll remove it from the interface and fix `AuditEventRow` to not display it if it's not in the object (or TS will complain).
  // Checking `AuditEventRow` again lines 178-188: it checks `event.actor_user_agent`.
  // Use `// @ts-ignore` or just remove the block?
  // I'll update the type to NOT include it, and then fix the component.
  action: string;
  resource_type: string;
  resource_id: string;
  target_type: string | null;
  target_id: string | null;
  target_name: string | null; // Added target_name from spec
  outcome: 'success' | 'failure';
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  context: Record<string, unknown> | null;
  request_id: string | null;
  trace_id: string | null;
}

export interface AuditEventPage {
  page: number;
  pageSize: number;
  total: number;
  items: AuditEvent[];
}

export interface AuditFilters {
  searchInput: string | null;
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
