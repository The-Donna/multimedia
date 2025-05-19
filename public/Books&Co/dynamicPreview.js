const bookId = new URLSearchParams(window.location.search).get('id');

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
        body: JSON.stringify({ movieId: bookId, username, comment }) // 🔸 Using movieId key!
    });

    loadComments();
}

window.onload = function () {
    loadComments();
    // Load book details here too
};


const iframe = document.getElementById('googleBooksIframe');

function embedSpecificGoogleBook(bookId) {
  const apiKey = 'AIzaSyBrXyc5lfr3wRJR70zr65Kh0tm7fPIU2oM'; 

  if (!bookId) {
    console.warn('No book ID provided in the URL.');
    iframe.src = 'about:blank'; // Or a default message
    return;
  }

  let apiUrl = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(bookId)}`;
  if (apiKey) {
    apiUrl += `?key=${apiKey}`;
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data?.volumeInfo?.previewLink) {
        const previewLink = data.volumeInfo.previewLink.replace('view', 'preview');
        iframe.src = previewLink;
      } else {
        console.warn(`No preview available for book ID: ${bookId}`);
        iframe.src = 'about:blank'; // Or a message indicating no preview
      }
    })
    .catch(error => {
      console.error(`Error fetching book data for ID ${bookId}:`, error);
      iframe.src = 'about:blank'; // Or an error message
    });
}

// Call the function with the book ID when the page loads
window.onload = function() {
  if (bookId) {
    embedSpecificGoogleBook(bookId);
  } else {
    console.log("No book ID found in the URL. Iframe will be blank.");
    iframe.src = 'about:blank'; // Or a default state for book.html loaded directly
  }
};
