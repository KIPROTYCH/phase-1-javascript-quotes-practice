document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');

    // Fetch quotes from the API
    const fetchQuotes = () => {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(quotes => renderQuotes(quotes))
            .catch(error => console.error('Error fetching quotes:', error));
    };

    // Render quotes on the page
    const renderQuotes = (quotes) => {
        quoteList.innerHTML = '';
        quotes.forEach(quote => {
            const li = document.createElement('li');
            li.classList.add('quote-card');
            li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      `;
            const deleteButton = li.querySelector('.btn-danger');
            deleteButton.addEventListener('click', () => deleteQuote(quote.id));
            const likeButton = li.querySelector('.btn-success');
            likeButton.addEventListener('click', () => addLike(quote.id));
            quoteList.appendChild(li);
        });
    };

    // Add a new quote
    newQuoteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const quoteInput = document.getElementById('new-quote');
        const authorInput = document.getElementById('author');
        const quote = quoteInput.value;
        const author = authorInput.value;
        if (quote && author) {
            const newQuote = { quote, author };
            fetch('http://localhost:3000/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuote),
            })
                .then(response => response.json())
                .then(() => {
                    quoteInput.value = '';
                    authorInput.value = '';
                    fetchQuotes();
                })
                .catch(error => console.error('Error adding quote:', error));
        }
    });

    // Delete a quote
    const deleteQuote = (quoteId) => {
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: 'DELETE',
        })
            .then(() => fetchQuotes())
            .catch(error => console.error('Error deleting quote:', error));
    };

    // Add a like to a quote
    const addLike = (quoteId) => {
        const newLike = { quoteId };
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLike),
        })
            .then(() => fetchQuotes())
            .catch(error => console.error('Error adding like:', error));
    };

    // Initial fetch and render
    fetchQuotes();
});
