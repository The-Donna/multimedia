(function () {
  const { googleSubject, tmdbGenreId } = window.GENRE;

  async function loadGenreBooks() {
    const maxResults = 24;
    const url = `/api/books/genre/${encodeURIComponent(googleSubject)}?maxResults=${maxResults}&_=${Date.now()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      displayBookResults(data.items || []);
    } catch (error) {
      console.error('Error fetching book data:', error);
      document.getElementById('bookresults').innerHTML =
        `<p style="color:red;">Error fetching book data: ${error.message}</p>`;
    }
  }

  function displayBookResults(books) {
    const resultsDiv = document.getElementById('bookresults');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = '';
    if (!books.length) {
      resultsDiv.innerHTML = '<p>No books found.</p>';
      return;
    }

    books.forEach(book => {
      const title = book.volumeInfo?.title || 'No title available';
      const authors = book.volumeInfo?.authors ? book.volumeInfo.authors.join(', ') : 'Unknown author';
      const thumbnail = book.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/128x200';
      const description = book.volumeInfo?.description || 'No description available';

      const bookElement = document.createElement('a');
      bookElement.href = `/book.html?id=${book.id}`;
      bookElement.style.textDecoration = 'none';
      bookElement.style.color = 'inherit';

      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = `
        <img src="${thumbnail}" alt="${title}">
        <h3>${title}</h3>
        <p><strong>Author(s):</strong> ${authors}</p>
        <p><strong>Description:</strong> ${description.substring(0, 300)}...</p>
        <button class="favorite-button" data-type="book" data-id="${book.id}" data-title="${encodeURIComponent(title)}" data-thumbnail="${encodeURIComponent(thumbnail)}" data-description="${encodeURIComponent(description)}">
          <i class="far fa-star"></i>
        </button>
      `;

      bookElement.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-button')) {
          e.preventDefault();
          return;
        }
        e.preventDefault();

        fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ itemId: book.id || title, title, type: 'book' })
        })
          .catch(err => console.error('History error:', err))
          .finally(() => { window.location.href = `/book.html?id=${book.id}`; });
      });

      bookElement.appendChild(contentDiv);
      resultsDiv.appendChild(bookElement);
    });
  }

  async function loadGenreMovies(limit) {
    try {
      const response = await fetch(`/api/movies/genre/${encodeURIComponent(tmdbGenreId)}?limit=${limit}`);
      const data = await response.json();
      displayMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      document.getElementById('moviesresults').innerHTML =
        `<p style="color:red;">Error fetching movie data: ${error.message}</p>`;
    }
  }

  function displayMovies(movies) {
    const movieList = document.getElementById('moviesresults');
    movieList.innerHTML = '';

    if (!movies.length) {
      movieList.innerHTML = '<p>No movies found.</p>';
      return;
    }

    movies.forEach(movie => {
      const movieDiv = document.createElement('div');
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : 'https://via.placeholder.com/200x300';
      const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown';
      const overview = movie.overview ? movie.overview.slice(0, 150) + '...' : 'No overview available';

      movieDiv.innerHTML = `
        <a href="/movie.html?id=${movie.id}" style="text-decoration:none;">
          <div class="movieCard">
            <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
            <h3>${movie.title}</h3>
            <p><strong>Release Year:</strong> ${releaseYear}</p>
            <p><strong>Overview:</strong> ${overview}</p>
          </div>
        </a>
        <button class="favorite-button" data-type="movie" data-id="${movie.id}" data-title="${encodeURIComponent(movie.title)}" data-poster_path="${encodeURIComponent(posterUrl)}" data-overview="${encodeURIComponent(movie.overview)}" data-release_date="${encodeURIComponent(movie.release_date)}">
          <i class="far fa-star"></i>
        </button>
      `;

      movieList.appendChild(movieDiv);
    });
  }

  window.addEventListener('load', () => {
    loadGenreBooks();
    loadGenreMovies(24);
  });
})();