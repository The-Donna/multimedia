/*const API_KEY = 'AIzaSyBrXyc5lfr3wRJR70zr65Kh0tm7fPIU2oM'; 
const bookCard = document.getElementById("book-card");

async function fetchRandomFictionBook() {
    const fictionKeywords = ["fiction", "novel", "fantasy", "science fiction", "mystery", "romance"];
    const randomChar = "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    const startIndex = Math.floor(Math.random() * 40); // Randomize the start index to get random books
  
    const url = `https://www.googleapis.com/books/v1/volumes?q=${randomChar}&startIndex=${startIndex}&maxResults=1&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const book = data.items?.[0];

    if (!book) {
      bookCard.innerHTML = "<p>No book found. Trying again...</p>";
      return;
    }

    const { title, authors, description, imageLinks, infoLink, publishedDate } = book.volumeInfo;

    // Check if the book title, description, or genre contains fiction-related keywords
    const isFiction = fictionKeywords.some(keyword => 
        (title && title.toLowerCase().includes(keyword)) || 
        (description && description.toLowerCase().includes(keyword))
      );
  
      if (!isFiction) {
        // If it's not fiction, retry fetching another book
        return fetchRandomFictionBook();
      }
  

    bookCard.innerHTML = `
    <a href="${infoLink}" target="_blank" style="text-decoration: none; color: inherit; display: block;">
        ${imageLinks?.thumbnail ? `<img src="${imageLinks.thumbnail}" alt="Book cover">` : ""}
        <h2>${title}</h2>
        <p><strong>Author(s):</strong> ${authors?.join(", ") || "N/A"}</p>
        <p><strong>Published:</strong> ${publishedDate || "Unknown"}</p>
        <p>${description ? description.slice(0, 200) + "..." : "No description available."}</p>
    </a>
    `;
  } catch (err) {
    console.error("Error fetching book:", err);
    bookCard.innerHTML = "<p>Something went wrong. Try again later.</p>";
  }
}

// Start on load and refresh every 20 seconds
fetchRandomBook();
setInterval(fetchRandomBook, 20000);
*/


async function getRandomBookByKeyword() {
    const keywords = ["love", "mystery", "science fiction", "history", "cooking", "travel", "philosophy", "art", "music", "adventure"]; // Add more keywords!
    const randomIndex = Math.floor(Math.random() * keywords.length);
    const randomKeyword = keywords[randomIndex];
    const apiKey = 'AIzaSyBrXyc5lfr3wRJR70zr65Kh0tm7fPIU2oM';
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${randomKeyword}&maxResults=1`; // Limiting to 1 result
  
    try {
      const response = await fetch(apiUrl + `&key=${apiKey}`);
      const data = await response.json();
  
      if (data.totalItems > 0 && data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        displayBook(book); // Call the display function
      } else {
        console.log("No books found for the random keyword:", randomKeyword);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  function displayBook(book) {
    const bookDisplay = document.getElementById('book-card');
    if (bookDisplay) {
      bookDisplay.innerHTML = ''; // Clear previous book
  
      const card = document.createElement('div');
      if (book.infoLink) {
        card.onclick = () => window.open(book.infoLink, '_blank');
      }
  
      if (book.imageLinks && book.imageLinks.thumbnail) {
        const imageElement = document.createElement('img');
        imageElement.src = book.imageLinks.thumbnail;
        imageElement.alt = book.title; // Add alt text for accessibility
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
        descriptionElement.textContent = `Description: ${book.description.substring(0, 150)}...`; // Shorten description
        infoContainer.appendChild(descriptionElement);
      }
  
      card.appendChild(infoContainer);
      bookDisplay.appendChild(card);
  
    } else {
      console.log("Element with ID 'book-card' not found in the HTML.");
    }
  }
  
  // Call getRandomBookByKeyword every 20 seconds
  setInterval(getRandomBookByKeyword, 20000);
  
  // Initial call
  getRandomBookByKeyword();



//API for Search Function
async function searchBook() {
  const apiKey = 'AIzaSyBrXyc5lfr3wRJR70zr65Kh0tm7fPIU2oM'; 
  const query = document.getElementById('searchBox').value.trim();
  if (!query) {
      alert("Please enter a book title");
      return;
  }

  // 🔄 Save search to backend
  fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query })
  });

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&_=${Date.now()}`;
  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const books = data.items || [];
      displayResults(books);
      showRandomBook(); // Optional: to refresh display below

  } catch (error) {
      console.error("Error fetching book data:", error);
      document.getElementById('searchresults').innerHTML = `<p style="color:red;">Error fetching book data: ${error.message}</p>`;
  }
}


function displayResults(books) {
    console.log("displayResults called with:", books);
    const resultsDiv = document.getElementById('searchresults');
    if (!resultsDiv) {
        console.error("Error: 'results' div not found!");
        return;
    }
    resultsDiv.innerHTML = '';
    if (!books || books.length === 0) {
        resultsDiv.innerHTML = "<p>No books found.</p>";
        return;
    }
    books.forEach(book => {
        console.log("Processing book:", book);
        const title = book.volumeInfo?.title || "No title available";
        const authors = book.volumeInfo?.authors ? book.volumeInfo?.authors.join(", ") : "Unknown author";
        const thumbnail = book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x200";
        console.log("Title:", title);
        console.log("Authors:", authors);
        console.log("Thumbnail:", thumbnail);
        const bookElement = document.createElement('div');
        bookElement.style.margin = "10px";
        bookElement.style.padding = "10px";
        bookElement.style.border = "1px solid #ccc";
        bookElement.innerHTML = `
            <img src="${thumbnail}" alt="${title}" style="display:block;">
            <h3>${title}</h3>
            <p><strong>Author(s):</strong> ${authors}</p>
        `;
        resultsDiv.appendChild(bookElement);
        console.log("Book element appended.");
    });

    
}

setInterval(() => showRandomBook('next'), 3000);
setInterval(() => showRandomMovie('next'), 3000); 


updateBookDisplay();
updateMovieDisplay();



