import React from 'react';
import { getDiff } from '@/utils/diffUtils';

interface StateDiffProps {
    before?: Record<string, any> | null;
    after?: Record<string, any> | null;
}

export const StateDiff: React.FC<StateDiffProps> = ({ before, after }) => {
    if (!before && !after) return null;

    const diff = getDiff(before, after);

    const renderObject = (obj: Record<string, any>, type: 'before' | 'after') => {
        return (
            <div className="font-mono text-xs bg-slate-50 rounded p-2 border border-slate-200 overflow-auto">
                <ul className="list-none m-0 p-0">
                    {Object.entries(obj).map(([key, value]) => {
                        let className = "p-1 rounded mb-1 whitespace-pre-wrap break-all flex";
                        let prefix = "";
                        let bgClass = "";
                        let textClass = "text-slate-600";

                        if (type === 'before') {
                            if (key in diff.removed) {
                                bgClass = "bg-red-100 border-l-2 border-red-400";
                                textClass = "text-red-800";
                                prefix = "- ";
                            } else if (key in diff.updated) {
                                bgClass = "bg-yellow-100 border-l-2 border-yellow-400";
                                textClass = "text-yellow-800";
                                prefix = "~ ";
                            } else {
                                prefix = "  ";
                            }
                        } else {
                            if (key in diff.added) {
                                bgClass = "bg-green-100 border-l-2 border-green-400";
                                textClass = "text-green-800";
                                prefix = "+ ";
                            } else if (key in diff.updated) {
                                bgClass = "bg-yellow-100 border-l-2 border-yellow-400";
                                textClass = "text-yellow-800";
                                prefix = "~ ";
                            } else {
                                prefix = "  ";
                            }
                        }

                        return (
                            <li key={key} className={`${className} ${bgClass} ${textClass}`}>
                                <span className="font-semibold select-none opacity-50 mr-2 min-w-[12px]">{prefix}</span>
                                <span>
                                    <span className="font-bold">{key}:</span> {JSON.stringify(value, null, 2)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" dir="ltr">
            {before && Object.keys(before).length > 0 && (
                <div className="space-y-1">
                    <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">מצב קודם</h4>
                    {renderObject(before, 'before')}
                </div>
            )}
            {after && Object.keys(after).length > 0 && (
                <div className="space-y-1">
                    <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">מצב חדש</h4>
                    {renderObject(after, 'after')}
                </div>
            )}
            {(!before || Object.keys(before).length === 0) && (!after || Object.keys(after).length === 0) && (
                <div className="text-sm text-slate-500 italic col-span-2">
                    אין נתונים להצגה
                </div>
            )}
        </div>
    );
};
