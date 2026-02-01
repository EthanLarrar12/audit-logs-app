import { withPostGraphileContext, createPostGraphileSchema } from 'postgraphile';
import { graphql, GraphQLSchema } from 'graphql';
import { Pool } from 'pg';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';

export type PerformQuery = (
    source: string,
    variableValues?: Record<string, any>
) => Promise<any>;

export const getPerformQuery = async (pgPool: Pool): Promise<PerformQuery> => {
    const schema = await createPostGraphileSchema(
        pgPool,
        ['history', 'api'], // Target schema
        {
            appendPlugins: [PostGraphileConnectionFilterPlugin],
            dynamicJson: true,
        }
    );

    return async (source: string, variableValues?: Record<string, any>): Promise<any> => {
        return await withPostGraphileContext(
            { pgPool },
            async (context: any) => {
                return await graphql({
                    schema,
                    source,
                    contextValue: context,
                    variableValues
                });
            }
        );
    };
};
