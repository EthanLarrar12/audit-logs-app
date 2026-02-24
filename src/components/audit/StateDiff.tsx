import { getDiff } from '@/utils/diffUtils';
import { styles } from './StateDiff.styles';

interface StateDiffProps {
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
}

export const StateDiff: React.FC<StateDiffProps> = ({ before, after }) => {
    if (!before && !after) return null;

    const diff = getDiff(before, after);

    const renderObject = (obj: Record<string, unknown>, type: 'before' | 'after') => {
        return (
            <div className={styles.objectContainer}>
                <ul className={styles.list}>
                    {Object.entries(obj).map(([key, value]) => {
                        let dynamicClass = styles.textDefault;
                        let prefix = "  ";

                        if (type === 'before') {
                            if (key in diff.removed) {
                                dynamicClass = styles.removed;
                                prefix = "- ";
                            } else if (key in diff.updated) {
                                dynamicClass = styles.updated;
                                prefix = "~ ";
                            }
                        } else {
                            if (key in diff.added) {
                                dynamicClass = styles.added;
                                prefix = "+ ";
                            } else if (key in diff.updated) {
                                dynamicClass = styles.updated;
                                prefix = "~ ";
                            }
                        }

                        return (
                            <li key={key} className={`${styles.listItem} ${dynamicClass}`}>
                                <span className={styles.prefix}>{prefix}</span>
                                <span>
                                    <span className={styles.key}>{key}:</span> {JSON.stringify(value, null, 2)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div className={styles.container} dir="ltr">
            {before && Object.keys(before).length > 0 && (
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>מצב קודם</h4>
                    {renderObject(before, 'before')}
                </div>
            )}
            {after && Object.keys(after).length > 0 && (
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>מצב חדש</h4>
                    {renderObject(after, 'after')}
                </div>
            )}
            {(!before || Object.keys(before).length === 0) && (!after || Object.keys(after).length === 0) && (
                <div className={styles.emptyMessage}>
                    אין נתונים להצגה
                </div>
            )}
        </div>
    );
};
