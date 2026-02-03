import { withPostGraphileContext, createPostGraphileSchema } from 'postgraphile';
import { graphql, GraphQLSchema } from 'graphql';
import { Pool } from 'pg';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';

export type PerformQuery = (
    source: string,
    variableValues?: Record<string, unknown>
) => Promise<unknown>;


export const getPerformQuery = async (pgPool: Pool): Promise<PerformQuery> => {
    const schema = await createPostGraphileSchema(
        pgPool,
        ['history', 'api'], // Target schema
        {
            appendPlugins: [PostGraphileConnectionFilterPlugin],
            dynamicJson: true,
        }
    );

    return async (source: string, variableValues?: Record<string, unknown>): Promise<unknown> => {
        return await withPostGraphileContext(
            { pgPool },
            async (context: Record<string, unknown> | object) => { // context type isn't strictly typed by PostGraphile, but object/Record is better than any
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
