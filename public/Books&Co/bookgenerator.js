async function getRandomBookByKeyword() {
  const keywords = ["love", "mystery", "science fiction", "history", "cooking", "travel", "philosophy", "art", "music", "adventure"];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  const apiKey = 'AIzaSyBrXyc5lfr3wRJR70zr65Kh0tm7fPIU2oM';
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${randomKeyword}&maxResults=1&key=${apiKey}`;

  const bookDisplay = document.getElementById('book-card');
  if (bookDisplay) bookDisplay.innerHTML = "Loading book...";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Fetched data:", data);

    if (Array.isArray(data.items) && data.items.length > 0) {
      const book = data.items[0].volumeInfo;
      const raw = data.items[0];
      console.log("📚 Book found:", book.title);
      displayBook(book, raw);
    } else {
      console.warn("⚠️ No books found for keyword:", randomKeyword);
      if (bookDisplay) {
        bookDisplay.innerHTML = `<p style="color: red;">No book found for keyword "${randomKeyword}". Trying again soon...</p>`;
      }
    }
  } catch (error) {
    console.error("❌ Error fetching book:", error);
    if (bookDisplay) {
      bookDisplay.innerHTML = `<p style="color: red;">Error fetching book: ${error.message}</p>`;
    }
  }
}

function displayBook(book, rawData) {
  const bookDisplay = document.getElementById('book-card');
  if (!bookDisplay) return;

  const itemId = rawData.id || book.infoLink || book.title;

  // Save to history
  fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      itemId,
      title: book.title,
      type: 'book'
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save history");
      console.log("📚 Book added to history:", book.title);
    })
    .catch(err => console.error("❌ Error saving book to history:", err));

  bookDisplay.innerHTML = ''; // clear previous

  const card = document.createElement('div');
  if (book.infoLink) card.onclick = () => window.open(book.infoLink, '_blank');

  if (book.imageLinks?.thumbnail) {
    const imageElement = document.createElement('img');
    imageElement.src = book.imageLinks.thumbnail;
    imageElement.alt = book.title;
    card.appendChild(imageElement);
  }

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('book-info');

  const titleElement = document.createElement('h2');
  titleElement.textContent = book.title;
  infoContainer.appendChild(titleElement);

  if (book.authors) {
    const authorElement = document.createElement('p');
    authorElement.textContent = `Author(s): ${book.authors.join(', ')}`;
    infoContainer.appendChild(authorElement);
  }

  if (book.description) {
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Description: ${book.description.substring(0, 150)}...`;
    infoContainer.appendChild(descriptionElement);
  }

  card.appendChild(infoContainer);
  bookDisplay.appendChild(card);
}

getRandomBookByKeyword();
setInterval(getRandomBookByKeyword, 20000);
