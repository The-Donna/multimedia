document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("bookmark-btn")) {
        const button = e.target;
        const bookData = button.getAttribute("data-book");
        const movieData = button.getAttribute("data-movie");

        let payload;

        if (response.ok) {
            button.textContent = "❤️";
            alert("Added to favorites!");
        }


        if (bookData) {
            const book = JSON.parse(bookData);
            payload = {
                itemId: book.id,
                itemType: "book",
                title: book.volumeInfo?.title || "Unknown Title",
                authors: book.volumeInfo?.authors || [],
                thumbnail: book.volumeInfo?.imageLinks?.thumbnail || "",
                description: book.volumeInfo?.description || ""
            };
        } else if (movieData) {
            const movie = JSON.parse(movieData);
            payload = {
                itemId: movie.id,
                itemType: "movie",
                title: movie.title || "Unknown Title",
                poster: movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                    : "",
                overview: movie.overview || ""
            };
        } else {
            console.error("No valid data to favorite.");
            return;
        }

        try {
            const response = await fetch("/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Added to favorites!");
            } else {
                alert("Failed to add to favorites.");
            }
        } catch (err) {
            console.error("Error adding to favorites:", err);
        }
    }
});
