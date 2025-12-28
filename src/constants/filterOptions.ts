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

export const resourceTypes = [
    'role',
    'session',
    'api_key',
    'report',
    'account',
    'access_policy',
    'database',
    'alert',
];

export interface Subcategory {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    subcategories: Subcategory[];
}

export const AUDIT_CATEGORIES: Category[] = [
    {
        id: 'User',
        name: 'משתמש',
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
        subcategories: [
            { id: 'EntityCreation', name: 'יצירת ישות' },
            { id: 'EntityEdit', name: 'עריכת ישות' },
            { id: 'EntityDeletion', name: 'מחיקה ישות' },
        ],
    },
    {
        id: 'Shos',
        name: 'שו"ס',
        subcategories: [
            { id: 'ShosCreation', name: 'יצירת שו"ס' },
            { id: 'ShosEdit', name: 'עריכת שו"ס' },
            { id: 'ShosDeletion', name: 'מחיקה שו"ס' },
            { id: 'AddUserToShos', name: 'הוספת משתמש לשו"ס' },
            { id: 'RemoveUserFromShos', name: 'הסרת משתמש מהשו"ס' },
            { id: 'AddManagerToShos', name: 'הוספת מנהל לשו"ס' },
            { id: 'RemoveManagerFromShos', name: 'הסרת מנהל מהשו"ס' },
        ],
    },
    {
        id: 'DynamicTag',
        name: 'תגיות דינמיות',
        subcategories: [
            { id: 'DynamicTagCreation', name: 'יצירת תגית דינמית' },
            { id: 'DynamicTagEdit', name: 'עריכת תגית דינמית' },
            { id: 'DynamicTagDeletion', name: 'מחיקה תגית דינמית' },
            { id: 'AddUserToDynamicTag', name: 'הוספת משתמש לתגית דינמית' },
            { id: 'RemoveUserFromDynamicTag', name: 'הסרת משתמש מהתגית דינמית' },
            { id: 'AddManagerToDynamicTag', name: 'הוספת מנהל לתגית דינמית' },
            { id: 'RemoveManagerFromDynamicTag', name: 'הסרת מנהל מהתגית דינמית' },
        ],
    },
    {
        id: 'EndSystem',
        name: 'מערכת קצה',
        subcategories: [
            { id: 'EndSystemCreation', name: 'יצירת מערכת קצה' },
            { id: 'EndSystemEdit', name: 'עריכת מערכת קצה' },
            { id: 'EndSystemDeletion', name: 'מחיקה מערכת קצה' },
        ],
    },
    {
        id: 'Profile',
        name: 'פרופיל',
        subcategories: [
            { id: 'ProfileCreation', name: 'יצירת פרופיל' },
            { id: 'ProfileEdit', name: 'עריכת פרופיל' },
            { id: 'ProfileDeletion', name: 'מחיקה פרופיל' },
            { id: 'AddUserToProfile', name: 'הוספת משתמש לפרופיל' },
            { id: 'RemoveUserFromProfile', name: 'הסרת משתמש מהפרופיל' },
            { id: 'AddManagerToProfile', name: 'הוספת מנהל לפרופיל' },
            { id: 'RemoveManagerFromProfile', name: 'הסרת מנהל מהפרופיל' },
        ],
    },
    {
        id: 'DistributionGroup',
        name: 'רשימת תפוצה',
        subcategories: [
            { id: 'DistributionGroupCreation', name: 'יצירת רשימת תפוצה' },
            { id: 'DistributionGroupEdit', name: 'עריכת רשימת תפוצה' },
            { id: 'DistributionGroupDeletion', name: 'מחיקה רשימת תפוצה' },
            { id: 'AddUserToDistributionGroup', name: 'הוספת משתמש לרשימת תפוצה' },
            { id: 'RemoveUserFromDistributionGroup', name: 'הסרת משתמש מהרשימת תפוצה' },
            { id: 'AddManagerToDistributionGroup', name: 'הוספת מנהל לרשימת תפוצה' },
            { id: 'RemoveManagerFromDistributionGroup', name: 'הסרת מנהל מהרשימת תפוצה' }
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
