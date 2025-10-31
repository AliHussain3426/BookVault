/**
 * Utility Functions for BookVault
 * Helper functions for formatting, validation, and common operations
 */

/**
 * Format rating to display with stars
 * @param {number} rating - The rating value (0-5)
 * @param {number} maxRating - Maximum rating value (default: 5)
 * @returns {string} HTML string with star rating
 */
function formatRating(rating, maxRating = 5) {
    if (!rating || isNaN(rating)) {
        return '<span class="rating-value">No rating</span>';
    }

    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '<span class="rating-stars">';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '☆';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '☆';
    }
    
    starsHTML += '</span>';
    starsHTML += `<span class="rating-value">${numRating.toFixed(1)}</span>`;
    
    return starsHTML;
}

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Get thumbnail URL with fallback
 * @param {string} thumbnailUrl - Primary thumbnail URL
 * @param {string} fallbackUrl - Fallback URL if primary is missing
 * @returns {string} Valid thumbnail URL
 */
function getThumbnailUrl(thumbnailUrl, fallbackUrl = '') {
    if (thumbnailUrl && thumbnailUrl !== 'N/A') {
        // Replace small thumbnail with larger one for better quality
        return thumbnailUrl.replace(/&zoom=\d+/, '').replace('zoom=1', 'zoom=0');
    }
    return fallbackUrl || '';
}

/**
 * Format authors array or string to display format
 * @param {string|Array} authors - Author(s) as string or array
 * @returns {string} Formatted author string
 */
function formatAuthors(authors) {
    if (!authors) return 'Unknown Author';
    
    if (Array.isArray(authors)) {
        return authors.join(', ');
    }
    
    return authors;
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get genre search term
 * Maps display genres to search terms for different APIs
 * @param {string} genre - Genre name from button
 * @returns {string} Mapped genre term
 */
function getGenreSearchTerm(genre) {
    const genreMap = {
        'fiction': 'fiction',
        'mystery': 'mystery',
        'romance': 'romance',
        'science fiction': 'science fiction',
        'sci-fi': 'science fiction',
        'fantasy': 'fantasy',
        'horror': 'horror',
        'biography': 'biography',
        'history': 'history',
        'philosophy': 'philosophy',
        'poetry': 'poetry',
        'children': 'children',
        'free books': 'free'
    };
    
    return genreMap[genre.toLowerCase()] || genre;
}

/**
 * Create book cover placeholder
 * @param {string} title - Book title for placeholder
 * @returns {string} HTML for placeholder
 */
function createPlaceholderCover(title) {
    if (!title) return '📚';
    const words = title.split(' ').slice(0, 2);
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    return initials || '📚';
}

/**
 * Format book description
 * @param {string} description - Book description
 * @param {number} maxLength - Maximum length
 * @returns {string} Formatted description
 */
function formatDescription(description, maxLength = 200) {
    if (!description) return 'Explore this captivating book and discover an engaging story worth reading.';
    
    // Remove HTML tags if present
    let text = description.replace(/<[^>]*>/g, '');
    
    // Clean up excessive whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return truncateText(text, maxLength);
}

/**
 * Check if a URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
function isValidUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get readable date format
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch {
        return dateString;
    }
}

/**
 * Scroll to top of results
 */
function scrollToResults() {
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Show loading state
 */
function showLoading() {
    const loadingSection = document.getElementById('loadingSection');
    const booksContainer = document.getElementById('booksContainer');
    const noResults = document.getElementById('noResults');
    
    if (loadingSection) loadingSection.style.display = 'block';
    if (booksContainer) booksContainer.innerHTML = '';
    if (noResults) noResults.style.display = 'none';
}

/**
 * Hide loading state
 */
function hideLoading() {
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection) loadingSection.style.display = 'none';
}

/**
 * Show no results message
 */
function showNoResults() {
    const noResults = document.getElementById('noResults');
    const loadingSection = document.getElementById('loadingSection');
    
    if (noResults) noResults.style.display = 'block';
    if (loadingSection) loadingSection.style.display = 'none';
}

/**
 * Hide no results message
 */
function hideNoResults() {
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = 'none';
}

