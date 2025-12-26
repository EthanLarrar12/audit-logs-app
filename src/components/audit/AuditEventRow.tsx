import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Globe, Fingerprint, Network } from 'lucide-react';
import { AuditEvent } from '@/types/audit';
import { ActorTypeBadge } from './ActorTypeBadge';
import { OutcomeBadge } from './OutcomeBadge';
import { cn } from '@/lib/utils';

interface AuditEventRowProps {
  event: AuditEvent;
}

export function AuditEventRow({ event }: AuditEventRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = format(new Date(event.created_at), 'MMM d, yyyy');
  const formattedTime = format(new Date(event.created_at), 'HH:mm:ss');

  return (
    <div
      className={cn(
        'border rounded-lg bg-card transition-all duration-200',
        isExpanded && 'ring-1 ring-primary/20'
      )}
    >
      {/* Main row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full grid grid-cols-12 gap-4 px-4 py-3 items-center text-left hover:bg-table-row-hover transition-colors rounded-lg"
      >
        {/* Expand icon + Timestamp */}
        <div className="col-span-3 flex items-center gap-3">
          <span className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
          <div>
            <div className="text-sm font-medium text-foreground">
              {formattedDate}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Actor Type */}
        <div className="col-span-1">
          <ActorTypeBadge type={event.actor_type} />
        </div>

        {/* Actor ID */}
        <div className="col-span-2">
          <div className="text-sm text-foreground truncate">
            {event.actor_id || '—'}
          </div>
          {event.actor_ip && (
            <div className="text-xs text-muted-foreground font-mono">
              {event.actor_ip}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="col-span-2">
          <div className="text-sm font-medium text-primary">{event.action}</div>
        </div>

        {/* Resource */}
        <div className="col-span-2">
          <div className="text-sm text-foreground">{event.resource_type}</div>
          <div className="text-xs text-muted-foreground font-mono truncate">
            {event.resource_id}
          </div>
        </div>

        {/* Outcome */}
        <div className="col-span-2 flex justify-end">
          <OutcomeBadge outcome={event.outcome} />
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Metadata */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Event Details
              </h4>
              <dl className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Fingerprint className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <dt className="text-muted-foreground">Event ID</dt>
                    <dd className="font-mono text-xs text-foreground break-all">
                      {event.id}
                    </dd>
                  </div>
                </div>
                {event.request_id && (
                  <div className="flex items-start gap-2">
                    <Network className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <dt className="text-muted-foreground">Request ID</dt>
                      <dd className="font-mono text-xs text-foreground">
                        {event.request_id}
                      </dd>
                    </div>
                  </div>
                )}
                {event.trace_id && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <dt className="text-muted-foreground">Trace ID</dt>
                      <dd className="font-mono text-xs text-foreground">
                        {event.trace_id}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {/* Target */}
            {(event.target_type || event.target_id) && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Target
                </h4>
                <dl className="space-y-1 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="text-foreground">{event.target_type || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="font-mono text-xs text-foreground">
                      {event.target_id || '—'}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* User Agent */}
            {event.actor_user_agent && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  User Agent
                </h4>
                <p className="text-xs text-muted-foreground break-words">
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
                    Before State
                  </h4>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32 scrollbar-thin">
                    {JSON.stringify(event.before_state, null, 2)}
                  </pre>
                </div>
              )}
              {event.after_state && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    After State
                  </h4>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32 scrollbar-thin">
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
                Context
              </h4>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32 scrollbar-thin">
                {JSON.stringify(event.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
