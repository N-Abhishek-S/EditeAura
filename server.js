import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import contactHandler from './api/contact.js';

async function createServer() {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Vercel Serverless Function Mock
  app.post('/api/contact', async (req, res) => {
    try {
      // Pass the express req and res directly to the handler
      // Express' res.status().json() matches Vercel's signature perfectly
      await contactHandler(req, res);
    } catch (error) {
      console.error("API Route Error:", error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // Vite integration for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = process.env.PORT || 5173;
  app.listen(port, () => {
    console.log(`\n🚀 Local Development Server running at http://localhost:${port}`);
    console.log(`🌐 Vite frontend and /api routes are now active.\n`);
  });
}

createServer();
