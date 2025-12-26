import { useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, Globe, Fingerprint, Network, CheckCircle2, XCircle } from 'lucide-react';
import { AuditEvent } from '@/types/audit';
import { ActorTypeBadge } from './ActorTypeBadge';
import { TargetTypeBadge } from './TargetTypeBadge';
import { cn } from '@/lib/utils';

interface AuditEventRowProps {
  event: AuditEvent;
}

export function AuditEventRow({ event }: AuditEventRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = format(new Date(event.created_at), 'd בMMM yyyy', { locale: he });
  const formattedTime = format(new Date(event.created_at), 'HH:mm:ss');

  return (
    <div
      className={cn(
        'border rounded-lg bg-card transition-all duration-200',
        isExpanded && 'ring-1 ring-primary/20',
        event.outcome === 'failure' && 'border-failure/30 bg-failure/5'
      )}
    >
      {/* Main row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full grid grid-cols-12 gap-4 px-4 py-3 items-center text-right hover:bg-table-row-hover transition-colors rounded-lg"
      >
        {/* Timestamp */}
        <div className="col-span-2 flex items-center gap-2">
          <span className="text-muted-foreground shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {formattedDate}
            </div>
            <div className="text-xs text-muted-foreground font-mono" dir="ltr">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Actor Type */}
        <div className="col-span-2">
          <ActorTypeBadge type={event.actor_type} />
        </div>

        {/* Username & User ID */}
        <div className="col-span-2 min-w-0">
          <div className="text-sm text-foreground truncate">
            {event.actor_name || '—'}
          </div>
          {event.actor_id && (
            <div className="text-xs text-muted-foreground font-mono truncate" dir="ltr">
              {event.actor_id}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="col-span-2 min-w-0">
          <div className="text-sm font-medium text-primary truncate" dir="ltr">{event.action}</div>
        </div>

        {/* Resource */}
        <div className="col-span-2 min-w-0">
          <div className="text-sm text-foreground truncate">{event.resource_type}</div>
          <div className="text-xs text-muted-foreground font-mono truncate" dir="ltr">
            {event.resource_id}
          </div>
        </div>

        {/* Target Type */}
        <div className="col-span-2">
          <TargetTypeBadge type={event.target_type} />
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t space-y-4 animate-fade-in">
          {/* Outcome indicator */}
          <div className="flex items-center gap-2">
            {event.outcome === 'success' ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 className="w-4 h-4" />
                הצלחה
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-failure">
                <XCircle className="w-4 h-4" />
                כישלון
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Metadata */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                פרטי האירוע
              </h4>
              <dl className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Fingerprint className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <dt className="text-muted-foreground">מזהה אירוע</dt>
                    <dd className="font-mono text-xs text-foreground break-all" dir="ltr">
                      {event.id}
                    </dd>
                  </div>
                </div>
                {event.actor_ip && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <dt className="text-muted-foreground">כתובת IP</dt>
                      <dd className="font-mono text-xs text-foreground" dir="ltr">
                        {event.actor_ip}
                      </dd>
                    </div>
                  </div>
                )}
                {event.request_id && (
                  <div className="flex items-start gap-2">
                    <Network className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <dt className="text-muted-foreground">מזהה בקשה</dt>
                      <dd className="font-mono text-xs text-foreground" dir="ltr">
                        {event.request_id}
                      </dd>
                    </div>
                  </div>
                )}
                {event.trace_id && (
                  <div>
                    <dt className="text-muted-foreground">מזהה מעקב</dt>
                    <dd className="font-mono text-xs text-foreground" dir="ltr">
                      {event.trace_id}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Target */}
            {(event.target_type || event.target_id) && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  יעד
                </h4>
                <dl className="space-y-1 text-sm">
                  <div>
                    <dt className="text-muted-foreground">סוג</dt>
                    <dd className="text-foreground">{event.target_type || '—'}</dd>
                  </div>
                  {event.target_id && (
                    <div>
                      <dt className="text-muted-foreground">מזהה</dt>
                      <dd className="font-mono text-xs text-foreground" dir="ltr">
                        {event.target_id}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* User Agent */}
            {event.actor_user_agent && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  סוכן משתמש
                </h4>
                <p className="text-xs text-muted-foreground break-words" dir="ltr">
                  {event.actor_user_agent}
                </p>
              </div>
            )}
          </div>

          {/* State changes */}
          {(event.before_state || event.after_state) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.before_state && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    מצב קודם
                  </h4>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32 scrollbar-thin" dir="ltr">
                    {JSON.stringify(event.before_state, null, 2)}
                  </pre>
                </div>
              )}
              {event.after_state && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    מצב נוכחי
                  </h4>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32 scrollbar-thin" dir="ltr">
                    {JSON.stringify(event.after_state, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Context */}
          {event.context && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                הקשר
              </h4>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32 scrollbar-thin" dir="ltr">
                {JSON.stringify(event.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
