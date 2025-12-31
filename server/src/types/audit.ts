import { AuditEvent, AuditEventPage } from '../../../shared/types/audit';

export type { AuditEvent, AuditEventPage };

export interface AuditQueryParams {
    page?: number;
    pageSize?: number;
    from?: string;
    to?: string;
    actorUsername?: string;
    category?: string;
    action?: string;
    searchInput?: string;
    sort?: 'created_at' | 'action' | 'actor_username' | 'target_name';
    order?: 'asc' | 'desc';
}
