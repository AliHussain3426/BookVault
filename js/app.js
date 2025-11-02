// 15 default preview books (lightweight data) to show instantly
const DEFAULT_TOP_BOOKS = [
  { id: 'd1', title: 'The Classic Tome', authors: ['A. Writer'], thumbnail: '', genre: 'fiction', description: 'A timeless story that explores the depths of human emotion and the power of storytelling.' },
  { id: 'd2', title: 'Beneath Old Oaks', authors: ['E. Greene'], thumbnail: '', genre: 'fiction', description: 'A heartwarming tale of family, tradition, and the secrets that bind us together across generations.' },
  { id: 'd3', title: 'Whispers of Pages', authors: ['L. Porter'], thumbnail: '', genre: 'fiction', description: 'An enchanting journey through the world of books, where every page reveals a new adventure.' },
  { id: 'd4', title: 'Guild of Stars', authors: ['M. Hewitt'], thumbnail: '', genre: 'fantasy', description: 'A magical quest across celestial realms where ancient guilds hold the fate of the universe.' },
  { id: 'd5', title: 'Ember & Ash', authors: ['K. Rowan'], thumbnail: '', genre: 'fantasy', description: 'In a world where fire and shadow collide, one warrior must rise to restore the balance.' },
  { id: 'd6', title: 'Crown of Thorns', authors: ['S. Vale'], thumbnail: '', genre: 'fantasy', description: 'A dark fantasy epic about power, betrayal, and the price of wearing a cursed crown.' },
  { id: 'd7', title: 'Clockwork Ciphers', authors: ['I. Black'], thumbnail: '', genre: 'mystery', description: 'A Victorian detective unravels cryptic codes in a steampunk London filled with intrigue.' },
  { id: 'd8', title: 'The Lost Ledger', authors: ['R. Finch'], thumbnail: '', genre: 'mystery', description: 'A financial thriller where hidden accounts reveal a conspiracy spanning decades.' },
  { id: 'd9', title: 'Ink & Alibi', authors: ['P. Doyle'], thumbnail: '', genre: 'mystery', description: 'A mystery novelist becomes the prime suspect when her fictional murders come to life.' },
  { id: 'd10', title: 'Letters Never Sent', authors: ['E. Hart'], thumbnail: '', genre: 'romance', description: 'Unsent letters from the past bring two strangers together in an unexpected love story.' },
  { id: 'd11', title: 'Autumn Serenade', authors: ['C. Wren'], thumbnail: '', genre: 'romance', description: 'A musician and a painter find love in a small town painted with autumn colors.' },
  { id: 'd12', title: 'Lanterns at Dusk', authors: ['J. Hale'], thumbnail: '', genre: 'romance', description: 'Under festival lanterns, two souls reconnect after years apart to rekindle their flame.' },
  { id: 'd13', title: 'Orbit of Echoes', authors: ['T. Quill'], thumbnail: '', genre: 'science fiction', description: 'A space odyssey exploring time loops and the echoes of choices across parallel universes.' },
  { id: 'd14', title: 'Brass Nebula', authors: ['N. Rivers'], thumbnail: '', genre: 'science fiction', description: 'Steampunk meets space opera in this tale of rebels fighting a mechanical empire.' },
  { id: 'd15', title: 'Pilgrim to Andromeda', authors: ['V. Cross'], thumbnail: '', genre: 'science fiction', description: 'A lone traveler embarks on a journey to humanity\'s new home among the stars.' }
];
/**
 * Main Application Logic for BookVault
 * Handles UI interactions, search, and book display
 */

// DOM Elements
let searchInput, searchBtn, booksContainer, resultsHeader, resultsTitle, resultsCount;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeAuth();
    initializeGenreDropdown();
    initializeTheme();
    initializeAIAssistant();
    initializeNavigation();
    initializeLanguage();
    // Apply initial translations after DOM is ready
    if (window.__i18n) {
        window.__i18n.applyTranslations(document);
    }

    // Ensure favorites render when opening Profile
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
        profileLink.addEventListener('click', () => {
            if (window.favorites && typeof window.favorites.displayFavorites === 'function') {
                setTimeout(() => window.favorites.displayFavorites(), 0);
            }
        });
    }
});

// Fetch with timeout utility
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 4000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(id);
    }
}

/**
 * Initialize the application
 */
