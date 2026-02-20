import './AuditLogs.css';

// The iframe is rendered persistently in Layout.tsx (lazy-mounted, CSS-hidden when off-route).
// This page intentionally renders nothing — it just signals the route is active.
export function AuditLogs() {
    return <div className="audit-logs-placeholder" />;
}
