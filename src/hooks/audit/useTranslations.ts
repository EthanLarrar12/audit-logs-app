import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithCreds } from '@/lib/api';
import { TranslationDictionary, TranslationRequestValues } from '@/types/audit';

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
        sabat: 'סב"ט',
        tafkid: "תפקיד",
        tatash: 'תת"ש',
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
        colored_sabat: 'סב"ט צבעוני',
        creation_date: "תאריך יצירה",
        domain_source: "מקור דומיין",
        personal_number: "מספר אישי",
        yechida_hatzava: "יחידת הצבה",
        yechida_sipuach: "יחידת סיפוח",
        last_portal_sync: "סנכרון אחרון של מידע שלישותי",
        creator_system_id: "מערכת יוצרת",
        operational_phone: "טלפון מבצעי",
        updated_at: "תאריך עדכון",
        last_kartoffel_sync: "סנכרון אחרון מאמ\"ן",
        is_portal_user: "קיים במקור שלישותי"
    },
    values: {
        "*": {
            "true": "כן",
            "false": "לא",
            "null": "ריק",
            AMAN: 'אמ"ן',
            CTS: "סודי ביותר",
            UNKNOWN: "לא ידוע",
            BLUE: "כחול",
            RED: "אדום",
            WHITE: "לבן",
            PURPLE: "סגול",
        }
    }
};

