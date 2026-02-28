import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithCreds } from '@/lib/api';
import { TranslationDictionary, TranslationValue } from '@/types/audit';

// Hardcoded dictionary for common keys/values not in the database
const HARDCODED_TRANSLATIONS: TranslationDictionary = {
    parameters: {
        id: "מזהה",
        mail: "כתובת מייל",
        telephone: "טלפון",
        ugda: "אוגדה",
        chail: "חיל",
        minuy: "מינוי",
        pikud: "פיקוד",
        sabat: "סב\"ט",
        tafkid: "תפקיד",
        tatash: "תת\"ש",
        address: "כתובת",
        domains: "דומיינים",
        miktzoa: "מקצוע",
        samchut: "סמכות",
        id_number: "מספר תעודת זהות",
        last_name: "שם משפחה",
        first_name: "שם פרטי",
        synced_at: "תאריך סנכרון",
        is_blocked: "חסום",
        sug_sherut: "סוג שירות",
        display_name: "שם תצוגה",
        colored_sabat: "סב\"ט צבעוני",
        creation_date: "תאריך יצירה",
        domain_source: "מקור דומיין",
        personal_number: "מספר אישי",
        yechida_hatzava: "יחידת הצבה",
        yechida_sipuach: "יחידת סיפוח",
        last_portal_sync: "סנכרון אחרון של מידע שלישותי",
        creator_system_id: "מערכת יוצרת",
        operational_phone: "טלפון מבצעי",
        updated_at: "תאריך עדכון",
    },
    values: {
        domain_source: {
            AMAN: "אמ\"ן",
            CTS: "סודי ביותר",
            UNKNOWN: "לא ידוע",
        },
        domains: {
            AMAN: "אמ\"ן",
            CTS: "סודי ביותר",
        }
    }
};

// Internal API call to backend route
async function fetchTranslations(paramIds: string[], values: TranslationValue[]): Promise<TranslationDictionary> {
    if (paramIds.length === 0 && values.length === 0) {
        return { parameters: {}, values: {} };
    }

    const response = await fetchWithCreds('/audit/translations', {
        method: 'POST',
        body: JSON.stringify({ paramIds, values }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch translations');
    }

    return response.json();
}

/**
 * Smart hook that fetches translations.
 * It checks the global React Query cache first, identifies missing keys/values,
 * fetches ONLY the missing ones from the server, and then merges them back into the global dictionary.
 */
export const useTranslations = (paramIds: string[] = [], values: TranslationValue[] = []) => {
    const queryClient = useQueryClient();

    return useQuery({
        // We still use local query keys for uniqueness to trigger renders correctly based on inputs,
        // but the queryFn itself will look up and mutate the global cache.
        queryKey: ['translations-batch', paramIds.sort().join(','), values.map(v => `${v.parameterId}:${v.valueId}`).sort().join(',')],
        queryFn: async () => {
            // 1. Get current global dictionary and merge with hardcoded defaults
            const cachedGlobalDict = queryClient.getQueryData<TranslationDictionary>(['global-translations']) || { parameters: {}, values: {} };

            const globalDict = {
                parameters: { ...HARDCODED_TRANSLATIONS.parameters, ...cachedGlobalDict.parameters },
                values: cachedGlobalDict.values, // cachedGlobalDict.values is Record<string, Record<string, string>>
            };

            // 2. Identify what is genuinely missing
            const missingParams = paramIds.filter(id => !(id in globalDict.parameters));

            // For values, determine what's missing by checking if pair is in cache 
            // AND the generic value isn't in hardcoded defaults
            const missingValues = values.filter(v => {
                const hasCached = globalDict.values[v.parameterId] && (v.valueId in globalDict.values[v.parameterId]);
                const isHardcoded = HARDCODED_TRANSLATIONS.values[v.parameterId]?.[v.valueId] || HARDCODED_TRANSLATIONS.values["*"]?.[v.valueId];
                return !hasCached && !isHardcoded;
            });

            // 3. Fetch missing pieces (if any)
            let newTranslations: TranslationDictionary = { parameters: {}, values: {} };
            if (missingParams.length > 0 || missingValues.length > 0) {
                newTranslations = await fetchTranslations(missingParams, missingValues);
            }

            // 4. Merge server translations specifically into the cacheable global dictionary
            const updatedCacheableDict: TranslationDictionary = {
                parameters: { ...cachedGlobalDict.parameters, ...newTranslations.parameters },
                values: { ...cachedGlobalDict.values }, // Shallow copy first
            };

            // Deep merge new deeply nested parameterId -> valueId maps
            for (const [pId, vMap] of Object.entries(newTranslations.values)) {
                if (!updatedCacheableDict.values[pId]) {
                    updatedCacheableDict.values[pId] = {};
                }
                updatedCacheableDict.values[pId] = { ...updatedCacheableDict.values[pId], ...vMap };
            }

            // 5. Update global cache
            queryClient.setQueryData(['global-translations'], updatedCacheableDict);

            // 6. Return the local subset of translations needed for this specific hook call
            const fullParameters = { ...HARDCODED_TRANSLATIONS.parameters, ...updatedCacheableDict.parameters };
            const fullValues = updatedCacheableDict.values;

            const localResult: TranslationDictionary = { parameters: {}, values: {} };
            paramIds.forEach(id => {
                if (fullParameters[id]) localResult.parameters[id] = fullParameters[id];
            });
            values.forEach(v => {
                const translated = fullValues[v.parameterId]?.[v.valueId];
                const hardcodedSpecific = HARDCODED_TRANSLATIONS.values[v.parameterId]?.[v.valueId];
                const hardcodedGeneric = HARDCODED_TRANSLATIONS.values["*"]?.[v.valueId];

                if (translated) {
                    if (!localResult.values[v.parameterId]) localResult.values[v.parameterId] = {};
                    localResult.values[v.parameterId][v.valueId] = translated;
                } else if (hardcodedSpecific) {
                    if (!localResult.values[v.parameterId]) localResult.values[v.parameterId] = {};
                    localResult.values[v.parameterId][v.valueId] = hardcodedSpecific;
                } else if (hardcodedGeneric) {
                    if (!localResult.values[v.parameterId]) localResult.values[v.parameterId] = {};
                    localResult.values[v.parameterId][v.valueId] = hardcodedGeneric;
                }
            });

            return localResult;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        enabled: paramIds.length > 0 || values.length > 0, // Only fetch if there are things to translate
    });
};
