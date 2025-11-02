/**
 * My Library - BookVault
 * Manage user's saved/favorite books
 */

// Get library from localStorage
function getLibrary() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const libraryStr = localStorage.getItem(`bookVaultLibrary_${user.id}`);
    return libraryStr ? JSON.parse(libraryStr) : [];
}

// Save library to localStorage
function saveLibrary(books) {
    const user = getCurrentUser();
    if (!user) return;
    
    localStorage.setItem(`bookVaultLibrary_${user.id}`, JSON.stringify(books));
}

// Add book to library
function addToLibrary(book) {
    console.log('addToLibrary called with book:', book);
    const user = getCurrentUser();
    console.log('Current user:', user);
    
    if (!user) {
        const msg = (window.__i18n ? window.__i18n.t('auth.pleaseLoginToSave') : 'Please login to save books to your library');
        alert(msg);
        console.warn('Add to library failed: User not logged in');
        return false;
    }
    
    const library = getLibrary();
    
    // Check if already exists
    if (library.some(b => b.id === book.id)) {
        console.log('Book already in library');
        return false; // Already in library
    }
    
    library.push({
        ...book,
        addedAt: new Date().toISOString()
    });
    
    saveLibrary(library);
    console.log('Book added to library successfully');
    return true;
}

// Remove book from library
function removeFromLibrary(bookId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const library = getLibrary();
    const filtered = library.filter(b => b.id !== bookId);
    saveLibrary(filtered);
    return true;
}

// Check if book is in library
function isInLibrary(bookId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const library = getLibrary();
    return library.some(b => b.id === bookId);
}

// Display library
function displayLibrary() {
    const library = getLibrary();
    const libraryContainer = document.getElementById('libraryContainer');
    const emptyLibrary = document.getElementById('emptyLibrary');
    
    if (!libraryContainer) return;
    
    libraryContainer.innerHTML = '';
    
    if (library.length === 0) {
        if (emptyLibrary) emptyLibrary.style.display = 'block';
        return;
    }
    
    if (emptyLibrary) emptyLibrary.style.display = 'none';
    
    const fragment = document.createDocumentFragment();
    
    library.forEach((book, index) => {
        const bookCard = createLibraryBookCard(book);
        bookCard.style.opacity = '0';
        fragment.appendChild(bookCard);
        
        setTimeout(() => {
            bookCard.style.transition = 'opacity 0.3s ease';
            bookCard.style.opacity = '1';
        }, index * 50);
    });
    
    libraryContainer.appendChild(fragment);
}

// Create library book card
function createLibraryBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card library-book-card';
    card.dataset.bookId = book.id;
    
    // Cover
    const coverImg = document.createElement('img');
    coverImg.className = 'book-cover';
    
    const thumbnailUrl = getThumbnailUrl(book.thumbnail);
    if (thumbnailUrl && isValidUrl(thumbnailUrl)) {
        coverImg.src = thumbnailUrl;
        coverImg.alt = book.title;
        coverImg.loading = 'lazy';
        coverImg.onerror = function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'book-cover';
            placeholder.textContent = createPlaceholderCover(book.title);
            card.replaceChild(placeholder, this);
        };
    } else {
        coverImg.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'book-cover';
        placeholder.textContent = createPlaceholderCover(book.title);
        card.appendChild(placeholder);
    }
    
    if (coverImg.style.display !== 'none') {
        card.appendChild(coverImg);
    }
    
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
    
    // Metadata container (rating + downloads)
    const metadataDiv = document.createElement('div');
    metadataDiv.className = 'book-metadata';
    
    // Rating out of 5 (if available)
    if (book.rating) {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'book-rating';
        ratingDiv.innerHTML = formatRating(book.rating);
        const ratingText = document.createElement('span');
        ratingText.className = 'rating-text';
        ratingText.textContent = ` ${book.rating}/5`;
        ratingDiv.appendChild(ratingText);
        metadataDiv.appendChild(ratingDiv);
    }
    
    // Reader count (use ratingCount as proxy for popularity)
    if (book.ratingCount) {
        const readersDiv = document.createElement('div');
        readersDiv.className = 'book-downloads';
        readersDiv.innerHTML = `<span class="download-icon">👥</span> <span class="download-count">${book.ratingCount.toLocaleString()} readers</span>`;
        metadataDiv.appendChild(readersDiv);
    }
    
    if (metadataDiv.children.length > 0) {
        infoDiv.appendChild(metadataDiv);
    }
    
    // Summary/Description
    const descElement = document.createElement('p');
    descElement.className = 'book-description';
    const description = book.description || book.summary || `Explore this ${book.categories?.[0] || 'interesting'} book by ${formatAuthors(book.authors)}.`;
    descElement.textContent = formatDescription(description);
    infoDiv.appendChild(descElement);
    
    // Action buttons container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'book-actions';
    
    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'library-remove-btn';
    removeBtn.innerHTML = `🗑️ ${(window.__i18n ? window.__i18n.t('library.remove') : 'Remove')}`;
    removeBtn.onclick = () => {
        const q = (window.__i18n ? window.__i18n.t('library.confirmRemove') : 'Remove this book from your library?');
        if (confirm(q)) {
            removeFromLibrary(book.id);
            displayLibrary();
        }
    };
    actionsDiv.appendChild(removeBtn);
    
    // View button
    const viewBtn = document.createElement('button');
    viewBtn.className = 'book-link';
    viewBtn.textContent = (window.__i18n ? window.__i18n.t('book.viewDetails') : 'View Details');
    viewBtn.onclick = () => showBookDetails(book);
    actionsDiv.appendChild(viewBtn);
    
    infoDiv.appendChild(actionsDiv);
    card.appendChild(infoDiv);
    return card;
}


