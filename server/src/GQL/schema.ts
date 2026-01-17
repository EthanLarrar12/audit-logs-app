import { createPostGraphileSchema } from 'postgraphile';
import { GraphQLSchema } from 'graphql';
import { Pool } from 'pg';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';

let cachedSchema: GraphQLSchema | null = null;

/**
 * Build the PostGraphile GraphQL schema
 * This should be called once at server startup
 */
export async function buildGraphQLSchema(pgPool: Pool): Promise<GraphQLSchema> {
    if (cachedSchema) {
        return cachedSchema;
    }

    try {
        console.log('Building PostGraphile schema...');

        cachedSchema = await createPostGraphileSchema(
            pgPool,
            'history', // Target schema
            {
                appendPlugins: [PostGraphileConnectionFilterPlugin],
                dynamicJson: true,
            }
        );

        console.log('✅ PostGraphile schema built successfully');
        return cachedSchema;
    } catch (error) {
        console.error('❌ Failed to build PostGraphile schema:', error);
        throw error;
    }
}

/**
 * Get the cached schema
 * Throws if schema hasn't been built yet
 */
export function getGraphQLSchema(): GraphQLSchema {
    if (!cachedSchema) {
        throw new Error('GraphQL schema not initialized. Call buildGraphQLSchema first.');
    }
    return cachedSchema;
}
