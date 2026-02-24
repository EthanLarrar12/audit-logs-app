import { getDiff, DeepDiffResult } from '@/utils/diffUtils';
import { styles } from './StateDiff.styles';

interface StateDiffProps {
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
}

export const StateDiff: React.FC<StateDiffProps> = ({ before, after }) => {
    if (!before && !after) return null;

    const diff = getDiff(before, after) as Record<string, DeepDiffResult>;

    const renderValue = (key: string, diffNode: DeepDiffResult, type: 'before' | 'after', depth: number = 0) => {
        let dynamicClass = styles.textDefault;
        let prefix = "  ";

        const { type: diffType, children, arrayItems, oldValue, newValue } = diffNode;

        if (type === 'before') {
            if (diffType === 'removed') {
                dynamicClass = styles.removed;
                prefix = "- ";
            } else if (diffType === 'updated') {
                dynamicClass = styles.updated;
                prefix = "~ ";
            }
        } else {
            if (diffType === 'added') {
                dynamicClass = styles.added;
                prefix = "+ ";
            } else if (diffType === 'updated') {
                dynamicClass = styles.updated;
                prefix = "~ ";
            }
        }

        const valueToDisplay = type === 'before' ? oldValue : newValue;

        if (diffType === 'nested') {
            if (children) {
                return (
                    <li key={key} className={styles.listItem}>
                        <div className="w-full">
                            <div className={styles.propertyRow}>
                                <span className={styles.prefix}>  </span>
                                <span className={styles.key}>{key}:</span>
                            </div>
                            <ul className={styles.nestedLine}>
                                {Object.entries(children).map(([childKey, childNode]) =>
                                    renderValue(childKey, childNode, type, depth + 1)
                                )}
                            </ul>
                        </div>
                    </li>
                );
            }
            if (arrayItems) {
                return (
                    <li key={key} className={styles.listItem}>
                        <div className="w-full">
                            <div className={styles.propertyRow}>
                                <span className={styles.prefix}>  </span>
                                <span className={styles.key}>{key}: [</span>
                            </div>
                            <ul className={styles.nestedLine}>
                                {arrayItems.map((childNode, index) =>
                                    renderValue(`${index}`, childNode, type, depth + 1)
                                )}
                            </ul>
                            <div className={styles.propertyRow}>
                                <span className={styles.prefix}>  </span>
                                <span className={styles.key}>]</span>
                            </div>
                        </div>
                    </li>
                );
            }
        }

        // Only show relevant side for added/removed
        if (type === 'before' && diffType === 'added') return null;
        if (type === 'after' && diffType === 'removed') return null;
        if (valueToDisplay === undefined) return null;

        return (
            <li key={key} className={`${styles.listItem} ${dynamicClass}`}>
                <span className={styles.prefix}>{prefix}</span>
                <span>
                    <span className={styles.key}>{key}:</span> {
                        typeof valueToDisplay === 'object' && valueToDisplay !== null
                            ? JSON.stringify(valueToDisplay, null, 2)
                            : String(valueToDisplay)
                    }
                </span>
            </li>
        );
    };

    const renderSection = (title: string, data: Record<string, DeepDiffResult>, type: 'before' | 'after') => {
        return (
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>{title}</h4>
                <div className={styles.objectContainer}>
                    <ul className={styles.list}>
                        {Object.entries(data).map(([key, node]) => renderValue(key, node, type))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container} dir="ltr">
            {renderSection('מצב קודם', diff, 'before')}
            {renderSection('מצב חדש', diff, 'after')}
        </div>
    );
};
