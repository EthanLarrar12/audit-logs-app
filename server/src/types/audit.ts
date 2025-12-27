// Audit Event Schema (matching frontend)
export interface AuditEvent {
    id: string;
    created_at: string;
    actor_type: 'user' | 'system' | 'service';
    actor_id: string | null;
    actor_username: string | null;
    actor_ip: string | null;
    actor_user_agent?: string | null;
    action: string;
    resource_type: string;
    resource_id: string;
    target_type: string | null;
    target_id: string | null;
    target_name: string | null;
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

export interface AuditQueryParams {
    page?: number;
    pageSize?: number;
    from?: string;
    to?: string;
    actorUsername?: string;
    actorType?: 'user' | 'system' | 'service';
    targetName?: string;
    action?: string;
    resourceType?: string;
    outcome?: 'success' | 'failure';
    searchInput?: string;
    sort?: 'created_at' | 'action' | 'actor_username' | 'target_name';
    order?: 'asc' | 'desc';
}
