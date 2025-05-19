async function getRandomBookByKeyword() {
  const keywords = ["love", "mystery", "science fiction", "history", "cooking", "travel", "philosophy", "art", "music", "adventure"];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  const apiKey = 'AIzaSyBrXyc5lfr3wRJR70zr65Kh0tm7fPIU2oM';
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${randomKeyword}&maxResults=1&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.totalItems > 0 && data.items && data.items.length > 0) {
      const book = data.items[0].volumeInfo;
      const raw = data.items[0];
      displayBook(book, raw); // pass both
    } else {
      console.log("No books found for keyword:", randomKeyword);
    }
  } catch (error) {
    console.error("Error fetching book:", error);
  }
}

function displayBook(book, rawData) {
  const bookDisplay = document.getElementById('book-card');
  if (!bookDisplay) return;

  bookDisplay.innerHTML = ''; // clear previous
  const card = document.createElement('div');
  if (book.infoLink) card.onclick = () => window.open(book.infoLink, '_blank');

  const itemId = rawData.id || book.infoLink || book.title;

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

  // ✅ Save to history
  fetch('/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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
}

async function searchBook() {
  const apiKey = 'AIzaSyBrXyc5lfr3wRJR70zr65Kh0tm7fPIU2oM'; 
  const query = document.getElementById('searchBox').value.trim();
  if (!query) return alert("Please enter a book title");

  fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query })
  });

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    displayResults(data.items || []);
  } catch (error) {
    console.error("Error fetching search:", error);
    document.getElementById('searchresults').innerHTML = `<p style="color:red;">Error fetching books: ${error.message}</p>`;
  }
}

function displayResults(books) {
  const resultsDiv = document.getElementById('searchresults');
  if (!resultsDiv) return console.error("Error: 'searchresults' not found");

  resultsDiv.innerHTML = '';
  if (!books.length) return resultsDiv.innerHTML = "<p>No books found.</p>";

  books.forEach(book => {
    const info = book.volumeInfo;
    const title = info?.title || "No title";
    const authors = info?.authors?.join(", ") || "Unknown";
    const thumbnail = info?.imageLinks?.thumbnail || "https://via.placeholder.com/128x200";
    const bookElement = document.createElement('div');

    bookElement.style = "margin: 10px; padding: 10px; border: 1px solid #ccc; cursor: pointer;";
    bookElement.innerHTML = `
      <img src="${thumbnail}" alt="${title}">
      <h3>${title}</h3>
      <p><strong>Author(s):</strong> ${authors}</p>
    `;

    bookElement.onclick = () => {
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          itemId: book.id || title,
          title,
          type: 'book'
        })
      }).then(res => res.ok ? console.log(`🔍 Saved: ${title}`) : console.error("Save failed"))
        .catch(console.error);

      window.open(info.infoLink, '_blank');
    };

    resultsDiv.appendChild(bookElement);
  });
}


getRandomBookByKeyword();
setInterval(getRandomBookByKeyword, 20000);
