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
const DATABASE_URL = config.DATABASE_URL;

// Setup Postgres Pool
export const pgPool = new Pool({
  connectionString: DATABASE_URL,
});

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());
app.use(cookieParser());
app.use(getSTSMiddleware());

// PostGraphile Middleware
const pluginHook = makePluginHook([
  // Add any plugin hooks here if needed
]);

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

// API Routes
// API Routes - Initialized after schema build in startServer
// app.use('/audit', auditRouter); // Removed in favor of dynamic initialization

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
const clientBuildPath = path.join(__dirname, "../../dist");
app.use(express.static(clientBuildPath));

// Initialize and start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize performQuery (internally builds schema)
    const performQuery = await getPerformQuery(pgPool);

    // Initialize and mount routers with performQuery
    app.use("/audit", createAuditRouter(performQuery));

    app.use(errorMiddleware);

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get("/", (req, res) => {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API available at http://localhost:${PORT}/audit/events`);
      console.log(
        `Create GraphQL API available at http://localhost:${PORT}/graphql`,
      );
      console.log(
        `Create GraphiQL available at http://localhost:${PORT}/graphiql`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
