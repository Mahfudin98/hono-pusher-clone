import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB, isConnected } from './db.js';
import type { WSContext } from 'hono/ws';

const app = new Hono();

// CORS whitelist configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use('/*', cors({
  origin: (origin) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return '*';
    
    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return origin;
    }
    
    // Reject origin
    return null;
  },
  credentials: true,
}));

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

// Store connected clients
// In a real app, you might want to use Redis or similar for scaling
const clients = new Set<WSContext>();

// Info endpoint - shows base URL and connection status
app.get('/info', (c) => {
  // Use BASE_URL env var if set, otherwise auto-detect from request
  const baseUrl = process.env.BASE_URL || (() => {
    const protocol = c.req.header('x-forwarded-proto') || 'http';
    const host = c.req.header('host') || 'localhost:3000';
    return `${protocol}://${host}`;
  })();
  
  return c.json({
    name: 'Hono Pusher Clone',
    version: '1.0.0',
    baseUrl,
    endpoints: {
      info: `${baseUrl}/info`,
      websocket: `${baseUrl.replace('http', 'ws')}/ws`,
      trigger: `${baseUrl}/trigger`,
      demo: `${baseUrl}/`,
    },
    status: {
      mongodb: isConnected() ? 'connected' : 'disconnected',
      websocket: 'ready',
      clients: clients.size,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      baseUrlSource: process.env.BASE_URL ? 'env' : 'auto-detected',
    },
  });
});

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onOpen(event, ws) {
        console.log('Client connected');
        clients.add(ws);
      },
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send('Hello from server!');
      },
      onClose(event, ws) {
        console.log('Client disconnected');
        clients.delete(ws);
      },
    };
  })
);

app.post('/trigger', async (c) => {
  const body = await c.req.json();
  const { channel, event, data } = body;

  console.log(`Triggering event: ${event} on channel: ${channel}`);

  const message = JSON.stringify({ channel, event, data });

  // Broadcast to all connected clients
  clients.forEach((ws) => {
    ws.send(message);
  });

  return c.json({ success: true, message: 'Event triggered' });
});

app.get('/', serveStatic({ path: './public/index.html' }));
app.get('/public/*', serveStatic({ root: './' }));

// Start server (don't wait for DB connection)
const port = Number(process.env.PORT) || 3000;

const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);

console.log(`🚀 Server is running on port ${port}`);
console.log(`📍 Visit /info endpoint to see base URL and status`);

// Connect to DB in background
connectDB().then((connected) => {
  if (connected) {
    console.log('✅ Database ready');
  }
});