function initializeApp() {
    // Get DOM elements
    searchInput = document.getElementById('searchInput');
    searchBtn = document.getElementById('searchBtn');
    booksContainer = document.getElementById('booksContainer');
    resultsHeader = document.getElementById('resultsHeader');
    resultsTitle = document.getElementById('resultsTitle');
    resultsCount = document.getElementById('resultsCount');
    
    // Add event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

/**
 * Initialize Language Selector
 * - Restores saved language from localStorage
 * - Updates <html lang="..."> attribute
 * - Persists selection on change
 */
function initializeLanguage() {
    const select = document.getElementById('languageSelect');
    if (!select) return;

    const STORAGE_KEY = 'bv_lang';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && [...select.options].some(o => o.value === saved)) {
        select.value = saved;
        document.documentElement.setAttribute('lang', saved);
    } else {
        // default to English if none saved
        document.documentElement.setAttribute('lang', select.value || 'en');
    }

    select.addEventListener('change', () => {
        const value = select.value;
        localStorage.setItem(STORAGE_KEY, value);
        document.documentElement.setAttribute('lang', value);
        // Re-apply translations site-wide
        if (window.__i18n) {
            window.__i18n.applyTranslations(document);
        }
        // Re-render dynamic sections that use strings
        loadTopBooks();
    });
}
    
    if (searchInput) {
        // Hide placeholder on focus/input
        searchInput.addEventListener('focus', () => {
            const placeholder = document.querySelector('.search-placeholder');
            if (placeholder) placeholder.style.opacity = '0';
        });
        
        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                const placeholder = document.querySelector('.search-placeholder');
                if (placeholder) placeholder.style.opacity = '1';
            }
        });
        
        searchInput.addEventListener('input', () => {
            const placeholder = document.querySelector('.search-placeholder');
            if (placeholder) {
                placeholder.style.opacity = searchInput.value ? '0' : '1';
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

/**
 * Initialize authentication UI
 */
function initializeAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const closeModals = document.querySelectorAll('.close-modal');
    
    // Update UI based on login status
    updateAuthUI();
    
    // Open modals
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
            registerModal.style.display = 'none';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            registerModal.style.display = 'block';
            loginModal.style.display = 'none';
        });
    }
    
    // Close modals
    closeModals.forEach(close => {
        close.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === registerModal) registerModal.style.display = 'none';
        const bookDetailModal = document.getElementById('bookDetailModal');
        if (bookDetailModal && e.target === bookDetailModal) bookDetailModal.style.display = 'none';
    });
    
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const errorMsg = document.getElementById('loginError');
            
            const result = loginUser(username, password);
            if (result.success) {
                loginModal.style.display = 'none';
                loginForm.reset();
                errorMsg.textContent = '';
                updateAuthUI();
            } else {
                errorMsg.textContent = result.message;
            }
        });
    }
    
    // Register form
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const errorMsg = document.getElementById('registerError');
            
            const result = registerUser(username, email, password);
            if (result.success) {
                registerModal.style.display = 'none';
                registerForm.reset();
                errorMsg.textContent = '';
                updateAuthUI();
            } else {
                errorMsg.textContent = result.message;
            }
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutUser();
            updateAuthUI();
        });
    }
}

/**
 * Update authentication UI
 */
function updateAuthUI() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userInfo = document.getElementById('userInfo');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const libraryLink = document.getElementById('libraryLink');
    const profileLink = document.getElementById('profileLink');
    
    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (usernameDisplay) usernameDisplay.textContent = `Hello, ${user.username}!`;
        if (libraryLink) libraryLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'block';
        document.body.classList.add('logged-in');
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (userInfo) userInfo.style.display = 'none';
        if (libraryLink) libraryLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        document.body.classList.remove('logged-in');
    }
}

