/**
 * Free Books - BookVault
 * Fetch and display free books from multiple sources
 * Sources: Project Gutenberg, Open Library, Standard Ebooks
 */

// Cache for free books
let freeBooksCache = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get popular free books from Project Gutenberg (via Gutendex)
 */
async function fetchGutenbergBooks(limit = 35) {
    try {
        // Fetch most popular books from Gutenberg
        const response = await fetch(`https://gutendex.com/books/?languages=en&limit=${limit}&sort=popular`);
        if (!response.ok) throw new Error('Gutendex API error');
        
        const data = await response.json();
        if (!data.results || data.results.length === 0) return [];
        
        return data.results.map(book => {
            const author = book.authors && book.authors.length > 0 
                ? book.authors.map(a => a.name).join(', ')
                : 'Unknown Author';
            
            let description = '';
            if (book.subjects && book.subjects.length > 0) {
                description = `A classic book covering topics such as ${book.subjects.slice(0, 3).join(', ')}.`;
            } else if (book.authors?.[0]?.name) {
                description = `A timeless work by ${book.authors[0].name}.`;
            } else {
                description = 'A classic literary work available for free reading.';
            }
            
            // Get readable format - prefer HTML, fallback to plain text
            let readLink = book.formats?.['text/html'] || 
                          book.formats?.['text/html; charset=utf-8'] ||
                          book.formats?.['text/plain; charset=utf-8'] ||
                          book.formats?.['text/plain'] ||
                          `https://www.gutenberg.org/ebooks/${book.id}`;
            
            return {
                id: `gutenberg-${book.id}`,
                title: book.title || 'Untitled',
                authors: [author],
                description: description,
                thumbnail: book.formats?.['image/jpeg'] || '',
                rating: null,
                ratingCount: book.download_count || 0,
                publishedDate: book.published?.toString() || '',
                pageCount: 0,
                categories: book.subjects || [],
                language: book.languages?.[0] || 'en',
                previewLink: readLink,
                infoLink: `https://www.gutenberg.org/ebooks/${book.id}`,
                source: 'Project Gutenberg',
                downloadCount: book.download_count || 0,
                isReadable: true
            };
        });
    } catch (error) {
        console.error('Error fetching Gutenberg books:', error);
        return [];
    }
}

/**
 * Get free books from Open Library
 */
async function fetchOpenLibraryFreeBooks(limit = 35) {
    try {
        // Search for books with "ebook" access
        const response = await fetch(`https://openlibrary.org/search.json?q=ebook&has_fulltext=true&limit=${limit}&sort=downloads desc`);
        if (!response.ok) throw new Error('Open Library API error');
        
        const data = await response.json();
        if (!data.docs || data.docs.length === 0) return [];
        
        const books = [];
        for (const doc of data.docs.slice(0, limit)) {
            try {
                // Get book details to check if it's readable
                const workKey = doc.key;
                const workResponse = await fetch(`https://openlibrary.org${workKey}.json`);
                if (!workResponse.ok) continue;
                
                const workData = await workResponse.json();
                
                // Check if book has readable format
                let readLink = null;
                if (workData.ia && workData.ia.length > 0) {
                    // Internet Archive identifier
                    const iaId = workData.ia[0];
                    readLink = `https://archive.org/details/${iaId}`;
                } else if (doc.ia && doc.ia.length > 0) {
                    readLink = `https://archive.org/details/${doc.ia[0]}`;
                } else {
                    readLink = `https://openlibrary.org${workKey}`;
                }
                
                const coverId = doc.cover_i;
                let thumbnail = '';
                if (coverId) {
                    thumbnail = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
                }
                
                let description = doc.first_sentence?.[0] || '';
                if (!description) {
                    const parts = [];
                    if (doc.subject?.[0]) parts.push(`Genre: ${doc.subject[0]}`);
                    if (doc.first_publish_year) parts.push(`First published: ${doc.first_publish_year}`);
                    description = parts.length > 0 ? parts.join('. ') + '.' : `An interesting book available for free reading.`;
                }
                
                books.push({
                    id: doc.key || `openlib-${Date.now()}-${Math.random()}`,
                    title: doc.title || 'Untitled',
                    authors: doc.author_name || ['Unknown Author'],
                    description: description,
                    thumbnail: thumbnail,
                    rating: null,
                    ratingCount: 0,
                    publishedDate: doc.first_publish_year?.toString() || '',
                    pageCount: doc.number_of_pages_median || 0,
                    categories: doc.subject || [],
                    language: doc.language?.[0] || 'en',
                    previewLink: readLink,
                    infoLink: `https://openlibrary.org${workKey}`,
                    source: 'Open Library',
                    isReadable: true
                });
            } catch (err) {
                // Skip this book if there's an error
                continue;
            }
        }
        
        return books;
    } catch (error) {
        console.error('Error fetching Open Library books:', error);
        return [];
    }
}

