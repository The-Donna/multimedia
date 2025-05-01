const TMDB_API_KEY = 'removed'; 

async function searchMedia(query) {
  // Google Books API
  const googleBooksURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

  // TMDB API
  const tmdbURL = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

  try {
    const [booksResponse, tmdbResponse] = await Promise.all([
      fetch(googleBooksURL),
      fetch(tmdbURL)
    ]);

    const booksData = await booksResponse.json();
    const tmdbData = await tmdbResponse.json();

    // Format books
    const books = booksData.items?.map(item => ({
      type: 'book',
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      link: item.volumeInfo.infoLink
    })) || [];

    // Format movies/TV
    const media = tmdbData.results?.map(item => ({
      type: item.media_type, // 'movie', 'tv', or 'person'
      title: item.title || item.name,
      overview: item.overview,
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      release_date: item.release_date || item.first_air_date
    })) || [];

    // Combine results
    return [...books, ...media];

  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function displayResults(results) {
    const container = document.getElementById('results');
    container.innerHTML = '';
  
    if (!results || results.length === 0) {
      container.innerHTML = '<p>No results found.</p>';
      return;
    }
  
    results.forEach(item => {
      const card = document.createElement('div');
      card.className = 'result-card';
  
      // Trim long descriptions/overviews to 150 characters
      let description = item.description || item.overview || 'No description available.';
      if (description.length > 150) {
        description = description.slice(0, 147) + '...';
      }
  
      card.innerHTML = `
        <h3>${item.title}</h3>
        ${item.thumbnail || item.poster ? `<img src="${item.thumbnail || item.poster}" alt="${item.title}">` : ''}
        ${item.authors ? `<p><strong class="result-type">Author(s):</strong> ${item.authors.join(', ')}</p>` : ''}
        ${item.release_date ? `<p><strong class="result-type">Release Date:</strong> ${item.release_date}</p>` : ''}
        <p>${description}</p>
        <medium class="result-type">Type: ${item.type}</medium>
      `;
      container.appendChild(card);
    });
  }
  
  
  


