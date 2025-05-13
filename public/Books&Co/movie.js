const API_KEY = 'removed';
const BACKEND_URL = 'http://localhost:3000';

const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

document.addEventListener('DOMContentLoaded', () => {
  loadMovieDetails();
  loadComments();
});

async function loadMovieDetails() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await res.json();

   
    addToHistory({
      title: movie.title,
      type: "movie",
      id: movie.id
    });

    const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
    const videoData = await videoRes.json();
    const trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    const container = document.getElementById('movie-container');
    container.innerHTML = `
      <h2>${movie.title}</h2>
      ${trailer ? `
        <div class="trailer">
          <iframe width="640" height="360"
            src="https://www.youtube.com/embed/${trailer.key}"
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>` : '<p>No trailer available.</p>'
      }
      <p><strong>Release Date:</strong> ${movie.release_date}</p>
      <p>${movie.overview}</p>
    `;
  } catch (err) {
    console.error('Failed to load movie details:', err);
  }
}

async function loadComments() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/comments/${movieId}`);
    const comments = await res.json();

    const commentsDiv = document.getElementById('comments-list');
    commentsDiv.innerHTML = '';

    comments.forEach(c => {
      const el = document.createElement('div');
      el.classList.add('comment');
      el.innerHTML = `
        <strong>${c.username}</strong><br>
        ${c.comment}<br>
        <small>${new Date(c.timestamp).toLocaleString()}</small>
      `;
      commentsDiv.appendChild(el);
    });
  } catch (err) {
    console.error('Failed to load comments:', err);
  }
}

async function submitComment() {
  const username = document.getElementById('username').value.trim();
  const comment = document.getElementById('comment').value.trim();

  if (!username || !comment) {
    alert('Please fill out both fields.');
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, username, comment })
    });

    if (res.ok) {
      document.getElementById('username').value = '';
      document.getElementById('comment').value = '';
      loadComments();
    } else {
      const error = await res.json();
      alert('Failed to post comment: ' + (error.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Error posting comment:', err);
    alert('Failed to post comment due to network error.');
  }
}


fetch('/api/history')
  .then(res => res.json())
  .then(history => {
    const container = document.getElementById('historyContainer');
    history.forEach(item => {
      const el = document.createElement('div');
      el.innerText = `${item.title} (${item.type})`;
      container.appendChild(el);
    });
  });


function addToHistory(item) {
  fetch('/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: item.title,
      type: item.type,
      itemId: item.id
    })
  }).catch(err => {
    console.error("Failed to save history:", err);
  });
}