/**
 * Initialize navigation
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding page
            showPage(page);
        });
    });
}

/**
 * Show page
 */
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        
        // Initialize page-specific content
        if (pageName === 'library') {
            displayLibrary();
        } else if (pageName === 'home') {
            loadTopBooks();
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Load top books from all genres
 */
async function loadTopBooks() {
    const container = document.getElementById('topBooksContainer');
    if (!container) return;

    // Show loading
    if (!container.dataset.prefilled) {
        const loadingText = (window.__i18n ? window.__i18n.t('loading.top') : 'Loading top books...');
        container.innerHTML = `<div class="loading-books"><div class="spinner"></div><p>${loadingText}</p></div>`;
    }

    // Try cache first for instant paint
    const CACHE_KEY = 'bv_top_books_cache_v1';
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const { ts, books } = JSON.parse(cached);
            // 30 min TTL
            if (Date.now() - ts < 30 * 60 * 1000 && Array.isArray(books) && books.length) {
                displayTopBooks(books);
                // refresh in background but do not block UI
                refreshTopBooksCache(CACHE_KEY).catch(()=>{});
                return;
            }
        }
    } catch (_) {}

    try {
        // Determine backend URL
        const backendUrl = window.location.origin.includes('8000') 
            ? 'http://localhost:3000' 
            : window.location.origin;
        // Request fewer per-genre items for speed
        const response = await fetchWithTimeout(`${backendUrl}/api/top-books?perGenre=3`, { timeout: 4000 });
        
        if (!response.ok) {
            throw new Error('Failed to load top books');
        }

        const data = await response.json();
        
        if (data.books && data.books.length > 0) {
            displayTopBooks(data.books);
            try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), books: data.books })); } catch(_) {}
        } else {
            // Fallback: use direct Google Books API
            loadTopBooksFallback();
        }
    } catch (error) {
        console.error('Error loading top books:', error);
        // Fallback to using direct API
        loadTopBooksFallback();
    }
}

async function refreshTopBooksCache(CACHE_KEY){
    try {
        const backendUrl = window.location.origin.includes('8000') 
            ? 'http://localhost:3000' 
            : window.location.origin;
        const response = await fetchWithTimeout(`${backendUrl}/api/top-books?perGenre=3`, { timeout: 4000 });
        if (response.ok) {
            const data = await response.json();
            if (data.books && data.books.length) {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), books: data.books }));
            }
        }
    } catch(_) { /* ignore */ }
}

/**
 * Fallback: Load top books using direct Google Books API
 */
async function loadTopBooksFallback() {
    const genres = ['fiction', 'fantasy', 'mystery', 'romance', 'science fiction', 'horror'];
    const perGenre = 3;
    const requests = genres.map(async (genre) => {
        try {
            const books = await searchAllBooks(`subject:${genre}`, 'google');
            return books.slice(0, perGenre).map(b => ({ ...b, genre }));
        } catch (e) {
            console.error(`Error loading ${genre} books:`, e);
            return [];
        }
    });
    const results = await Promise.all(requests);
    const allBooks = results.flat();
    if (allBooks.length) {
        displayTopBooks(allBooks);
        try { sessionStorage.setItem('bv_top_books_cache_v1', JSON.stringify({ ts: Date.now(), books: allBooks })); } catch(_) {}
    } else {
        const container = document.getElementById('topBooksContainer');
        if (container) {
            const noTxt = (window.__i18n ? window.__i18n.t('no.results') : 'No books found. Try a different search term or genre.');
            container.innerHTML = `<p class="no-books-message">${noTxt}</p>`;
        }
    }
}

/**
 * Create a top book card element
 */
function createTopBookCard(book) {
    const card = document.createElement('div');
    card.className = 'top-book-card';
    card.dataset.bookId = book.id;
    
    // Cover
    const coverDiv = document.createElement('div');
    coverDiv.className = 'top-book-cover';
    
    const thumbnailUrl = (typeof getThumbnailUrl === 'function') ? getThumbnailUrl(book.image || book.thumbnail) : (book.image || book.thumbnail);
    if (thumbnailUrl && (typeof isValidUrl === 'undefined' || isValidUrl(thumbnailUrl))) {
        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = book.title || '';
        img.loading = 'lazy';
        img.onerror = function() {
            this.style.display = 'none';
            const ph = document.createTextNode((typeof createPlaceholderCover === 'function') ? createPlaceholderCover(book.title) : '📚');
            coverDiv.appendChild(ph);
        };
        coverDiv.appendChild(img);
    } else {
        coverDiv.textContent = (typeof createPlaceholderCover === 'function') ? createPlaceholderCover(book.title || '') : '📚';
    }
    card.appendChild(coverDiv);
    
    // Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'top-book-info';
    
    const titleEl = document.createElement('h4');
    titleEl.className = 'top-book-title';
    titleEl.textContent = (typeof sanitizeHTML === 'function') ? sanitizeHTML(book.title || 'Untitled') : (book.title || 'Untitled');
    infoDiv.appendChild(titleEl);
    
    const authorEl = document.createElement('p');
    authorEl.className = 'top-book-author';
    authorEl.textContent = (typeof formatAuthors === 'function') ? formatAuthors(book.authors || ['Unknown']) : (Array.isArray(book.authors) ? book.authors.join(', ') : 'Unknown');
    infoDiv.appendChild(authorEl);
    
    if (book.rating && typeof formatRating === 'function') {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'top-book-rating';
        ratingDiv.innerHTML = formatRating(book.rating);
        if (book.ratingCount) {
            ratingDiv.innerHTML += ` <span class="rating-count">(${book.ratingCount})</span>`;
        }
        infoDiv.appendChild(ratingDiv);
    }
    
    // Summary/Description
    const descEl = document.createElement('p');
    descEl.className = 'book-description';
    const description = book.description || book.summary || `Discover this ${book.genre || 'captivating'} book by ${(typeof formatAuthors === 'function') ? formatAuthors(book.authors || ['Unknown']) : 'Unknown'}.`;
    descEl.textContent = (typeof formatDescription === 'function') ? formatDescription(description, 120) : description.substring(0, 120) + (description.length > 120 ? '...' : '');
    infoDiv.appendChild(descEl);
    
    // Only show View Details button (no Add to Library for recommended books)
    const viewBtn = document.createElement('button');
    viewBtn.className = 'top-book-view-btn';
    viewBtn.textContent = (window.__i18n ? window.__i18n.t('book.viewDetails') : 'View Details');
    viewBtn.onclick = () => { if (typeof showBookDetails === 'function') showBookDetails(book); };
    infoDiv.appendChild(viewBtn);
    
    card.appendChild(infoDiv);
    card.onclick = () => { if (typeof showBookDetails === 'function') showBookDetails(book); };
    
    return card;
}

