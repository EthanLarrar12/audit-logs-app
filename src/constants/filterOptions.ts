import { Plus, Pencil, Trash2, RefreshCw, UserPlus, UserMinus, ShieldCheck, ShieldX } from 'lucide-react';

export const getActionIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('creation')) return Plus;
    if (a.includes('edit')) return Pencil;
    if (a.includes('deletion')) return Trash2;
    if (a.includes('sync')) return RefreshCw;
    if (a.includes('adduser')) return UserPlus;
    if (a.includes('removeuser')) return UserMinus;
    if (a.includes('addmanager')) return ShieldCheck;
    if (a.includes('removemanager')) return ShieldX;
    if (a.includes('addvalue')) return Plus;
    if (a.includes('removevalue')) return Trash2;
    return undefined;
};


export interface Filter {
    name: string;
    searchField: string;
}

export interface Subcategory {
    id: string;
    name: string;
    filters?: Filter[];
}

export interface Category {
    id: string;
    name: string;
    subcategories: Subcategory[];
    filters?: Filter[];
}

const ACTOR_FILTER = { name: "חפש את מזהה/שם המשתמש שביצע את הפעולה", searchField: "targetSearch" }
const getAddUserFilter = (semanticName: string) => ({ name: `חפש את שם/מזהה ה${semanticName} שהתווסף`, searchField: "resourceSearch" })
const getRemoveUserFilter = (semanticName: string) => ({ name: `חפש את שם/מזהה ה${semanticName} שנמחק`, searchField: "resourceSearch" })

export const AUDIT_CATEGORIES: Category[] = [
    {
        id: 'User',
        name: 'משתמש',
        filters: [
            ACTOR_FILTER,
            { name: "חפש את מזהה/שם המשתמש", searchField: "targetSearch" },
        ],
        subcategories: [
            { id: 'UserCreation', name: 'יצירת משתמש' },
            { id: 'UserDeletion', name: 'מחיקה משתמש' },
            { id: 'UserSync', name: 'סינכרון משתמש' },
            { id: 'AddValueToUser', name: 'הוספת תכונה למשתמש' },
            { id: 'RemoveValueFromUser', name: 'הסרת תכונה מהמשתמש' },
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
            { id: 'EntityCreation', name: 'יצירת ישות' },
            { id: 'EntityEdit', name: 'עריכת ישות' },
            { id: 'EntityDeletion', name: 'מחיקה ישות' },
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
            { id: 'ShosCreation', name: 'יצירת שו"ס' },
            { id: 'ShosEdit', name: 'עריכת שו"ס' },
            { id: 'ShosDeletion', name: 'מחיקה שו"ס' },
            {
                id: 'AddUserToShos',
                name: 'הוספת משתמש לשו"ס',
                filters: [getAddUserFilter("משתמש")]
            },
            { id: 'RemoveUserFromShos', name: 'הסרת משתמש מהשו"ס', filters: [getRemoveUserFilter("משתמש")] },
            {
                id: 'AddManagerToShos',
                name: 'הוספת אחראי לשו"ס',
                filters: [getAddUserFilter("אחראי")]
            },
            { id: 'RemoveManagerFromShos', name: 'הסרת אחראי מהשו"ס', filters: [getRemoveUserFilter("אחראי")] },
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
            { id: 'DynamicTagCreation', name: 'יצירת תגית דינמית' },
            { id: 'DynamicTagEdit', name: 'עריכת תגית דינמית' },
            { id: 'DynamicTagDeletion', name: 'מחיקה תגית דינמית' },
            { id: 'AddUserToDynamicTag', name: 'הוספת משתמש לתגית דינמית', filters: [getAddUserFilter("משתמש")] },
            { id: 'RemoveUserFromDynamicTag', name: 'הסרת משתמש מהתגית דינמית', filters: [getRemoveUserFilter("משתמש")] },
            { id: 'AddManagerToDynamicTag', name: 'הוספת מנהל לתגית דינמית', filters: [getAddUserFilter("מנהל")] },
            { id: 'RemoveManagerFromDynamicTag', name: 'הסרת מנהל מהתגית דינמית', filters: [getRemoveUserFilter("מנהל")] },
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
            { id: 'EndSystemCreation', name: 'יצירת מערכת קצה' },
            { id: 'EndSystemEdit', name: 'עריכת מערכת קצה' },
            { id: 'EndSystemDeletion', name: 'מחיקה מערכת קצה' },
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
            { id: 'ProfileCreation', name: 'יצירת פרופיל' },
            { id: 'ProfileEdit', name: 'עריכת פרופיל' },
            { id: 'ProfileDeletion', name: 'מחיקה פרופיל' },
            { id: 'AddUserToProfile', name: 'הוספת אחראי לפרופיל', filters: [getAddUserFilter("אחראי")] },
            { id: 'RemoveUserFromProfile', name: 'הסרת אחראי מהפרופיל', filters: [getRemoveUserFilter("אחראי")] }
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
            { id: 'DistributionGroupCreation', name: 'יצירת רשימת תפוצה' },
            { id: 'DistributionGroupEdit', name: 'עריכת רשימת תפוצה' },
            { id: 'DistributionGroupDeletion', name: 'מחיקה רשימת תפוצה' },
            { id: 'AddUserToDistributionGroup', name: 'הוספת משתמש לרשימת תפוצה', filters: [getAddUserFilter("משתמש")] },
            { id: 'RemoveUserFromDistributionGroup', name: 'הסרת משתמש מהרשימת תפוצה', filters: [getRemoveUserFilter("משתמש")] },
            { id: 'AddManagerToDistributionGroup', name: 'הוספת מנהל לרשימת תפוצה', filters: [getAddUserFilter("מנהל")] },
            { id: 'RemoveManagerFromDistributionGroup', name: 'הסרת מנהל מהרשימת תפוצה', filters: [getRemoveUserFilter("מנהל")] }
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
