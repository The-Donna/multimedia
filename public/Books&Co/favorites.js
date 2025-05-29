document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (event) => {
        const favoriteButton = event.target.closest('.favorite-button');
        if (!favoriteButton) return;

        const icon = favoriteButton.querySelector('i');
        const isFavorited = icon.classList.contains('fa-heart');

        const type = favoriteButton.dataset.type;
        const id = favoriteButton.dataset.id;
        const title = decodeURIComponent(favoriteButton.dataset.title);

        let payload = { title };
        if (type === 'book') {
            payload.bookId = id;
            payload.thumbnail = decodeURIComponent(favoriteButton.dataset.thumbnail);
            payload.description = decodeURIComponent(favoriteButton.dataset.description);
        } else if (type === 'movie') {
            payload.movieId = parseInt(id); 
            payload.poster_path = decodeURIComponent(favoriteButton.dataset.poster_path);
            payload.overview = decodeURIComponent(favoriteButton.dataset.overview);
            payload.release_date = decodeURIComponent(favoriteButton.dataset.release_date);
        }

        try {
            if (isFavorited) {
                const response = await fetch(`/api/favorites/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                icon.classList.remove('fa-solid', 'fa-heart');
                icon.classList.add('far', 'fa-star');
                console.log(`${title} unfavorited.`);
            } else {
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                icon.classList.remove('far', 'fa-star');
                icon.classList.add('fa-solid', 'fa-heart');
                console.log(`${title} favorited!`);
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
            if (isFavorited) {
                icon.classList.remove('fa-solid', 'fa-heart');
                icon.classList.add('far', 'fa-star');
            } else {
                icon.classList.remove('far', 'fa-star');
                icon.classList.add('fa-solid', 'fa-heart');
            }
            alert('Failed to update favorite status. Please try again later.');
        }
    });
});