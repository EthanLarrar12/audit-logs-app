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
        id: 'User',
        name: 'משתמש',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם המשתמש שבוצע עליו את הפעולה", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'UserCreation', name: 'יצירת משתמש', type: ActionType.CREATE },
            { id: 'UserDeletion', name: 'מחיקה משתמש', type: ActionType.DELETE },
            { id: 'UserSync', name: 'סינכרון משתמש', type: ActionType.SYNC },
            { id: 'AddValueToUser', name: 'הוספת תכונה למשתמש', type: ActionType.ADD_VALUE },
            { id: 'RemoveValueFromUser', name: 'הסרת תכונה מהמשתמש', type: ActionType.REMOVE_VALUE },
        ],
    },
    {
        id: 'Entity',
        name: 'ישות',
        filters: [
            ACTOR_FILTER,
            { name: "חפש שם ישות", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'EntityCreation', name: 'יצירת ישות', type: ActionType.CREATE },
            { id: 'EntityEdit', name: 'עריכת ישות', type: ActionType.EDIT },
            { id: 'EntityDeletion', name: 'מחיקה ישות', type: ActionType.DELETE },
        ],
    },
    {
        id: 'Shos',
        name: 'שו"ס',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם השו\"ס", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'ShosCreation', name: 'יצירת שו"ס', type: ActionType.CREATE },
            { id: 'ShosEdit', name: 'עריכת שו"ס', type: ActionType.EDIT },
            { id: 'ShosDeletion', name: 'מחיקה שו"ס', type: ActionType.DELETE },
            {
                id: 'AddUserToShos',
                name: 'הוספת משתמש לשו"ס',
                type: ActionType.ADD_USER,
                filters: [getAddUserFilter("משתמש")]
            },
            { id: 'RemoveUserFromShos', name: 'הסרת משתמש מהשו"ס', type: ActionType.REMOVE_USER, filters: [getRemoveUserFilter("משתמש")] },
            {
                id: 'AddManagerToShos',
                name: 'הוספת אחראי לשו"ס',
                type: ActionType.ADD_MANAGER,
                filters: [getAddUserFilter("אחראי")]
            },
            { id: 'RemoveManagerFromShos', name: 'הסרת אחראי מהשו"ס', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("אחראי")] },
        ],
    },
    {
        id: 'DynamicTag',
        name: 'תגיות דינמיות',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם התגית", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'DynamicTagCreation', name: 'יצירת תגית דינמית', type: ActionType.CREATE },
            { id: 'DynamicTagEdit', name: 'עריכת תגית דינמית', type: ActionType.EDIT },
            { id: 'DynamicTagDeletion', name: 'מחיקה תגית דינמית', type: ActionType.DELETE },
            { id: 'AddUserToDynamicTag', name: 'הוספת משתמש לתגית דינמית', type: ActionType.ADD_USER, filters: [getAddUserFilter("משתמש")] },
            { id: 'RemoveUserFromDynamicTag', name: 'הסרת משתמש מהתגית דינמית', type: ActionType.REMOVE_USER, filters: [getRemoveUserFilter("משתמש")] },
            { id: 'AddManagerToDynamicTag', name: 'הוספת מנהל לתגית דינמית', type: ActionType.ADD_MANAGER, filters: [getAddUserFilter("מנהל")] },
            { id: 'RemoveManagerFromDynamicTag', name: 'הסרת מנהל מהתגית דינמית', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("מנהל")] },
        ],
    },
    {
        id: 'EndSystem',
        name: 'מערכת קצה',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם מערכת הקצה", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'EndSystemCreation', name: 'יצירת מערכת קצה', type: ActionType.CREATE },
            { id: 'EndSystemEdit', name: 'עריכת מערכת קצה', type: ActionType.EDIT },
            { id: 'EndSystemDeletion', name: 'מחיקה מערכת קצה', type: ActionType.DELETE },
        ],
    },
    {
        id: 'Profile',
        name: 'פרופיל',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם הפרופיל", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'ProfileCreation', name: 'יצירת פרופיל', type: ActionType.CREATE },
            { id: 'ProfileEdit', name: 'עריכת פרופיל', type: ActionType.EDIT },
            { id: 'ProfileDeletion', name: 'מחיקה פרופיל', type: ActionType.DELETE },
            { id: 'AddUserToProfile', name: 'הוספת אחראי לפרופיל', type: ActionType.ADD_MANAGER, filters: [getAddUserFilter("אחראי")] },
            { id: 'RemoveUserFromProfile', name: 'הסרת אחראי מהפרופיל', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("אחראי")] }
        ],
    },
    {
        id: 'DistributionGroup',
        name: 'רשימת תפוצה',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם רשימת התפוצה", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'DistributionGroupCreation', name: 'יצירת רשימת תפוצה', type: ActionType.CREATE },
            { id: 'DistributionGroupEdit', name: 'עריכת רשימת תפוצה', type: ActionType.EDIT },
            { id: 'DistributionGroupDeletion', name: 'מחיקה רשימת תפוצה', type: ActionType.DELETE },
            { id: 'AddUserToDistributionGroup', name: 'הוספת משתמש לרשימת תפוצה', type: ActionType.ADD_USER, filters: [getAddUserFilter("משתמש")] },
            { id: 'RemoveUserFromDistributionGroup', name: 'הסרת משתמש מהרשימת תפוצה', type: ActionType.REMOVE_USER, filters: [getRemoveUserFilter("משתמש")] },
            { id: 'AddManagerToDistributionGroup', name: 'הוספת מנהל לרשימת תפוצה', type: ActionType.ADD_MANAGER, filters: [getAddUserFilter("מנהל")] },
            { id: 'RemoveManagerFromDistributionGroup', name: 'הסרת מנהל מהרשימת תפוצה', type: ActionType.REMOVE_MANAGER, filters: [getRemoveUserFilter("מנהל")] }
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