/**
 * Get more books from Project Gutenberg (for variety)
 * This acts as a supplement to reach 100 books
 */
async function fetchMoreGutenbergBooks(limit = 30) {
    try {
        // Fetch different popular books with offset
        const response = await fetch(`https://gutendex.com/books/?languages=en&limit=${limit}&sort=popular&offset=35`);
        if (!response.ok) throw new Error('Gutendex API error');
        
        const data = await response.json();
        if (!data.results || data.results.length === 0) return [];
        
        return data.results.map(book => {
            const author = book.authors && book.authors.length > 0 
                ? book.authors.map(a => a.name).join(', ')
                : 'Unknown Author';
            
            let description = '';
            if (book.subjects && book.subjects.length > 0) {
                description = `A classic book covering topics such as ${book.subjects.slice(0, 3).join(', ')}.`;
            } else if (book.authors?.[0]?.name) {
                description = `A timeless work by ${book.authors[0].name}.`;
            } else {
                description = 'A classic literary work available for free reading.';
            }
            
            // Get readable format
            let readLink = book.formats?.['text/html'] || 
                          book.formats?.['text/html; charset=utf-8'] ||
                          book.formats?.['text/plain; charset=utf-8'] ||
                          book.formats?.['text/plain'] ||
                          `https://www.gutenberg.org/ebooks/${book.id}`;
            
            return {
                id: `gutenberg-${book.id}`,
                title: book.title || 'Untitled',
                authors: [author],
                description: description,
                thumbnail: book.formats?.['image/jpeg'] || '',
                rating: null,
                ratingCount: book.download_count || 0,
                publishedDate: book.published?.toString() || '',
                pageCount: 0,
                categories: book.subjects || [],
                language: book.languages?.[0] || 'en',
                previewLink: readLink,
                infoLink: `https://www.gutenberg.org/ebooks/${book.id}`,
                source: 'Project Gutenberg',
                downloadCount: book.download_count || 0,
                isReadable: true
            };
        });
    } catch (error) {
        console.error('Error fetching more Gutenberg books:', error);
        return [];
    }
}

/**
 * Fetch all free books from all sources
 */
async function fetchAllFreeBooks() {
    // Check cache first
    if (freeBooksCache && Date.now() - freeBooksCache.timestamp < CACHE_DURATION) {
        return freeBooksCache.books;
    }
    
    try {
        // Fetch from all sources in parallel
        const [gutenbergBooks, openLibBooks, moreGutenbergBooks] = await Promise.all([
            fetchGutenbergBooks(35),
            fetchOpenLibraryFreeBooks(35),
            fetchMoreGutenbergBooks(30)
        ]);
        
        // Combine all books
        let allBooks = [...gutenbergBooks, ...openLibBooks, ...moreGutenbergBooks];
        
        // Remove duplicates based on title and author
        const uniqueBooks = [];
        const seen = new Set();
        
        for (const book of allBooks) {
            const key = `${book.title.toLowerCase().trim()}|${book.authors[0]?.toLowerCase().trim() || ''}`;
            if (!seen.has(key) && book.isReadable) {
                seen.add(key);
                uniqueBooks.push(book);
            }
        }
        
        // Limit to 100 books
        const limitedBooks = uniqueBooks.slice(0, 100);
        
        // Cache the results
        freeBooksCache = {
            books: limitedBooks,
            timestamp: Date.now()
        };
        
        return limitedBooks;
    } catch (error) {
        console.error('Error fetching all free books:', error);
        return [];
    }
}

/**
 * Display free books
 */
async function displayFreeBooks(sourceFilter = 'all') {
    const container = document.getElementById('freebooksContainer');
    const loading = document.getElementById('freebooksLoading');
    const empty = document.getElementById('emptyFreebooks');
    
    if (!container) return;
    
    // Show loading
    container.innerHTML = '';
    if (loading) loading.style.display = 'block';
    if (empty) empty.style.display = 'none';
    
    try {
        const allBooks = await fetchAllFreeBooks();
        
        // Filter by source if needed
        let filteredBooks = allBooks;
        if (sourceFilter !== 'all') {
            const sourceMap = {
                'gutenberg': 'Project Gutenberg',
                'openlibrary': 'Open Library'
            };
            filteredBooks = allBooks.filter(book => book.source === sourceMap[sourceFilter]);
        }
        
        // Hide loading
        if (loading) loading.style.display = 'none';
        
        if (filteredBooks.length === 0) {
            if (empty) empty.style.display = 'block';
            return;
        }
        
        if (empty) empty.style.display = 'none';
        
        // Display books
        const fragment = document.createDocumentFragment();
        
        filteredBooks.forEach((book, index) => {
            const bookCard = createFreeBookCard(book);
            bookCard.style.opacity = '0';
            fragment.appendChild(bookCard);
            
            // Animate in
            setTimeout(() => {
                bookCard.style.transition = 'opacity 0.3s ease';
                bookCard.style.opacity = '1';
            }, index * 30);
        });
        
        container.appendChild(fragment);
    } catch (error) {
        console.error('Error displaying free books:', error);
        if (loading) loading.style.display = 'none';
        if (empty) empty.style.display = 'block';
    }
}

