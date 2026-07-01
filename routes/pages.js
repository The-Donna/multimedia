const express = require('express');
const router = express.Router();

// Single source of truth for every genre page.
// googleSubject -> Google Books "subject:" search term
// tmdbGenreId -> TMDB genre id (comma-separate multiple, e.g. '53,9648')
const GENRES = {
  fiction: {
    name: 'Fiction',
    googleSubject: 'fiction',
    tmdbGenreId: 18 // Drama — closest real match. Original page used 35 (Comedy) by mistake.
  },
  horror: {
    name: 'Horror',
    googleSubject: 'horror',
    tmdbGenreId: 27
  },
  romance: {
    name: 'Romance',
    googleSubject: 'romance',
    tmdbGenreId: 10749
  },
  thriller: {
    name: 'Action/Thriller',
    googleSubject: 'thriller',
    tmdbGenreId: '53,9648'
  },
  comedy: {
    name: 'Comedy',
    googleSubject: 'comedy',
    tmdbGenreId: 35
  }
};

router.get('/index.html', (req, res) => res.render('index'));
router.get('/about.html', (req, res) => res.render('about'));
router.get('/contact.html', (req, res) => res.render('contact'));
router.get('/faq.html', (req, res) => res.render('faq'));
router.get('/book.html', (req, res) => res.render('book'));
router.get('/movie.html', (req, res) => res.render('movie'));

router.get('/genre/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const genre = GENRES[slug];

  if (!genre) {
    return res.status(404).send('Genre not found');
  }

  res.render('genre', { genre: { slug, ...genre } });
});

module.exports = router;