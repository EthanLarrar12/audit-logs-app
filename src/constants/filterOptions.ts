import { Plus, Pencil, Trash2, RefreshCw, UserPlus, UserMinus, ShieldCheck, ShieldX } from 'lucide-react';

export enum ActionType {
    CREATE = 'create',
    EDIT = 'edit',
    DELETE = 'delete',
    SYNC = 'sync',
    ADD_USER = 'add_user',
    REMOVE_USER = 'remove_user',
    ADD_MANAGER = 'add_manager',
    REMOVE_MANAGER = 'remove_manager',
    ADD_VALUE = 'add_value',
    REMOVE_VALUE = 'remove_value'
}

const ACTION_TYPE_ICONS: Record<string, any> = {
    [ActionType.CREATE]: Plus,
    [ActionType.EDIT]: Pencil,
    [ActionType.DELETE]: Trash2,
    [ActionType.SYNC]: RefreshCw,
    [ActionType.ADD_USER]: UserPlus,
    [ActionType.REMOVE_USER]: UserMinus,
    [ActionType.ADD_MANAGER]: ShieldCheck,
    [ActionType.REMOVE_MANAGER]: ShieldX,
    [ActionType.ADD_VALUE]: Plus,
    [ActionType.REMOVE_VALUE]: Trash2,
};

export const getActionIcon = (actionId: string) => {
    for (const cat of AUDIT_CATEGORIES) {
        const sub = cat.subcategories.find((s) => s.id === actionId);
        if (sub && sub.type) {
            return ACTION_TYPE_ICONS[sub.type];
        }
    }
    return undefined;
};


export interface Filter {
    name: string;
    searchField: string;
}

export interface Subcategory {
    id: string;
    name: string;
    type: ActionType;
    filters?: Filter[];
}

export interface Category {
    id: string;
    name: string;
    subcategories: Subcategory[];
    filters?: Filter[];
}

const ACTOR_FILTER = { name: "חפש את מזהה/שם המשתמש שביצע את הפעולה", searchField: "actorSearch" }
const getAddUserFilter = (semanticName: string) => ({ name: `חפש את שם/מזהה ה${semanticName} שהתווסף`, searchField: "resourceSearch" })
const getRemoveUserFilter = (semanticName: string) => ({ name: `חפש את שם/מזהה ה${semanticName} שנמחק`, searchField: "resourceSearch" })

