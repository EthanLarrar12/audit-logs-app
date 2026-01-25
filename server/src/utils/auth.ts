/**
 * Utility to generate RLS (Row Level Security) filters based on user identity
 */
export const getRlsFilters = (userId: string): any => {
    return {
        or: [
            { executor: { equalTo: userId } },
            { target: { equalTo: userId } }
        ]
    };
};
