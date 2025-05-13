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

const previewLink = bookData.volumeInfo.previewLink;
document.getElementById('samplePages').innerHTML = `
    <iframe src="${previewLink}&output=embed" width="100%" height="500px" allowfullscreen></iframe>
`;

const viewability = bookData.accessInfo.viewability;
if (viewability !== "NO_PAGES") {
    document.getElementById('samplePages').innerHTML = `
        <iframe src="${bookData.volumeInfo.previewLink}&output=embed" width="100%" height="500px"></iframe>
    `;
} else {
    document.getElementById('samplePages').innerHTML = "<p>Preview not available for this book.</p>";
}

const movieId = new URLSearchParams(window.location.search).get('id');

    google.books.load();

    google.books.setOnLoadCallback(() => {
      const viewer = new google.books.DefaultViewer(document.getElementById('samplePages'));
      viewer.load(movieId); 
    });