export const AUDIT_CATEGORIES: Category[] = [
    {
        id: 'USER',
        name: 'משתמש',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם המשתמש שבוצע עליו את הפעולה", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'USER_CREATION', name: 'יצירת משתמש', type: ActionType.CREATE },
            { id: 'USER_DELETION', name: 'מחיקה משתמש', type: ActionType.DELETE },
            { id: 'USER_SYNC', name: 'סינכרון משתמש', type: ActionType.SYNC },
            { id: 'ADD_VALUE_TO_USER', name: 'הוספת תכונה למשתמש', type: ActionType.ADD_VALUE },
            { id: 'REMOVE_VALUE_FROM_USER', name: 'הסרת תכונה מהמשתמש', type: ActionType.REMOVE_VALUE },
        ],
    },
    {
        id: 'ENTITY',
        name: 'ישות',
        filters: [
            ACTOR_FILTER,
            { name: "חפש שם ישות", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'ENTITY_CREATION', name: 'יצירת ישות', type: ActionType.CREATE },
            { id: 'ENTITY_EDIT', name: 'עריכת ישות', type: ActionType.EDIT },
            { id: 'ENTITY_DELETION', name: 'מחיקה ישות', type: ActionType.DELETE },
        ],
    },
    {
        id: 'SHOS',
        name: 'שו"ס',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם השו\"ס", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'SHOS_CREATION', name: 'יצירת שו"ס', type: ActionType.CREATE },
            { id: 'SHOS_EDIT', name: 'עריכת שו"ס', type: ActionType.EDIT },
            { id: 'SHOS_DELETION', name: 'מחיקה שו"ס', type: ActionType.DELETE },
            {
                id: 'ADD_USER_TO_SHOS',
                name: 'הוספת משתמש לשו"ס',
                type: ActionType.ADD_USER,
                filters: [getAddUserFilter("משתמש")]
            },
            { id: 'REMOVE_USER_FROM_SHOS', name: 'הסרת משתמש מהשו"ס', type: ActionType.REMOVE_USER, filters: [getRemoveUserFilter("משתמש")] },
            {
                id: 'ADD_MANAGER_TO_SHOS',
                name: 'הוספת אחראי לשו"ס',
                type: ActionType.ADD_MANAGER,
                filters: [getAddUserFilter("אחראי")]
            },
            { id: 'REMOVE_MANAGER_FROM_SHOS', name: 'הסרת אחראי מהשו"ס', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("אחראי")] },
        ],
    },
    {
        id: 'DYNAMIC_TAG',
        name: 'תגיות דינמיות',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם התגית", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'DYNAMIC_TAG_CREATION', name: 'יצירת תגית דינמית', type: ActionType.CREATE },
            { id: 'DYNAMIC_TAG_EDIT', name: 'עריכת תגית דינמית', type: ActionType.EDIT },
            { id: 'DYNAMIC_TAG_DELETION', name: 'מחיקה תגית דינמית', type: ActionType.DELETE },
            { id: 'ADD_USER_TO_DYNAMIC_TAG', name: 'הוספת משתמש לתגית דינמית', type: ActionType.ADD_USER, filters: [getAddUserFilter("משתמש")] },
            { id: 'REMOVE_USER_FROM_DYNAMIC_TAG', name: 'הסרת משתמש מהתגית דינמית', type: ActionType.REMOVE_USER, filters: [getRemoveUserFilter("משתמש")] },
            { id: 'ADD_MANAGER_TO_DYNAMIC_TAG', name: 'הוספת מנהל לתגית דינמית', type: ActionType.ADD_MANAGER, filters: [getAddUserFilter("מנהל")] },
            { id: 'REMOVE_MANAGER_FROM_DYNAMIC_TAG', name: 'הסרת מנהל מהתגית דינמית', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("מנהל")] },
        ],
    },
    {
        id: 'END_SYSTEM',
        name: 'מערכת קצה',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם מערכת הקצה", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'END_SYSTEM_CREATION', name: 'יצירת מערכת קצה', type: ActionType.CREATE },
            { id: 'END_SYSTEM_EDIT', name: 'עריכת מערכת קצה', type: ActionType.EDIT },
            { id: 'END_SYSTEM_DELETION', name: 'מחיקה מערכת קצה', type: ActionType.DELETE },
        ],
    },
    {
        id: 'PROFILE',
        name: 'פרופיל',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם הפרופיל", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'PROFILE_CREATION', name: 'יצירת פרופיל', type: ActionType.CREATE },
            { id: 'PROFILE_EDIT', name: 'עריכת פרופיל', type: ActionType.EDIT },
            { id: 'PROFILE_DELETION', name: 'מחיקה פרופיל', type: ActionType.DELETE },
            { id: 'ADD_USER_TO_PROFILE', name: 'הוספת אחראי לפרופיל', type: ActionType.ADD_MANAGER, filters: [getAddUserFilter("אחראי")] },
            { id: 'REMOVE_USER_FROM_PROFILE', name: 'הסרת אחראי מהפרופיל', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("אחראי")] }
        ],
    },
    {
        id: 'DISTRIBUTION_GROUP',
        name: 'רשימת תפוצה',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם רשימת התפוצה", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'DISTRIBUTION_GROUP_CREATION', name: 'יצירת רשימת תפוצה', type: ActionType.CREATE },
            { id: 'DISTRIBUTION_GROUP_EDIT', name: 'עריכת רשימת תפוצה', type: ActionType.EDIT },
            { id: 'DISTRIBUTION_GROUP_DELETION', name: 'מחיקה רשימת תפוצה', type: ActionType.DELETE },
            { id: 'ADD_USER_TO_DISTRIBUTION_GROUP', name: 'הוספת משתמש לרשימת תפוצה', type: ActionType.ADD_USER, filters: [getAddUserFilter("משתמש")] },
            { id: 'REMOVE_USER_FROM_DISTRIBUTION_GROUP', name: 'הסרת משתמש מהרשימת תפוצה', type: ActionType.REMOVE_USER, filters: [getRemoveUserFilter("משתמש")] },
            { id: 'ADD_MANAGER_TO_DISTRIBUTION_GROUP', name: 'הוספת מנהל לרשימת תפוצה', type: ActionType.ADD_MANAGER, filters: [getAddUserFilter("מנהל")] },
            { id: 'REMOVE_MANAGER_FROM_DISTRIBUTION_GROUP', name: 'הסרת מנהל מהרשימת תפוצה', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("מנהל")] }
        ],
    },
];

export const getSubcategoryName = (id: string) => {
    for (const cat of AUDIT_CATEGORIES) {
        const sub = cat.subcategories.find((s) => s.id === id);
        if (sub) return sub.name;
    }
    return id;
};

export const getCategoryName = (id: string) => {
    const cat = AUDIT_CATEGORIES.find((c) => c.id === id);
    return cat ? cat.name : id;
};
