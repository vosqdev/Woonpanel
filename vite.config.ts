import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function netlifyFunctionsDevPlugin(): Plugin {
  return {
    name: 'netlify-functions-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (
          url.startsWith('/.netlify/functions/submit-survey') ||
          url.startsWith('/api/submit-survey')
        ) {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                if (
                  process.env.FIREBASE_SERVICE_ACCOUNT ||
                  (process.env.FIREBASE_CLIENT_EMAIL &&
                    process.env.FIREBASE_PRIVATE_KEY)
                ) {
                  try {
                    const { handler } = await import(
                      './netlify/functions/submit-survey.ts'
                    );
                    const event = {
                      httpMethod: 'POST',
                      headers: req.headers as Record<string, string>,
                      body,
                      rawUrl: url,
                      rawQuery: '',
                      path: url,
                      multiValueHeaders: {},
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      isBase64Encoded: false,
                    };
                    const result = await (handler as any)(event, {});
                    res.statusCode = result?.statusCode || 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(result?.body || JSON.stringify({ success: true }));
                    return;
                  } catch (e) {
                    console.warn('Dev Firebase handler execution fallback:', e);
                  }
                }

                const parsed = JSON.parse(body || '{}');
                const year = new Date().getFullYear();
                const code = Math.random().toString(36).substring(2, 8).toUpperCase();
                const submissionNumber = `WP-${year}-${code}`;

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: true,
                    id: parsed.id || `dev_${Date.now()}`,
                    submissionNumber,
                    submittedAt: new Date().toISOString(),
                    message: 'Inzending lokaal verwerkt (dev mode).',
                  })
                );
              } catch (err: any) {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    success: false,
                    error: err?.message || 'Ongeldige aanvraag',
                  })
                );
              }
            });
            return;
          }
        }

        if (
          url.startsWith('/.netlify/functions/register-panel-member') ||
          url.startsWith('/api/register-member')
        ) {
          if (req.method === 'POST') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                message: 'Panellid geregistreerd (dev mode).',
              })
            );
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), netlifyFunctionsDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

