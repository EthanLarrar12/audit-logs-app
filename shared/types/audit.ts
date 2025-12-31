export interface AuditEvent {
    id: string;
    created_at: string;
    category: string;
    actor_type: 'user' | 'system' | 'service';
    actor_id: string | null;
    actor_username: string | null;
    action: string;
    resource_name: string;
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
