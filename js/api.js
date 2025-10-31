/**
 * API Integration for BookVault
 * Optimized with caching for better performance
 */

const API_CONFIG = {
    googleBooks: {
        baseUrl: 'https://www.googleapis.com/books/v1/volumes',
        maxResults: 10  // Reduced for faster loading
    },
    openLibrary: {
        baseUrl: 'https://openlibrary.org/search.json',
        coverUrl: 'https://covers.openlibrary.org/b/id/',
        maxResults: 10  // Reduced for faster loading
    },
    gutendex: {
        baseUrl: 'https://gutendex.com/books',
        maxResults: 10  // Reduced for faster loading
    }
};

// Simple cache with TTL (Time To Live)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data or null if expired
 */
function getCached(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

/**
 * Set cache with timestamp
 */
function setCache(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

/**
 * Search Google Books API with caching
 */
async function searchGoogleBooks(query, maxResults = 10) {
    const cacheKey = `google_${query}_${maxResults}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    
    try {
        const url = `${API_CONFIG.googleBooks.baseUrl}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            return [];
        }
        
        const books = data.items.map(item => {
            const volumeInfo = item.volumeInfo || {};
            let description = volumeInfo.description || '';
            
            // Generate description from other fields if missing
            if (!description) {
                const parts = [];
                if (volumeInfo.categories?.[0]) parts.push(`Category: ${volumeInfo.categories[0]}`);
                if (volumeInfo.publishedDate) parts.push(`Published: ${volumeInfo.publishedDate}`);
                if (volumeInfo.pageCount) parts.push(`${volumeInfo.pageCount} pages`);
                description = parts.length > 0 ? parts.join('. ') + '.' : 'A captivating book worth reading.';
            }
            
            return {
                id: item.id || `google-${Date.now()}-${Math.random()}`,
                title: volumeInfo.title || 'Untitled',
                authors: volumeInfo.authors || ['Unknown Author'],
                description: description,
                thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
                rating: volumeInfo.averageRating || volumeInfo.ratingsCount ? 
                       (volumeInfo.averageRating || 0) : null,
                ratingCount: volumeInfo.ratingsCount || 0,
                publishedDate: volumeInfo.publishedDate || '',
                pageCount: volumeInfo.pageCount || 0,
                categories: volumeInfo.categories || [],
                language: volumeInfo.language || 'en',
                previewLink: volumeInfo.previewLink || '',
                infoLink: volumeInfo.infoLink || '',
                source: 'Google Books'
            };
        });
        
        setCache(cacheKey, books);
        return books;
    } catch (error) {
        console.error('Error searching Google Books:', error);
        return [];
    }
}

/**
 * Search Open Library API with caching - Only fetch if Google Books fails
 */
async function searchOpenLibrary(query, maxResults = 10) {
    const cacheKey = `openlib_${query}_${maxResults}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    
    try {
        const url = `${API_CONFIG.openLibrary.baseUrl}?q=${encodeURIComponent(query)}&limit=${maxResults}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Open Library API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.docs || data.docs.length === 0) {
            return [];
        }
        
        const books = data.docs.map(doc => {
            const coverId = doc.cover_i;
            let thumbnail = '';
            
            if (coverId) {
                thumbnail = `${API_CONFIG.openLibrary.coverUrl}${coverId}-L.jpg`;
            }
            
            // Generate description if missing
            let description = doc.first_sentence?.[0] || '';
            if (!description) {
                const parts = [];
                if (doc.subject?.[0]) parts.push(`Genre: ${doc.subject[0]}`);
                if (doc.first_publish_year) parts.push(`First published: ${doc.first_publish_year}`);
                if (doc.number_of_pages_median) parts.push(`${doc.number_of_pages_median} pages`);
                description = parts.length > 0 ? parts.join('. ') + '.' : `An interesting book about ${doc.subject?.[0] || 'various topics'}.`;
            }
            
            return {
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
                previewLink: `https://openlibrary.org${doc.key}`,
                infoLink: `https://openlibrary.org${doc.key}`,
                source: 'Open Library'
            };
        });
        
        setCache(cacheKey, books);
        return books;
    } catch (error) {
        console.error('Error searching Open Library:', error);
        return [];
    }
}

