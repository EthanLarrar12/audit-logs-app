import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { postgraphile, makePluginHook } from "postgraphile";
import PostGraphileConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import path from "path";
import { Pool } from "pg";
import { createAuditRouter } from "./routers/audit";

import { getPerformQuery } from "../sdks/performQuery";
import { getSTSMiddleware } from "../sdks/STS";
import { errorMiddleware } from "../sdks/errorMiddleware";
import { config } from "./config";

const app = express();
const PORT = config.PORT;
const PGQL_DB_URL = config.PGQL_DB_URL;

const connectionUrl = new URL(PGQL_DB_URL);
connectionUrl.searchParams.append("application_name", config.APPLICATION_NAME);

// Setup Postgres Pool
export const pgPool = new Pool({
  connectionString: connectionUrl.toString(),
});

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());
app.use(cookieParser());

// PostGraphile Middleware
const pluginHook = makePluginHook([
  // Add any plugin hooks here if needed
]);

if (config.IS_NPM_RUN_DEV) {
  app.use(
    postgraphile(
      pgPool,
      ["history", "api"], // Target schema(s)
      {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        appendPlugins: [PostGraphileConnectionFilterPlugin],
        retryOnInitFail: true,
        dynamicJson: true,
        allowExplain: (req) => {
          return true;
        },
      },
    ),
  );
}

// Health check
app.get(
  "/health",
  (
    req: express.Request,
    res: express.Response<{ status: string; message: string }>,
  ): void => {
    res.json({ status: "ok", message: "Audit Logs API is running" });
  },
);

// Serve static files from the React app
const clientBuildPath = config.IS_NPM_RUN_DEV ?
  path.join(__dirname, "../../dist") :
  path.join(__dirname, "../../../../dist");

app.use('/audit', express.static(clientBuildPath));

app.get("/audit", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.use(getSTSMiddleware({
  stsURI: config.STS_URL,
  serverURI: config.SERVER_URL,
  applicationRedirectURI: config.APPLICATION_REDIRECT_URL,
  allowCrossOrigin: true
}));

// Initialize and start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize performQuery (internally builds schema)
    const performQuery = await getPerformQuery(pgPool);

    // Initialize and mount routers with performQuery
    app.use("/audit", createAuditRouter(performQuery));

    app.use(errorMiddleware);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API available at http://localhost:${PORT}/audit/events`);
      if (config.IS_NPM_RUN_DEV) {
        console.log(
          `Create GraphQL API available at http://localhost:${PORT}/graphql`,
        );
        console.log(
          `Create GraphiQL available at http://localhost:${PORT}/graphiql`,
        );
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
