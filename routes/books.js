const express = require('express');
const router = express.Router();

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// GET /api/books/search?q=keyword&maxResults=10
router.get('/search', async (req, res) => {
  const { q, maxResults } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(q)}&maxResults=${encodeURIComponent(maxResults || 10)}&key=${GOOGLE_BOOKS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Books search proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from Google Books' });
  }
});

// GET /api/books/genre/:genre?maxResults=24
router.get('/genre/:genre', async (req, res) => {
  const { genre } = req.params;
  const { maxResults } = req.query;

  try {
    const url = `${BASE_URL}?q=subject:${encodeURIComponent(genre)}&maxResults=${encodeURIComponent(maxResults || 24)}&key=${GOOGLE_BOOKS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Books genre proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from Google Books' });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const url = `${BASE_URL}/${encodeURIComponent(id)}?key=${GOOGLE_BOOKS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Books detail proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from Google Books' });
  }
});

module.exports = router;