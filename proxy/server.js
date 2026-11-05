const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Allow requests from all domains containing localhost, Expo development URLs, or Vercel/Render frontend origins.
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedPatterns = [
      /^https?:\/\/localhost(:\d+)?$/,
      /^https?:\/\/.*\.vercel\.app$/,
      /^https?:\/\/.*\.onrender\.com$/,
      /^exp:\/\/.*/,
    ];

    const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));
app.use(express.json());

// Basic In-Memory Cache to prevent rate limiting issues and improve UX
const cache = new Map();
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 Minutes

app.get('/api/who/:indicator', async (req, res) => {
  try {
    const { indicator } = req.params;

    // Reconstruct query parameters
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      urlParams.append(key, String(value));
    }

    const queryString = urlParams.toString() ? `?${urlParams.toString()}` : '';
    const targetUrl = `https://ghoapi.azureedge.net/api/${indicator}${queryString}`;

    // Check Cache
    if (cache.has(targetUrl)) {
      const cachedData = cache.get(targetUrl);
      if (Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
        return res.json(cachedData.data);
      }
    }

    // Fetch from WHO API with a timeout
    const response = await axios.get(targetUrl, {
      timeout: 10000, // 10 second timeout protection
    });

    // Store in cache
    cache.set(targetUrl, {
      data: response.data,
      timestamp: Date.now(),
    });

    // Return to client
    res.json(response.data);
  } catch (error) {
    console.error('[Proxy Error] Forwarding failed:', error.message);
    res.status(500).json({
      error: 'Failed to fetch data from WHO GHO API',
      details: error.response?.data || error.message,
    });
  }
});

// Simple Health Check Endpoint
app.get('/', (req, res) => {
  res.json({ status: 'active', service: 'WHO GHO Proxy Server' });
});

app.listen(PORT, () => {
  console.log(`WHO API Proxy Server running on port ${PORT}`);
});
