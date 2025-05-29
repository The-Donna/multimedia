const itemId = new URLSearchParams(window.location.search).get('id');
google.books.load(); 

function initializeGoogleBookViewer() {
    if (!itemId) {
        console.warn("No book ID found in URL for Google Books Viewer.");
        document.getElementById('samplePages').innerHTML = '<p>No book selected for preview.</p>';
        return;
    }

    const viewerContainer = document.getElementById('samplePages');
    if (!viewerContainer) {
        console.error("Viewer container #samplePages not found.");
        return;
    }

    fetch(`https://www.googleapis.com/books/v1/volumes/${itemId}`)
        .then(res => res.json())
        .then(data => {
            const title = data.volumeInfo.title || 'No Title Available';
            const overview = data.volumeInfo.description || 'No description available.';

            document.getElementById('bookTitle').innerHTML = title;
            document.getElementById('bookOverview').innerHTML = overview;
        })
        .catch(err => {
            console.error('Failed to fetch book details:', err);
            document.getElementById('bookTitle').textContent = 'Book details unavailable';
        });

    const viewer = new google.books.DefaultViewer(viewerContainer);
    viewer.load(itemId, function(statusCode) {
        if (statusCode === 200 || statusCode === google.books.Viewer.StatusCode.SUCCESS) {
            console.log('Google Books Viewer loaded successfully for ID:', itemId);
        } else {
            console.error('Error loading Google Books Viewer. Status:', statusCode);
            viewerContainer.innerHTML = `<p style="color:red;">Failed to load book preview (Error Code: ${statusCode}). This book might not have sample pages available, or there's a policy restriction.</p>`;
        }
    });
}

// Set a callback to run when the Google Books API is fully loaded
google.books.setOnLoadCallback(initializeGoogleBookViewer);

async function loadComments() {
    const response = await fetch(`/api/comments/${movieId}`);
    const comments = await response.json();
    const container = document.getElementById('comments');
    container.innerHTML = comments.map(c => `<p><strong>${c.username}</strong>: ${c.comment}</p>`).join('');
}

async function submitComment() {
  const username = document.getElementById('user').value; 
  const comment = document.getElementById('commentText').value;

  await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId: bookId, username, comment }) 
  });

  loadComments();
}

document.addEventListener('DOMContentLoaded', function() {
  loadComments();
});