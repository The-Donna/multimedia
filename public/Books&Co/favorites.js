const bookmarkBtn = movieDiv.querySelector('.bookmark-btn');
bookmarkBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // prevent default link behavior if inside <a>

    const movieData = JSON.parse(event.currentTarget.getAttribute('data-movie'));

    try {
        const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                movieId: movieData.id,
                title: movieData.title,
                poster_path: movieData.poster_path,
                overview: movieData.overview,
                release_date: movieData.release_date,
            }),
        });

        if (response.ok) {
            alert('Movie added to favorites!');
        } else {
            alert('Failed to add movie.');
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
        alert('An error occurred.');
    }
});