/**
 * Search Gutendex API with caching
 */
async function searchGutendex(query, maxResults = 10) {
    const cacheKey = `gutendex_${query}_${maxResults}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    
    try {
        const url = `${API_CONFIG.gutendex.baseUrl}/?search=${encodeURIComponent(query)}&limit=${maxResults}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Gutendex API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return [];
        }
        
        const books = data.results.map(book => {
            const author = book.authors && book.authors.length > 0 
                ? book.authors.map(a => a.name).join(', ')
                : 'Unknown Author';
            
            // Generate description if missing
            let description = '';
            if (book.subjects && book.subjects.length > 0) {
                description = `A classic book covering topics such as ${book.subjects.slice(0, 3).join(', ')}.`;
            } else if (book.authors?.[0]?.name) {
                description = `A timeless work by ${book.authors[0].name}.`;
            } else {
                description = 'A classic literary work available for free reading.';
            }
            
            return {
                id: book.id?.toString() || `gutendex-${Date.now()}-${Math.random()}`,
                title: book.title || 'Untitled',
                authors: [author],
                description: description,
                thumbnail: book.formats?.['image/jpeg'] || '',
                rating: null,
                ratingCount: 0,
                publishedDate: book.published?.toString() || '',
                pageCount: 0,
                categories: book.subjects || [],
                language: book.languages?.[0] || 'en',
                previewLink: book.formats?.['text/html'] || book.formats?.['text/plain; charset=utf-8'] || '',
                infoLink: `https://www.gutenberg.org/ebooks/${book.id}`,
                source: 'Project Gutenberg',
                downloadCount: book.download_count || 0
            };
        });
        
        setCache(cacheKey, books);
        return books;
    } catch (error) {
        console.error('Error searching Gutendex:', error);
        return [];
    }
}

/**
 * Optimized search - prioritize Google Books for speed, fallback to others
 */
async function searchAllBooks(query, source = 'all') {
    if (!query || query.trim() === '') {
        return [];
    }
    
    try {
        // Try Google Books first (fastest and most complete)
        if (source === 'all' || source === 'google') {
            const googleResults = await searchGoogleBooks(query);
            if (googleResults.length >= 5) {
                return googleResults.slice(0, 15); // Return first 15 for speed
            }
        }
        
        // If not enough results, try other APIs in parallel
        const searchPromises = [];
        
        if (source === 'all' || source === 'google') {
            searchPromises.push(searchGoogleBooks(query));
        }
        
        if (source === 'all' || source === 'openlib') {
            searchPromises.push(searchOpenLibrary(query));
        }
        
        if (source === 'all' || source === 'gutendex') {
            searchPromises.push(searchGutendex(query));
        }
        
        const results = await Promise.allSettled(searchPromises);
        let allBooks = [];
        
        results.forEach((result) => {
            if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                allBooks = allBooks.concat(result.value);
            }
        });
        
        // Remove duplicates and limit to 20 for performance
        const uniqueBooks = removeDuplicateBooks(allBooks);
        return uniqueBooks.slice(0, 20);
    } catch (error) {
        console.error('Error in searchAllBooks:', error);
        return [];
    }
}

/**
 * Remove duplicate books
 */
function removeDuplicateBooks(books) {
    const seen = new Set();
    const unique = [];
    
    books.forEach(book => {
        const titleKey = book.title.toLowerCase().trim();
        const authorKey = Array.isArray(book.authors) 
            ? book.authors[0]?.toLowerCase().trim() || ''
            : book.authors?.toLowerCase().trim() || '';
        
        const key = `${titleKey}|${authorKey}`;
        
        if (!seen.has(key) && titleKey) {
            seen.add(key);
            unique.push(book);
        }
    });
    
    return unique;
}

/**
 * Search books by genre
 */
async function searchByGenreAPI(genre) {
    if (genre.toLowerCase() === 'free books') {
        return searchGutendex('', 15);
    }
    
    return searchAllBooks(`subject:${genre}`, 'google'); // Use only Google for speed
}
