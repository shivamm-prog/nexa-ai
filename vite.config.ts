import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Backend API plugin to execute Gemini API calls on the server
// Keeps API keys completely protected on the backend, away from the client browser bundle
function geminiBackendPlugin() {
  return {
    name: 'gemini-backend-api',
    configureServer(server: any) {
      server.middlewares.use('/api/gemini/generate', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const { prompt, jsonMode, apiKey: clientApiKey, model = 'gemini-2.5-flash' } = parsed;

            // Load server-side environment variables
            const env = loadEnv('development', process.cwd(), '');
            const serverApiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || clientApiKey;

            if (!serverApiKey) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: 'MISSING_API_KEY', 
                message: 'No Google Gemini API key configured on server or in request.' 
              }));
              return;
            }

            const candidateModels = [model, 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
            let lastError: any = null;
            let successText = '';

            for (const m of candidateModels) {
              try {
                const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${serverApiKey}`;
                const payload: any = {
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192
                  }
                };

                if (jsonMode) {
                  payload.generationConfig.responseMimeType = 'application/json';
                }

                const response = await fetch(targetUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  if (response.status === 429) {
                    lastError = { status: 429, message: 'Google Gemini rate limit/quota reached (429).' };
                    break;
                  }
                  lastError = { status: response.status, message: errorText };
                  continue;
                }

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  successText = text;
                  break;
                }
              } catch (err) {
                lastError = err;
              }
            }

            if (!successText) {
              res.statusCode = lastError?.status || 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: 'GEMINI_FAILURE', 
                message: lastError?.message || 'Failed to generate response from Google Gemini API.' 
              }));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: successText }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), geminiBackendPlugin()],
})
