const apiKey = 'removed'; 
        const maxPages = 500;
        const card = document.getElementById('movie-Card');

        async function getRandomMovie() {
        const page = Math.floor(Math.random() * maxPages) + 1;
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${page}`;

        try {
            const response = await fetch(discoverUrl);
            const data = await response.json();

            if (data.results.length > 0) {
            const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
            displayMovie(randomMovie);
            } else {
            card.innerHTML = '<p>No movies found.</p>';
            }
        } catch (err) {
            console.error(err);
            card.innerHTML = '<p>Error fetching movie.</p>';
        }
        }

        function displayMovie(movie) {
            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/300x450?text=No+Image';
          
            const movieUrl = `https://www.themoviedb.org/movie/${movie.id}`;
          
       
            fetch('/api/history', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                itemId: movie.id,
                title: movie.title,
                type: 'movie'
              })
            })
              .then(res => {
                if (!res.ok) throw new Error("Failed to save movie history");
                console.log("🎬 Movie saved to history:", movie.title);
              })
              .catch(err => console.error("❌ Movie history error:", err));
          
            card.innerHTML = `
              <a href="${movieUrl}" target="_blank" style="text-decoration: none; color: inherit;">
                <img src="${poster}" alt="${movie.title}">
                <h2>${movie.title}</h2>
                <div class="movie-meta">
                    <span>📅 ${movie.release_date || 'N/A'} | ⭐ ${movie.vote_average || 'N/A'}</span>
                </div>
                <p>${movie.overview ? movie.overview.slice(0, 150) + '...' : 'No description available.'}</p>
              </a>
            `;
          }
          

  
        getRandomMovie();
        setInterval(getRandomMovie, 10000);