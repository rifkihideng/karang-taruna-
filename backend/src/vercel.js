import app from './app.js';
import { initDb } from './db.js';

// Pastikan skema & seed database siap sebelum menerima request (serverless).
await initDb();

export default app;
