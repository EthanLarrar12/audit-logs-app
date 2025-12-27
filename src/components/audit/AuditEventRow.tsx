import { useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, Globe, Fingerprint, Network, CheckCircle2, XCircle } from 'lucide-react';
import { AuditEvent } from '@/types/audit';
import { ActorTypeBadge } from './ActorTypeBadge';
import { TargetTypeBadge } from './TargetTypeBadge';
import { cn } from '@/lib/utils';
import { styles } from './AuditEventRow.styles';

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
        styles.container,
        isExpanded && styles.containerExpanded,
        event.outcome === 'failure' && styles.containerFailure
      )}
    >
      {/* Main row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.mainRow}
      >
        {/* Timestamp */}
        <div className={styles.timestampCol}>
          <span className={styles.chevron}>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </span>
          <div className="min-w-0">
            <div className={styles.dateText}>
              {formattedDate}
            </div>
            <div className={styles.timeText} dir="ltr">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Actor Type */}
        <div className={styles.actorTypeCol}>
          <ActorTypeBadge type={event.actor_type} />
        </div>

        {/* Username & User ID */}
        <div className={styles.usernameCol}>
          <div className={styles.username}>
            {event.actor_username || '—'}
          </div>
          {event.actor_id && (
            <div className={styles.userId} dir="ltr">
              {event.actor_id}
            </div>
          )}
        </div>

        {/* Action */}
        <div className={styles.actionCol}>
          <div className={styles.action} dir="ltr">{event.action}</div>
        </div>

        {/* Resource */}
        <div className={styles.resourceCol}>
          <div className={styles.resourceType}>{event.resource_type}</div>
          <div className={styles.resourceId} dir="ltr">
            {event.resource_id}
          </div>
        </div>

        {/* Target Type */}
        <div className={styles.targetTypeCol}>
          <TargetTypeBadge type={event.target_type} />
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className={styles.expandedDetails}>
          {/* Outcome indicator */}
          <div className={styles.outcomeIndicator}>
            {event.outcome === 'success' ? (
              <span className={styles.outcomeSuccess}>
                <CheckCircle2 className="w-4 h-4" />
                הצלחה
              </span>
            ) : (
              <span className={styles.outcomeFailure}>
                <XCircle className="w-4 h-4" />
                כישלון
              </span>
            )}
          </div>

          <div className={styles.detailsGrid}>
            {/* Metadata */}
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsHeader}>
                פרטי האירוע
              </h4>
              <dl className={styles.detailsList}>
                <div className={styles.detailsItem}>
                  <Fingerprint className={styles.detailsItem} />
                  <Fingerprint className={styles.detailsIcon} />
                  <div>
                    <dt className={styles.detailsLabel}>מזהה אירוע</dt>
                    <dd className={styles.detailsValue} dir="ltr">
                      {event.id}
                    </dd>
                  </div>
                </div>
                {event.actor_ip && (
                  <div className={styles.detailsItem}>
                    <Globe className={styles.detailsIcon} />
                    <div>
                      <dt className={styles.detailsLabel}>כתובת IP</dt>
                      <dd className={styles.detailsValue} dir="ltr">
                        {event.actor_ip}
                      </dd>
                    </div>
                  </div>
                )}
                {event.request_id && (
                  <div className={styles.detailsItem}>
                    <Network className={styles.detailsIcon} />
                    <div>
                      <dt className={styles.detailsLabel}>מזהה בקשה</dt>
                      <dd className={styles.detailsValue} dir="ltr">
                        {event.request_id}
                      </dd>
                    </div>
                  </div>
                )}
                {event.trace_id && (
                  <div className={styles.detailsItem}>
                    <div>
                      <dt className={styles.detailsLabel}>מזהה מעקב</dt>
                      <dd className={styles.detailsValue} dir="ltr">
                        {event.trace_id}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {/* Target */}
            {(event.target_type || event.target_id) && (
              <div className={styles.detailsSection}>
                <h4 className={styles.detailsHeader}>
                  יעד
                </h4>
                <dl className={styles.targetList}>
                  <div>
                    <dt className={styles.detailsLabel}>סוג</dt>
                    <dd className="text-foreground">{event.target_type || '—'}</dd>
                  </div>
                  {event.target_id && (
                    <div>
                      <dt className={styles.detailsLabel}>מזהה</dt>
                      <dd className={styles.detailsValue} dir="ltr">
                        {event.target_id}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* User Agent */}
            {event.actor_user_agent && (
              <div className={styles.detailsSection}>
                <h4 className={styles.detailsHeader}>
                  סוכן משתמש
                </h4>
                <p className={styles.userAgentText} dir="ltr">
                  {event.actor_user_agent}
                </p>
              </div>
            )}
          </div>

          {/* State changes */}
          {(event.before_state || event.after_state) && (
            <div className={styles.stateChangesGrid}>
              {event.before_state && (
                <div className={styles.stateSection}>
                  <h4 className={styles.detailsHeader}>
                    מצב קודם
                  </h4>
                  <pre className={styles.jsonPre} dir="ltr">
                    {JSON.stringify(event.before_state, null, 2)}
                  </pre>
                </div>
              )}
              {event.after_state && (
                <div className={styles.stateSection}>
                  <h4 className={styles.detailsHeader}>
                    מצב נוכחי
                  </h4>
                  <pre className={styles.jsonPre} dir="ltr">
                    {JSON.stringify(event.after_state, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Context */}
          {event.context && (
            <div className={styles.contextSection}>
              <h4 className={styles.detailsHeader}>
                הקשר
              </h4>
              <pre className={styles.jsonPre} dir="ltr">
                {JSON.stringify(event.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
