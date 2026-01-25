import express from 'express';
import cors from 'cors';
import { postgraphile, makePluginHook } from 'postgraphile';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { Pool } from 'pg';
import auditRouter from './routers/audit';
import { buildGraphQLSchema } from './GQL/schema';

const app = express();
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/audit_logs';

// Setup Postgres Pool
export const pgPool = new Pool({
    connectionString: DATABASE_URL,
});

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());

// PostGraphile Middleware
const pluginHook = makePluginHook([
    // Add any plugin hooks here if needed
]);

app.use(
    postgraphile(
        pgPool,
        ['history', 'api'], // Target schema(s)
        {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
            appendPlugins: [PostGraphileConnectionFilterPlugin],
            retryOnInitFail: true,
            dynamicJson: true,
            allowExplain: (req) => { return true; },
        }
    )
);

// API Routes
app.use('/audit', auditRouter);

// Health check
app.get('/health', (req: express.Request, res: express.Response<{ status: string; message: string }>): void => {
    res.json({ status: 'ok', message: 'Audit Logs API is running' });
});

// Initialize and start server
const startServer = async (): Promise<void> => {
    try {
        // Build GraphQL schema first
        await buildGraphQLSchema(pgPool);

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 API available at http://localhost:${PORT}/audit/events`);
            console.log(`Create GraphQL API available at http://localhost:${PORT}/graphql`);
            console.log(`Create GraphiQL available at http://localhost:${PORT}/graphiql`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