// Internal API call to backend route
async function fetchTranslations(paramIds: string[], values: TranslationRequestValues): Promise<TranslationDictionary> {
    if (paramIds.length === 0 && Object.keys(values).length === 0) {
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
export const useTranslations = (paramIds: string[] = [], values: TranslationRequestValues = {}) => {
    const queryClient = useQueryClient();

    const sortedParamIds = [...paramIds].sort();
    const sortedParamIdString = sortedParamIds.join(',');

    const entriesOfValues = Object.entries(values);
    const sortedValueEntries = entriesOfValues.map(([pId, vIds]) => {
        const sortedVIds = [...vIds].sort();
        const vIdsString = sortedVIds.join('|');
        return `${pId}:${vIdsString}`;
    });
    sortedValueEntries.sort();
    const sortedValuesString = sortedValueEntries.join(',');

    const queryKeyBatch = ['translations-batch', sortedParamIdString, sortedValuesString];

    const hasParamIds = paramIds.length > 0;
    const hasValues = Object.keys(values).length > 0;
    const isQueryEnabled = hasParamIds || hasValues;

    return useQuery({
        // We still use local query keys for uniqueness to trigger renders correctly based on inputs,
        // but the queryFn itself will look up and mutate the global cache.
        queryKey: queryKeyBatch,
        queryFn: async () => {
            // 1. Get current global dictionary and merge with hardcoded defaults
            const cachedData = queryClient.getQueryData<TranslationDictionary>(['global-translations']);
            const emptyGlobalDict: TranslationDictionary = { parameters: {}, values: {} };
            const cachedGlobalDict = cachedData || emptyGlobalDict;

            const hardcodedParameters = HARDCODED_TRANSLATIONS.parameters;
            const existingParameters = cachedGlobalDict.parameters;
            const mergedGlobalParameters = { ...hardcodedParameters, ...existingParameters };

            const existingGlobalValues = cachedGlobalDict.values; // Record<string, Record<string, string>>

            const globalDict = {
                parameters: mergedGlobalParameters,
                values: existingGlobalValues,
            };

            // 2. Identify what is genuinely missing
            const missingParams = paramIds.filter(id => {
                const isParameterCached = id in globalDict.parameters;
                return !isParameterCached;
            });

            // For values, determine what's missing by checking if pair is in cache 
            // AND the generic value isn't in hardcoded defaults
            const missingValues: TranslationRequestValues = {};

            for (const [pId, vIds] of entriesOfValues) {
                const missingForParam = vIds.filter(vId => {
                    const cachedParamValues = globalDict.values[pId];
                    const hasCached = cachedParamValues && (vId in cachedParamValues);

                    const hardcodedSpecificMap = HARDCODED_TRANSLATIONS.values[pId];
                    const isSpecificHardcoded = hardcodedSpecificMap?.[vId];

                    const hardcodedGenericMap = HARDCODED_TRANSLATIONS.values["*"];
                    const isGenericHardcoded = hardcodedGenericMap?.[vId];

                    const isHardcoded = isSpecificHardcoded || isGenericHardcoded;

                    const isMissing = !hasCached && !isHardcoded;
                    return isMissing;
                });

                const hasMissingItems = missingForParam.length > 0;
                if (hasMissingItems) {
                    missingValues[pId] = missingForParam;
                }
            }

            // 3. Fetch missing pieces (if any)
            let newTranslations: TranslationDictionary = { parameters: {}, values: {} };

            const hasMissingParamsToFetch = missingParams.length > 0;
            const hasMissingValuesToFetch = Object.keys(missingValues).length > 0;
            const needsFetch = hasMissingParamsToFetch || hasMissingValuesToFetch;

            if (needsFetch) {
                newTranslations = await fetchTranslations(missingParams, missingValues);
            }

            // 4. Merge server translations specifically into the cacheable global dictionary
            const existingCacheableParams = cachedGlobalDict.parameters;
            const newFetchedParams = newTranslations.parameters;
            const combinedCacheableParams = { ...existingCacheableParams, ...newFetchedParams };

            const existingCacheableValues = { ...cachedGlobalDict.values }; // Shallow copy first

            const updatedCacheableDict: TranslationDictionary = {
                parameters: combinedCacheableParams,
                values: existingCacheableValues,
            };

            // Deep merge new deeply nested parameterId -> valueId maps
            const newValuesEntries = Object.entries(newTranslations.values);
            for (const [pId, vMap] of newValuesEntries) {
                const existingMapForParam = updatedCacheableDict.values[pId];

                if (!existingMapForParam) {
                    updatedCacheableDict.values[pId] = {};
                }

                const currentMapForParam = updatedCacheableDict.values[pId];
                const mergedMapForParam = { ...currentMapForParam, ...vMap };

                updatedCacheableDict.values[pId] = mergedMapForParam;
            }

            // 5. Update global cache
            queryClient.setQueryData(['global-translations'], updatedCacheableDict);

            // 6. Return the local subset of translations needed for this specific hook call
            const cacheableParams = updatedCacheableDict.parameters;
            const fullParameters = { ...HARDCODED_TRANSLATIONS.parameters, ...cacheableParams };
            const fullValues = updatedCacheableDict.values;

            const localResult: TranslationDictionary = { parameters: {}, values: {} };

            paramIds.forEach(id => {
                const translatedParam = fullParameters[id];
                if (translatedParam) {
                    localResult.parameters[id] = translatedParam;
                }
            });

            for (const [pId, vIds] of entriesOfValues) {
                vIds.forEach(vId => {
                    const valuesForParam = fullValues[pId];
                    const translated = valuesForParam?.[vId];

                    const hardcodedSpecificMap = HARDCODED_TRANSLATIONS.values[pId];
                    const hardcodedSpecific = hardcodedSpecificMap?.[vId];

                    const hardcodedGenericMap = HARDCODED_TRANSLATIONS.values["*"];
                    const hardcodedGeneric = hardcodedGenericMap?.[vId];

                    const resolvedTranslation = translated || hardcodedSpecific || hardcodedGeneric;

                    if (resolvedTranslation) {
                        const localResultParamMap = localResult.values[pId];
                        if (!localResultParamMap) {
                            localResult.values[pId] = {};
                        }

                        localResult.values[pId][vId] = resolvedTranslation;
                    }
                });
            }

            return localResult;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        enabled: isQueryEnabled, // Only fetch if there are things to translate
    });
};
