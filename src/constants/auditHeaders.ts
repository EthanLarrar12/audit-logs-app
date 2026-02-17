export const AUDIT_HEADERS = {
    TIME: 'תאריך ושעה',
    ACTOR: 'מי ביצע את הפעולה?',
    ACTION: 'מה הפעולה?',
    TARGET: 'על מי/מה בוצע הפעולה?',
    RESOURCE: 'מה התווסף/נמחק?',
} as const;

export const AUDIT_FILTER_LABELS = {
    EXPORT_DATE: 'תאריך ייצוא:',
    DATE_RANGE: 'טווח תאריכים:',
    FREE_SEARCH: 'חיפוש חופשי:',
    CATEGORIES: 'קטגוריות:',
    ACTIONS: 'פעולות:',
    ACTOR: 'שחקן:',
} as const;
