const TMDB_API_KEY = 'removed';

async function searchMedia(query) {
  const googleBooksURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  const tmdbURL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

  try {
    const [booksResponse, tmdbResponse] = await Promise.all([
      fetch(googleBooksURL),
      fetch(tmdbURL)
    ]);

    const booksData = await booksResponse.json();
    const tmdbData = await tmdbResponse.json();

    const books = booksData.items?.map(item => ({
      type: 'book',
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      link: item.volumeInfo.infoLink
    })) || [];

    const movies = tmdbData.results?.map(movie => ({
      type: 'movie',
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      release_date: movie.release_date
    })) || [];

    return [...books, ...movies];

  } catch (err) {
    console.error("Search API error:", err);
    return [];
  }
}

function displayResults(results) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  if (!results.length) {
    container.innerHTML = '<p>No results found.</p>';
    return;
  }

  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-card';

    let description = item.description || item.overview || 'No description available.';
    if (description.length > 150) description = description.slice(0, 147) + '...';

    card.innerHTML = `
      <h3>${item.title}</h3>
      ${item.thumbnail || item.poster ? `<img src="${item.thumbnail || item.poster}" alt="${item.title}">` : ''}
      ${item.authors ? `<p><strong>Author(s):</strong> ${item.authors.join(', ')}</p>` : ''}
      ${item.release_date ? `<p><strong>Release Date:</strong> ${item.release_date}</p>` : ''}
      <p>${description}</p>
      <medium class="result-type">Type: ${item.type}</medium>
    `;

    if (item.type === 'book' && item.link) {
      const wrapper = document.createElement('a');
      wrapper.href = item.link;
      wrapper.target = '_blank';
      wrapper.style.textDecoration = 'none';
      wrapper.style.color = 'inherit';

      wrapper.onclick = (e) => {
        e.preventDefault();
        fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ itemId: item.link, title: item.title, type: 'book' })
        }).finally(() => {
          window.open(item.link, '_blank');
        });
      };

      wrapper.appendChild(card);
      container.appendChild(wrapper);
    }

    else if (item.type === 'movie') {
      card.style.cursor = 'pointer';
      card.onclick = () => {
        fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ itemId: item.title, title: item.title, type: 'movie' })
        }).finally(() => {
          window.location.href = `movie.html?id=${encodeURIComponent(item.title)}`;
        });
      };
      container.appendChild(card);
    }
  });
}
