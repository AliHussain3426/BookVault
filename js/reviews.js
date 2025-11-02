/**
 * Reviews - BookVault
 * Fetch and display book reviews
 */

// Fetch reviews for a book
async function fetchBookReviews(book) {
    const reviews = [];
    
    try {
        // Try Google Books API for reviews
        if (book.id && book.id.startsWith('google-') || book.source === 'Google Books') {
            const bookId = book.id.replace('google-', '').split('-')[0];
            const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const volumeInfo = data.volumeInfo || {};
                
                // Create review from ratings
                if (volumeInfo.averageRating && volumeInfo.ratingsCount) {
                    reviews.push({
                        author: 'Google Books Users',
                        rating: volumeInfo.averageRating,
                        text: `${volumeInfo.ratingsCount} ratings with an average of ${volumeInfo.averageRating.toFixed(1)} stars. ${volumeInfo.description ? truncateText(volumeInfo.description, 200) : ''}`,
                        date: volumeInfo.publishedDate || ''
                    });
                }
            }
        }
        
        // Generate sample reviews if none found
        if (reviews.length === 0) {
            reviews.push({
                author: 'BookVault Community',
                rating: book.rating || 4.0,
                text: generateReviewText(book),
                date: book.publishedDate || new Date().toISOString().split('T')[0]
            });
        }
        
    } catch (error) {
        console.error('Error fetching reviews:', error);
        // Fallback review
        reviews.push({
            author: 'BookVault',
            rating: book.rating || 4.0,
            text: generateReviewText(book),
            date: new Date().toISOString().split('T')[0]
        });
    }
    
    return reviews;
}

// Generate review text
function generateReviewText(book) {
    const templates = [
        `A ${book.categories?.[0] || 'captivating'} book that offers ${book.description ? 'insightful' : 'engaging'} content. Worth reading!`,
        `This ${book.categories?.[0] || 'well-written'} work by ${formatAuthors(book.authors)} provides an excellent reading experience.`,
        `Highly recommended for fans of ${book.categories?.[0] || 'literature'}. ${book.description ? 'The story is compelling.' : 'A great addition to any collection.'}`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

// Display reviews in modal
function displayReviews(reviews) {
    if (!reviews || reviews.length === 0) {
        return '<div class="no-reviews">No reviews available yet.</div>';
    }
    
    let html = '<div class="reviews-section"><h3>Reviews</h3>';
    
    reviews.forEach(review => {
        html += `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-author">${sanitizeHTML(review.author)}</span>
                    <div class="review-rating">${formatRating(review.rating)}</div>
                </div>
                <p class="review-text">${sanitizeHTML(review.text)}</p>
                <span class="review-date">${review.date || ''}</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Show book details with reviews
async function showBookDetails(book) {
    const modal = document.getElementById('bookDetailModal');
    const content = document.getElementById('bookDetailContent');
    
    if (!modal || !content) return;
    
    // Show loading
    content.innerHTML = '<div class="loading-reviews"><p>Loading book details...</p></div>';
    modal.style.display = 'block';
    
    // Fetch reviews
    const reviews = await fetchBookReviews(book);
    
    // Build content
    let html = `
        <span class="close-modal" onclick="document.getElementById('bookDetailModal').style.display='none'">&times;</span>
        <div class="book-detail-header">
            <img src="${getThumbnailUrl(book.thumbnail) || ''}" alt="${book.title}" class="detail-cover" onerror="this.style.display='none'">
            <div class="detail-info">
                <h2>${sanitizeHTML(book.title)}</h2>
                <p class="detail-author">By ${formatAuthors(book.authors)}</p>
                ${book.rating ? `<div class="detail-rating">${formatRating(book.rating)}</div>` : ''}
                <p class="detail-description">${formatDescription(book.description || 'No description available.', 500)}</p>
                ${book.publishedDate ? `<p><strong>Published:</strong> ${book.publishedDate}</p>` : ''}
                ${book.pageCount ? `<p><strong>Pages:</strong> ${book.pageCount}</p>` : ''}
                <div class="detail-actions">
                    ${book.infoLink ? `<a href="${book.infoLink}" target="_blank" class="book-link">View Online</a>` : ''}
                    ${isLoggedIn() ? `<button class="library-add-btn ${isInLibrary(book.id) ? 'in-library' : ''}" onclick="toggleLibraryBook(${JSON.stringify(book).replace(/"/g, '&quot;')})">${isInLibrary(book.id) ? '✓ In Library' : '❤️ Add to Library'}</button>` : ''}
                </div>
            </div>
        </div>
    `;
    
    html += displayReviews(reviews);
    
    content.innerHTML = html;
}

// Toggle book in library
function toggleLibraryBook(book) {
    console.log('toggleLibraryBook called');
    console.log('isLoggedIn:', typeof isLoggedIn === 'function' ? isLoggedIn() : 'function not found');
    
    if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
        alert('Please login to manage your library');
        console.warn('Toggle failed: User not logged in');
        return;
    }
    
    try {
        if (isInLibrary(book.id)) {
            removeFromLibrary(book.id);
            console.log('Book removed from library');
        } else {
            addToLibrary(book);
            console.log('Book added to library');
        }
        
        // Refresh details if modal is open
        const modal = document.getElementById('bookDetailModal');
        if (modal && modal.style.display === 'block') {
            showBookDetails(book);
        }
        
        // Update button on book card
        const btn = document.querySelector(`[data-book-id="${book.id}"] .library-add-btn`);
        if (btn) {
            btn.classList.toggle('in-library');
            btn.innerHTML = isInLibrary(book.id) ? '✓ In Library' : '❤️ Add to Library';
        }
    } catch (error) {
        console.error('Error toggling library book:', error);
        alert('An error occurred. Please try again.');
    }
}

