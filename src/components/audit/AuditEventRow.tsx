import { useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, Fingerprint } from 'lucide-react';
import { AuditEvent } from '@/types/audit';
import { CategoryBadge } from './CategoryBadge';
import { cn } from '@/lib/utils';
import { getSubcategoryName, getActionIcon } from '@/constants/filterOptions';
import { styles } from './AuditEventRow.styles';
import { StateDiff } from './StateDiff';

interface AuditEventRowProps {
  event: AuditEvent;
}

export const AuditEventRow: React.FC<AuditEventRowProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = format(new Date(event.created_at), 'd בMMM yyyy', { locale: he });
  const formattedTime = format(new Date(event.created_at), 'HH:mm:ss');

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={cn(
        styles.container,
        isExpanded && styles.containerExpanded
      )}
    >
      {/* Main row */}
      <button
        onClick={handleToggleExpanded}
        className={styles.mainRow}
      >
        {/* Timestamp */}
        <div className={styles.timestampCol}>
          <span className={styles.chevron}>
            {isExpanded ? (
              <ChevronDown className={styles.chevronIcon} />
            ) : (
              <ChevronLeft className={styles.chevronIcon} />
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


        {/* Actor */}
        <div className={styles.usernameCol}>
          <div className={styles.username}>
            {event.actor_username || '—'}
          </div>
          {(event.actor_type || event.actor_id) && (
            <div className={styles.targetInfo}>
              {event.actor_type && <CategoryBadge category={event.actor_type} />}
              {event.actor_id && (
                <span className={styles.targetId} dir="ltr">
                  {event.actor_id}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action */}
        <div className={styles.actionCol}>
          <CategoryBadge
            category={event.category}
            label={getSubcategoryName(event.action)}
            icon={getActionIcon(event.action)}
          />
        </div>

        {/* Target */}
        <div className={styles.targetCol}>
          <div className={styles.targetName}>
            {event.target_name || '—'}
          </div>
          {(event.category || event.target_id) && (
            <div className={styles.targetInfo}>
              {event.category && <CategoryBadge category={event.category} />}
              {event.target_id && (
                <span className={styles.targetId} dir="ltr">
                  {event.target_id}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Resource */}
        <div className={styles.resourceCol}>
          <div className={styles.resourceType}>
            {event.resource_name}
          </div>
          <div className={styles.resourceId} dir="ltr">
            {event.resource_id}
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className={styles.expandedDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsHeader}>פרטי האירוע</h4>
              <dl className={styles.detailsList}>
                <div className={styles.detailsItem}>
                  <Fingerprint className={styles.detailsIcon} />
                  <div>
                    <dt className={styles.detailsLabel}>מזהה אירוע</dt>
                    <dd className={styles.detailsValue} dir="ltr">
                      {event.id}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* State changes */}
          {(event.before_state || event.after_state) && (
            <div className="mt-4">
              <h4 className={styles.detailsHeader}>שינויים במצב</h4>
              <div className="mt-2 border rounded-md p-4 bg-white/50">
                <StateDiff before={event.before_state} after={event.after_state} />
              </div>
            </div>
          )}

          {/* Context */}
          {event.context && (
            <div className={styles.contextSection}>
              <h4 className={styles.detailsHeader}>הקשר נוסף</h4>
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