/**
 * Create a free book card
 */
function createFreeBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card free-book-card';
    card.dataset.bookId = book.id;
    
    // Favorite toggle (top-right)
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-toggle';
    const isFav = (window.favorites && window.favorites.isFavorite) ? window.favorites.isFavorite(book.id) : false;
    favBtn.innerHTML = isFav ? '❤️' : '🤍';
    favBtn.onclick = (e) => {
        e.stopPropagation();
        if (window.favorites && window.favorites.toggleFavorite) {
            const nowFav = window.favorites.toggleFavorite(book);
            favBtn.innerHTML = nowFav ? '❤️' : '🤍';
        }
    };
    card.appendChild(favBtn);
    
    // Cover image
    const coverContainer = document.createElement('div');
    coverContainer.className = 'book-cover';
    
    const thumbnailUrl = getThumbnailUrl(book.thumbnail);
    if (thumbnailUrl && isValidUrl(thumbnailUrl)) {
        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = book.title;
        img.loading = 'lazy';
        img.onerror = function() {
            this.style.display = 'none';
            coverContainer.textContent = createPlaceholderCover(book.title);
        };
        coverContainer.appendChild(img);
    } else {
        coverContainer.textContent = createPlaceholderCover(book.title);
    }
    
    card.appendChild(coverContainer);
    
    // Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'book-info';
    
    // Title
    const titleElement = document.createElement('h3');
    titleElement.className = 'book-title';
    titleElement.textContent = sanitizeHTML(book.title);
    infoDiv.appendChild(titleElement);
    
    // Author
    const authorElement = document.createElement('p');
    authorElement.className = 'book-author';
    authorElement.textContent = formatAuthors(book.authors);
    infoDiv.appendChild(authorElement);
    
    // Source badge
    const sourceBadge = document.createElement('div');
    sourceBadge.className = 'book-source-badge';
    sourceBadge.textContent = book.source;
    infoDiv.appendChild(sourceBadge);
    
    // Description
    const descElement = document.createElement('p');
    descElement.className = 'book-description';
    descElement.textContent = formatDescription(book.description || 'Available for free reading.');
    infoDiv.appendChild(descElement);
    
    // Action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'book-actions';
    
    // Read Now button (primary action)
    const readBtn = document.createElement('button');
    readBtn.className = 'book-link read-now-btn';
    readBtn.textContent = '📖 Read Now';
    readBtn.onclick = (e) => {
        e.stopPropagation();
        if (book.previewLink) {
            window.open(book.previewLink, '_blank', 'noopener,noreferrer');
        }
    };
    actionsDiv.appendChild(readBtn);
    
    // Add to Library button (if logged in)
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        const libraryBtn = document.createElement('button');
        libraryBtn.className = `library-add-btn ${isInLibrary(book.id) ? 'in-library' : ''}`;
        libraryBtn.innerHTML = isInLibrary(book.id) ? '✓ In Library' : '❤️ Add to Library';
        libraryBtn.onclick = (e) => {
            e.stopPropagation();
            toggleLibraryBook(book);
            libraryBtn.classList.toggle('in-library');
            libraryBtn.innerHTML = isInLibrary(book.id) ? '✓ In Library' : '❤️ Add to Library';
        };
        actionsDiv.appendChild(libraryBtn);
    }
    
    // View Details button
    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'book-link';
    detailsBtn.textContent = 'View Details';
    detailsBtn.onclick = (e) => {
        e.stopPropagation();
        if (typeof showBookDetails === 'function') {
            showBookDetails(book);
        }
    };
    actionsDiv.appendChild(detailsBtn);
    
    infoDiv.appendChild(actionsDiv);
    card.appendChild(infoDiv);
    
    // Make card clickable to read
    card.style.cursor = 'pointer';
    card.onclick = () => {
        if (book.previewLink) {
            window.open(book.previewLink, '_blank', 'noopener,noreferrer');
        }
    };
    
    return card;
}

/**
 * Initialize free books page
 */
function initializeFreeBooks() {
    // Initialize filter buttons
    const filterButtons = document.querySelectorAll('.freebooks-filters .filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter books
            const source = btn.getAttribute('data-source');
            displayFreeBooks(source);
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFreeBooks);
} else {
    initializeFreeBooks();
}

// Make functions available globally
window.freebooks = {
    displayFreeBooks,
    fetchAllFreeBooks
};

