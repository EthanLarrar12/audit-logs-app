import { useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, Fingerprint, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAuditEventById } from '@/lib/api';
import { AuditEvent } from '@/types/audit';
import { CategoryBadge } from './CategoryBadge';
import { cn } from '@/lib/utils';
import { getSubcategoryName, getActionIcon } from '@/constants/filterOptions';
import { styles } from './AuditEventRow.styles';
import { StateDiff } from './StateDiff';
import { useTranslations } from '@/hooks/audit/useTranslations';

interface AuditEventRowProps {
  event: AuditEvent;
}

export const AuditEventRow: React.FC<AuditEventRowProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: fullEvent, isLoading: isFetchingDetails } = useQuery({
    queryKey: ['auditEvent', event.id],
    queryFn: () => fetchAuditEventById(event.id),
    enabled: isExpanded,
  });

  const beforeState = fullEvent?.before_state || event.before_state;
  const afterState = fullEvent?.after_state || event.after_state;
  const context = fullEvent?.context || event.context;

  const formattedDate = format(new Date(event.created_at), 'd בMMM yyyy', { locale: he });
  const formattedTime = format(new Date(event.created_at), 'HH:mm:ss');

  // Helper to extract keys and string values recursively
  const extractTranslationKeysValues = (
    objects: any[],
    keysSet: Set<string>,
    valuesMap: Record<string, Set<string>>
  ) => {
    objects.forEach((obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        extractTranslationKeysValues(obj, keysSet, valuesMap);
        return;
      }
      for (const [key, val] of Object.entries(obj)) {
        keysSet.add(key);
        if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val)) {
            val.forEach(item => {
              if (typeof item === 'object' && item !== null) {
                extractTranslationKeysValues([item], keysSet, valuesMap);
              } else if (item !== null && item !== undefined && item !== '') {
                const valueStr = String(item);
                if (!valuesMap[key]) {
                  valuesMap[key] = new Set<string>();
                }
                valuesMap[key].add(valueStr);
              }
            });
          } else {
            extractTranslationKeysValues([val], keysSet, valuesMap);
          }
        } else if (val !== null && val !== undefined && val !== '') {
          const valueStr = String(val);
          if (!valuesMap[key]) {
            valuesMap[key] = new Set<string>();
          }
          valuesMap[key].add(valueStr);
        }
      }
    });
  };

  const paramIdsSet = new Set<string>();
  const valuesMap: Record<string, Set<string>> = {};

  if (isExpanded) {
    extractTranslationKeysValues([beforeState, afterState, context], paramIdsSet, valuesMap);
  }

  const queryParamIds = Array.from(paramIdsSet);
  const queryValues = Object.fromEntries(
    Object.entries(valuesMap).map(([k, set]) => [k, Array.from(set)])
  );

  const { data: translations, isLoading: isLoadingTranslations } = useTranslations(
    queryParamIds,
    queryValues
  );

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const translateContext = (obj: any): any => {
    if (!obj || typeof obj !== 'object' || !translations) return obj;
    if (Array.isArray(obj)) return obj.map(translateContext);

    const translatedObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      const translatedKey = translations.parameters[key] || key;

      if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val)) {
          translatedObj[translatedKey] = val.map(item => {
            if (typeof item === 'object' && item !== null) {
              return translateContext(item);
            }
            const valueStr = String(item);
            return translations.values[key]?.[valueStr] ?? item;
          });
        } else {
          translatedObj[translatedKey] = translateContext(val);
        }
      } else {
        const valueStr = String(val);
        translatedObj[translatedKey] = translations.values[key]?.[valueStr] ?? val;
      }
    }
    return translatedObj;
  };

  const translatedContext = translateContext(context);

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

          {isFetchingDetails ? (
            <div className={styles.loadingContainer}>
              <Loader2 className={styles.loadingIcon} />
            </div>
          ) : (
            <>
              {/* State changes */}
              {(beforeState || afterState) && (
                <div className={styles.stateChangesSection}>
                  <h4 className={styles.detailsHeader}>שינויים במצב</h4>
                  <div className={styles.stateDiffWrapper}>
                    <StateDiff
                      before={translateContext(beforeState)}
                      after={translateContext(afterState)}
                    />
                  </div>
                </div>
              )}

              {/* Context */}
              {context && (
                <div className={styles.contextSection}>
                  <h4 className={styles.detailsHeader}>הקשר נוסף</h4>
                  {isLoadingTranslations && !translations ? (
                    <div className={styles.loadingContainer}>
                      <Loader2 className={cn(styles.loadingIcon, "h-4 w-4")} />
                    </div>
                  ) : (
                    <pre className={styles.jsonPre}>
                      {JSON.stringify(translatedContext, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