/**
 * Display top books in grouped sections by genre
 */
function displayTopBooks(books) {
    const container = document.getElementById('topBooksContainer');
    if (!container) return;

    // Group books by genre
    const booksByGenre = {};
    books.forEach(book => {
        const genre = book.genre || 'General';
        if (!booksByGenre[genre]) {
            booksByGenre[genre] = [];
        }
        booksByGenre[genre].push(book);
    });

    let html = '';

    // Display books grouped by genre
    for (const [genre, genreBooks] of Object.entries(booksByGenre)) {
        const genreName = genre.charAt(0).toUpperCase() + genre.slice(1).replace(/([A-Z])/g, ' $1');
        
        html += `<div class="genre-books-section">
            <h3 class="genre-section-title">📚 Top ${genreName} Books</h3>
            <div class="genre-books-grid">`;
        
        genreBooks.forEach((book) => {
            const bookCard = createTopBookCard(book);
            html += bookCard.outerHTML;
        });
        
        html += `</div></div>`;
    }

    container.innerHTML = html;
    // Clear prefill flag once we have rendered
    if (container.dataset.prefilled) {
        delete container.dataset.prefilled;
    }
}

/**
 * Create a book card for display
 */
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.bookId = book.id;
    
    // Favorite toggle (top-right)
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-toggle';
    const isFav = (window.favorites && window.favorites.isFavorite) ? window.favorites.isFavorite(book.id) : false;
    favBtn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
    favBtn.innerHTML = isFav ? '❤️' : '🤍';
    favBtn.onclick = (e) => {
        e.stopPropagation();
        if (!window.favorites || !window.favorites.toggleFavorite) return;
        const nowFav = window.favorites.toggleFavorite(book);
        favBtn.innerHTML = nowFav ? '❤️' : '🤍';
        favBtn.setAttribute('aria-label', nowFav ? 'Remove from favorites' : 'Add to favorites');
        if (document.getElementById('profilePage')?.classList.contains('active') && window.favorites.displayFavorites) {
            window.favorites.displayFavorites();
        }
    };
    card.appendChild(favBtn);

    // Cover image container
    const coverContainer = document.createElement('div');
    coverContainer.className = 'book-cover';
    
    const thumbnailUrl = getThumbnailUrl(book.image || book.thumbnail);
    if (thumbnailUrl && isValidUrl(thumbnailUrl)) {
        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = book.title;
        img.loading = 'lazy';
        img.onerror = function() {
            this.style.display = 'none';
            coverDiv.textContent = createPlaceholderCover(book.title);
        };
        coverDiv.appendChild(img);
    } else {
        coverDiv.textContent = createPlaceholderCover(book.title);
    }
    
    card.appendChild(coverDiv);
    
    // Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'top-book-info';
    
    // Title
    const titleElement = document.createElement('h4');
    titleElement.className = 'top-book-title';
    titleElement.textContent = sanitizeHTML(book.title);
    infoDiv.appendChild(titleElement);
    
    // Author
    const authorElement = document.createElement('p');
    authorElement.className = 'top-book-author';
    const author = Array.isArray(book.authors) 
        ? formatAuthors(book.authors) 
        : (book.authors || book.author || 'Unknown Author');
    authorElement.textContent = author;
    infoDiv.appendChild(authorElement);
    
    // Rating
    if (book.rating) {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'top-book-rating';
        ratingDiv.innerHTML = formatRating(book.rating);
        if (book.ratingCount) {
            ratingDiv.innerHTML += ` <span class="rating-count">(${book.ratingCount})</span>`;
        }
        infoDiv.appendChild(ratingDiv);
    }
    
    // View button
    const viewBtn = document.createElement('button');
    viewBtn.className = 'top-book-view-btn';
    viewBtn.textContent = (window.__i18n ? window.__i18n.t('book.viewDetails') : 'View Details');
    viewBtn.onclick = () => showBookDetails(book);
    infoDiv.appendChild(viewBtn);
    
    card.appendChild(infoDiv);
    card.onclick = () => showBookDetails(book);
    
    return card;
}

