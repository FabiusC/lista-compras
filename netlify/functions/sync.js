const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-app.netlify.app'
];

exports.handler = async (event, context) => {
    const origin = event.headers.origin;

    // CORS headers
    const headers = {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Simple file-based storage using Netlify's file system
        // Note: This is ephemeral storage - resets on each deployment
        // For persistent storage, you'd need a proper database

        const { httpMethod, body, queryStringParameters } = event;
        const userId = queryStringParameters?.userId || 'default';

        // In a real implementation, you'd use a database like:
        // - Supabase (free tier)
        // - MongoDB Atlas (free tier) 
        // - FaunaDB (free tier)
        // - Or Firebase as configured above

        // For now, return a simple response
        if (httpMethod === 'GET') {
            // Return empty array or cached data
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    items: [],
                    lastModified: Date.now()
                })
            };
        }

        if (httpMethod === 'POST') {
            const data = JSON.parse(body || '{}');
            // Here you would save to your chosen database

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    lastModified: Date.now()
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
