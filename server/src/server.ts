import express from 'express';
import cors from 'cors';
import auditRouter from './routers/audit';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());

// API Routes
app.use('/audit', auditRouter);

// Health check
app.get('/health', (req: express.Request, res: express.Response<{ status: string; message: string }>): void => {
    res.json({ status: 'ok', message: 'Audit Logs API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API available at http://localhost:${PORT}/audit/events`);
});