/**
 * Initialize genre dropdown
 */
function initializeGenreDropdown() {
    const genreToggle = document.getElementById('genreToggle');
    const genreDropdown = document.getElementById('genreDropdown');
    const arrow = genreToggle?.querySelector('.arrow');
    
    if (genreToggle && genreDropdown) {
        genreToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = genreDropdown.style.display === 'block';
            genreDropdown.style.display = isOpen ? 'none' : 'block';
            if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!genreToggle.contains(e.target) && !genreDropdown.contains(e.target)) {
                genreDropdown.style.display = 'none';
                if (arrow) arrow.textContent = '▼';
            }
        });
    }
}

/**
 * Select genre from dropdown
 */
function selectGenre(genre) {
    const genreDropdown = document.getElementById('genreDropdown');
    const genreToggle = document.getElementById('genreToggle');
    const arrow = genreToggle?.querySelector('.arrow');
    
    if (genreDropdown) genreDropdown.style.display = 'none';
    if (arrow) arrow.textContent = '▼';
    
    searchByGenre(genre);
}

/**
 * Handle search button click or Enter key
 */
async function handleSearch() {
    const query = searchInput?.value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    await performSearch(query);
}

/**
 * Perform book search
 * @param {string} query - Search query
 */
async function performSearch(query) {
    showLoading();
    hideNoResults();
    
    try {
        const books = await searchAllBooks(query);
        displayBooks(books, `Search results for "${query}"`);
        
        if (books.length === 0) {
            showNoResults();
        }
    } catch (error) {
        console.error('Search error:', error);
        showNoResults();
        alert('An error occurred while searching. Please try again.');
    } finally {
        hideLoading();
        scrollToResults();
    }
}

/**
 * Search by genre (called from HTML onclick)
 * @param {string} genre - Genre name
 */
async function searchByGenre(genre) {
    const genreTerm = getGenreSearchTerm(genre);
    
    showLoading();
    hideNoResults();
    
    // Update search input
    if (searchInput) {
        searchInput.value = genre === 'free books' ? '' : genreTerm;
    }
    
    try {
        let books;
        
        if (genre === 'free books') {
            books = await searchByGenreAPI('free books');
        } else {
            // Try backend API first for top genre books
            try {
                const backendUrl = window.location.origin.includes('8000') 
                    ? 'http://localhost:3000' 
                    : window.location.origin;
                
                const response = await fetch(`${backendUrl}/api/recommend-by-genre/${genre}`);
                
                if (response.ok) {
                    const data = await response.json();
                    books = data.recommendations || [];
                } else {
                    throw new Error('Backend API failed');
                }
            } catch (error) {
                // Fallback to direct API
                console.log('Using fallback API for genre:', genre);
                books = await searchByGenreAPI(genreTerm);
            }
        }
        
        const displayTitle = genre === 'free books' 
            ? 'Free Books from Project Gutenberg'
            : `⭐ Top ${genre.charAt(0).toUpperCase() + genre.slice(1)} Books`;
        
        displayBooks(books, displayTitle);
        
        if (books.length === 0) {
            showNoResults();
        }
    } catch (error) {
        console.error('Genre search error:', error);
        showNoResults();
        alert('An error occurred while searching. Please try again.');
    } finally {
        hideLoading();
        scrollToResults();
    }
}

/**
 * Display books in the UI
 * @param {Array} books - Array of book objects
 * @param {string} title - Results title
 */
