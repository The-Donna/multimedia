const express = require('express');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// GET /api/movies/search?q=title
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });

  try {
    const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Movie search proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from TMDB' });
  }
});

// GET /api/movies/genre/:genreId?limit=24
// Paginates through TMDB discover until `limit` results are collected.
router.get('/genre/:genreId', async (req, res) => {
  const { genreId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 24;

  try {
    let allResults = [];
    let page = 1;
    const maxPages = 10; // safety cap

    while (allResults.length < limit && page <= maxPages) {
      const url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${encodeURIComponent(genreId)}&sort_by=popularity.desc&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        allResults = allResults.concat(data.results);
      } else {
        break;
      }
      page++;
    }

    res.json({ results: allResults.slice(0, limit) });
  } catch (err) {
    console.error('Movie genre proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from TMDB' });
  }
});

// GET /api/movies/random
// Picks a random movie from a random popular-movies page.
router.get('/random', async (req, res) => {
  try {
    const page = Math.floor(Math.random() * 500) + 1;
    const url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'No movies found' });
    }

    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
    res.json(randomMovie);
  } catch (err) {
    console.error('Random movie proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from TMDB' });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const url = `${BASE_URL}/movie/${encodeURIComponent(id)}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Movie detail proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from TMDB' });
  }
});

// GET /api/movies/:id/videos
router.get('/:id/videos', async (req, res) => {
  const { id } = req.params;

  try {
    const url = `${BASE_URL}/movie/${encodeURIComponent(id)}/videos?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Movie videos proxy error:', err);
    res.status(502).json({ error: 'Failed to fetch from TMDB' });
  }
});

module.exports = router;