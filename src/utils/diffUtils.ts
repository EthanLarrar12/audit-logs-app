import _ from 'lodash';

export interface DiffResult {
    added: Record<string, any>;
    removed: Record<string, any>;
    updated: Record<string, { old: any; new: any }>;
    unchanged: Record<string, any>;
}

export function getDiff(obj1: Record<string, any> | null | undefined, obj2: Record<string, any> | null | undefined): DiffResult {
    const o1 = obj1 || {};
    const o2 = obj2 || {};

    const added: Record<string, any> = {};
    const removed: Record<string, any> = {};
    const updated: Record<string, { old: any; new: any }> = {};
    const unchanged: Record<string, any> = {};

    const allKeys = _.union(Object.keys(o1), Object.keys(o2));

    for (const key of allKeys) {
        if (!(key in o1)) {
            added[key] = o2[key];
        } else if (!(key in o2)) {
            removed[key] = o1[key];
        } else if (!_.isEqual(o1[key], o2[key])) {
            updated[key] = { old: o1[key], new: o2[key] };
        } else {
            unchanged[key] = o1[key];
        }
    }

    return { added, removed, updated, unchanged };
}
