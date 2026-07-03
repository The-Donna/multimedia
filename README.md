# Books&Co

A web app for discovering books and movies — browse by genre, search across both Google Books and TMDB, save favorites, track viewing history, and comment on titles.

## Tech stack

- **Backend:** Node.js, Express
- **Views:** EJS (server-rendered, shared partials for nav/head/footer/scripts)
- **Database:** MongoDB via Mongoose
- **Auth:** Passport (local strategy), bcrypt for password hashing, express-session for sessions
- **External APIs:** Google Books API, TMDB (The Movie Database) — both proxied through the backend so API keys never reach the browser

## Getting started

```bash
npm install
cp .env.example .env   # then fill in real values, see below
npm start               # or: node app.js
```

### Environment variables (`.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas (or local) connection string |
| `SESSION_SECRET` | Random secret for signing session cookies — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key ([console.cloud.google.com](https://console.cloud.google.com/apis/credentials)) |
| `TMDB_API_KEY` | TMDB API key ([themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)) |
| `PORT` | Port to run the server on (default `3000`) |
| `NODE_ENV` | `development` or `production` — controls secure cookie settings |

`.env` is git-ignored. Never commit real keys or the Mongo connection string.

## Project structure

```
app.js                  Express app entry point
db.js                   MongoDB connection

routes/
  pages.js              Renders all EJS page views (Index, About, Contact, FAQ, genre pages, book/movie detail)
  auth.js                Signup / login (Passport local strategy)
  history.js              GET/POST viewing history (requires auth)
  favorite.js             GET/POST/DELETE favorites (requires auth)
  comments.js              GET/POST comments on a book or movie
  books.js                 Proxies Google Books API (search, genre, detail) — hides API key
  movies.js                 Proxies TMDB API (search, genre, random, detail, videos) — hides API key

models/
  User.js                Auth: username, email (unique), hashed password, googleId
  Profile.js              Per-user saved searches + viewing history
  Favorites.js             Saved books/movies per user (unique per user+item)
  Comment.js                Comments on a book/movie, indexed by itemId

views/
  partials/
    head.ejs             Shared <head>: fonts, css, title
    nav.ejs                Shared nav bar, genre dropdown, login-aware greeting
    footer.ejs              Shared footer
    searchOverlay.ejs         Shared search results overlay markup
    scripts.ejs              Shared search/dark-mode/nav JS wiring
  index.ejs, about.ejs, contact.ejs, faq.ejs
  genre.ejs               Single template for all 5 genre pages (Fiction, Horror, Romance, Thriller, Comedy)
  book.ejs, movie.ejs       Detail pages with comments
  login.ejs, signup.ejs      Auth pages
  history.ejs, favorites.ejs   Logged-in user pages

public/
  css/                   Booksandco.css (global), genre.css, style.css (auth pages)
  js/                     Client-side scripts (see below)
  images/                 Logo and static images
```

### Key client-side scripts (`public/js/`)

- `script.js` — dark mode toggle (persisted via localStorage)
- `searchresults.js` — combined Google Books + TMDB search, renders the search overlay
- `bookgenerator.js` / `moviegenerator.js` — the homepage "Discover" random book/movie generators
- `genre.js` — drives book + movie listings on every genre page, reading config from `window.GENRE`
- `dynamicPreview.js` — book detail page: preview viewer + comments
- `movie.js` — movie detail page: details, trailer, comments
- `favorites.js` — handles the favorite/star button across all pages

## Routes overview

| Route | Method | Description |
|---|---|---|
| `/` | GET | Redirects to `/Index.html` if logged in, else `/login` |
| `/signup`, `/login` | GET/POST | Auth pages |
| `/logout` | GET | Ends session |
| `/Index.html`, `/About.html`, `/Contact.html`, `/FAQ.html` | GET | Static-content pages |
| `/book.html?id=` , `/movie.html?id=` | GET | Detail pages |
| `/history`, `/favorites` | GET | Logged-in user pages (requires auth) |
| `/api/books/*`, `/api/movies/*` | GET | Backend proxies to Google Books / TMDB |
| `/api/history` | GET/POST | View history (requires auth) |
| `/api/favorites` | POST/DELETE | Favorites (requires auth) |
| `/api/comments/:itemId` | GET/POST | Comments on a book or movie |
| `/api/profile` | GET | Current user's username + saved searches |
