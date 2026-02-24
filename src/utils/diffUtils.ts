import _ from 'lodash';

export type DiffType = 'added' | 'removed' | 'updated' | 'unchanged' | 'nested';

export interface DeepDiffResult {
    type: DiffType;
    oldValue?: unknown;
    newValue?: unknown;
    children?: Record<string, DeepDiffResult>;
    arrayItems?: DeepDiffResult[];
}

export function getDiff(
    obj1: any | null | undefined,
    obj2: any | null | undefined
): Record<string, DeepDiffResult> | DeepDiffResult[] {
    const o1 = obj1 || {};
    const o2 = obj2 || {};

    if (Array.isArray(o1) && Array.isArray(o2)) {
        const result: DeepDiffResult[] = [];
        const remainingO2 = [...o2];
        const matchedO2Indices = new Set<number>();

        // Find unchanged and removed
        for (const item1 of o1) {
            let foundIndex = -1;
            for (let i = 0; i < o2.length; i++) {
                if (!matchedO2Indices.has(i) && _.isEqual(item1, o2[i])) {
                    foundIndex = i;
                    break;
                }
            }

            if (foundIndex !== -1) {
                result.push({ type: 'unchanged', oldValue: item1, newValue: o2[foundIndex] });
                matchedO2Indices.add(foundIndex);
            } else {
                result.push({ type: 'removed', oldValue: item1 });
            }
        }

        // Find added
        for (let i = 0; i < o2.length; i++) {
            if (!matchedO2Indices.has(i)) {
                result.push({ type: 'added', newValue: o2[i] });
            }
        }

        return result;
    }

    const result: Record<string, DeepDiffResult> = {};
    const allKeys = _.union(Object.keys(o1), Object.keys(o2));

    for (const key of allKeys) {
        const val1 = o1[key];
        const val2 = o2[key];

        if (!(key in o1)) {
            result[key] = { type: 'added', newValue: val2 };
        } else if (!(key in o2)) {
            result[key] = { type: 'removed', oldValue: val1 };
        } else if (_.isPlainObject(val1) && _.isPlainObject(val2)) {
            const children = getDiff(val1, val2) as Record<string, DeepDiffResult>;
            const hasChanges = Object.values(children).some(c => c.type !== 'unchanged');
            result[key] = {
                type: hasChanges ? 'nested' : 'unchanged',
                children,
                oldValue: val1,
                newValue: val2
            };
        } else if (Array.isArray(val1) && Array.isArray(val2)) {
            const children = getDiff(val1, val2) as DeepDiffResult[];
            const hasChanges = children.some(c => c.type !== 'unchanged');
            result[key] = {
                type: hasChanges ? 'nested' : 'unchanged',
                arrayItems: children,
                oldValue: val1,
                newValue: val2
            };
        } else if (!_.isEqual(val1, val2)) {
            result[key] = { type: 'updated', oldValue: val1, newValue: val2 };
        } else {
            result[key] = { type: 'unchanged', oldValue: val1, newValue: val2 };
        }
    }

    return result;
}