function displayBooks(books, title) {
    if (!booksContainer) return;
    
    // Update results header
    if (resultsHeader) {
        resultsHeader.style.display = 'block';
    }
    
    if (resultsTitle) {
        resultsTitle.textContent = title;
    }
    
    if (resultsCount) {
        const count = books.length;
        if (window.__i18n && window.__i18n.format) {
            resultsCount.textContent = window.__i18n.format('results.count', { count });
        } else {
            resultsCount.textContent = `Found ${count} book${count !== 1 ? 's' : ''}`;
        }
    }
    
    // Clear previous results
    booksContainer.innerHTML = '';
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Display each book with lazy loading
    books.forEach((book, index) => {
        const bookCard = createBookCard(book);
        bookCard.style.opacity = '0';
        fragment.appendChild(bookCard);
        
        // Lazy load animation
        setTimeout(() => {
            bookCard.style.transition = 'opacity 0.3s ease';
            bookCard.style.opacity = '1';
        }, index * 50);
    });
    
    booksContainer.appendChild(fragment);
}

/**
 * Create a book card element
 * @param {Object} book - Book object
 * @returns {HTMLElement} Book card element
 */
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    // Create thumbnail
    const coverImg = document.createElement('img');
    coverImg.className = 'book-cover';
    
    const thumbnailUrl = getThumbnailUrl(book.thumbnail);
    if (thumbnailUrl && isValidUrl(thumbnailUrl)) {
        coverImg.src = thumbnailUrl;
        coverImg.alt = book.title;
        coverImg.onerror = function() {
            // If image fails to load, show placeholder
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'book-cover';
            placeholder.textContent = createPlaceholderCover(book.title);
            card.replaceChild(placeholder, this);
        };
    } else {
        // No thumbnail available, show placeholder
        coverImg.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'book-cover';
        placeholder.textContent = createPlaceholderCover(book.title);
        card.appendChild(placeholder);
    }
    
    if (coverImg.style.display !== 'none') {
        card.appendChild(coverImg);
    }
    
    // Create book info container
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
    
    // Rating out of 5
    if (book.rating !== null && book.rating !== undefined) {
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
    
    // Description - Always show, even if empty
    const descElement = document.createElement('p');
    descElement.className = 'book-description';
    descElement.textContent = formatDescription(book.description || `Explore this ${book.categories?.[0] || 'interesting'} book by ${formatAuthors(book.authors)}.`);
    infoDiv.appendChild(descElement);
    
    // Action buttons container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'book-actions';
    
    // Add to Library button (if logged in)
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        const libraryBtn = document.createElement('button');
        libraryBtn.className = `library-add-btn ${isInLibrary(book.id) ? 'in-library' : ''}`;
        if (window.__i18n) {
            libraryBtn.innerHTML = isInLibrary(book.id) ? `✓ ${window.__i18n.t('library.inLibrary')}` : `❤️ ${window.__i18n.t('library.add')}`;
        } else {
            libraryBtn.innerHTML = isInLibrary(book.id) ? '✓ In Library' : '❤️ Add to Library';
        }
        libraryBtn.onclick = (e) => {
            e.stopPropagation();
            toggleLibraryBook(book);
            libraryBtn.classList.toggle('in-library');
            if (window.__i18n) {
                libraryBtn.innerHTML = isInLibrary(book.id) ? `✓ ${window.__i18n.t('library.inLibrary')}` : `❤️ ${window.__i18n.t('library.add')}`;
            } else {
                libraryBtn.innerHTML = isInLibrary(book.id) ? '✓ In Library' : '❤️ Add to Library';
            }
        };
        actionsDiv.appendChild(libraryBtn);
    }
    
    // View Details button
    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'book-link';
    detailsBtn.textContent = (window.__i18n ? window.__i18n.t('book.viewDetails') : 'View Details');
    detailsBtn.onclick = (e) => {
        e.stopPropagation();
        showBookDetails(book);
    };
    actionsDiv.appendChild(detailsBtn);
    
    // External link (if available)
    if (book.infoLink || book.previewLink) {
        const linkElement = document.createElement('a');
        linkElement.className = 'book-link book-link-external';
        linkElement.href = book.infoLink || book.previewLink;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.textContent = book.source === 'Project Gutenberg' ? 'Read Free' : 'Preview';
        linkElement.onclick = (e) => e.stopPropagation();
        actionsDiv.appendChild(linkElement);
    }
    
    infoDiv.appendChild(actionsDiv);
    
    card.appendChild(infoDiv);
    card.dataset.bookId = book.id;
    
    return card;
}

