// Cloudflare Worker for Decap CMS GitHub OAuth
// Deploy this worker to handle OAuth authentication for Decap CMS

// Configuration - Add these as secrets in Cloudflare Worker settings
const CLIENT_ID = 'YOUR_GITHUB_OAUTH_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GITHUB_OAUTH_CLIENT_SECRET';
const ALLOWED_ORIGIN = 'https://yourdomain.com'; // Your site URL

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // Route: /auth - Start OAuth flow
    if (url.pathname === '/auth') {
      return handleAuth(url);
    }

    // Route: /callback - OAuth callback from GitHub
    if (url.pathname === '/callback') {
      return await handleCallback(url);
    }

    return new Response('Not Found', { status: 404 });
  },
};

// Start OAuth flow by redirecting to GitHub
function handleAuth(url) {
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('scope', 'repo,user');
  
  // Pass through any state parameter
  const state = url.searchParams.get('state');
  if (state) {
    authUrl.searchParams.set('state', state);
  }

  return Response.redirect(authUrl.toString(), 302);
}

// Handle OAuth callback from GitHub
async function handleCallback(url) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    return new Response('Error: No code provided', { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await tokenResponse.json();

    if (data.error) {
      throw new Error(data.error_description || data.error);
    }

    // Send token back to CMS popup window using postMessage
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorizing...</title>
        </head>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("receiveMessage %o", e);
                window.opener.postMessage(
                  'authorization:github:success:${JSON.stringify(data)}',
                  e.origin
                );
              }
              window.addEventListener("message", receiveMessage, false);
              
              // Also try sending immediately
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify(data)}',
                '${ALLOWED_ORIGIN}'
              );
              
              // Close the popup after a short delay
              setTimeout(function() {
                window.close();
              }, 1000);
            })();
          </script>
          <p>Authorization successful. This window should close automatically.</p>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      },
    });

  } catch (error) {
    console.error('OAuth error:', error);
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Error</title>
        </head>
        <body>
          <h1>Authorization Failed</h1>
          <p>${error.message}</p>
          <p>Please close this window and try again.</p>
        </body>
      </html>
    `;

    return new Response(errorHtml, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// Handle CORS preflight requests
function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
