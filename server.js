/**
 * Mood Based Book Recommendor - Backend Server
 * Handles API calls to Hugging Face and Google Books
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || 'facebook/blenderbot-400M-distill';

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('.')); // Serve static files from root

// Top books by genre - curated best sellers and popular books
const topBooksByGenre = {
    fiction: [
        'To Kill a Mockingbird',
        'The Great Gatsby',
        '1984',
        'Pride and Prejudice',
        'The Catcher in the Rye',
        'The Book Thief',
        'The Kite Runner'
    ],
    fantasy: [
        'Harry Potter and the Philosopher\'s Stone',
        'The Lord of the Rings',
        'A Game of Thrones',
        'The Chronicles of Narnia',
        'The Hobbit',
        'Mistborn',
        'The Name of the Wind'
    ],
    mystery: [
        'The Girl with the Dragon Tattoo',
        'Gone Girl',
        'The Da Vinci Code',
        'And Then There Were None',
        'The Girl on the Train',
        'Big Little Lies',
        'The Silent Patient'
    ],
    romance: [
        'Pride and Prejudice',
        'The Notebook',
        'Me Before You',
        'Outlander',
        'It Ends with Us',
        'The Fault in Our Stars',
        'The Seven Husbands of Evelyn Hugo'
    ],
    'science fiction': [
        'Dune',
        'The Martian',
        'Ender\'s Game',
        'The Hitchhiker\'s Guide to the Galaxy',
        '1984',
        'Foundation',
        'The Hunger Games'
    ],
    horror: [
        'It',
        'The Shining',
        'Dracula',
        'Frankenstein',
        'The Haunting of Hill House',
        'Bird Box',
        'The Exorcist'
    ],
    biography: [
        'The Diary of a Young Girl',
        'Steve Jobs',
        'Educated',
        'The Glass Castle',
        'Born a Crime',
        'Becoming',
        'I Am Malala'
    ],
    history: [
        'Sapiens',
        'Guns, Germs, and Steel',
        'A People\'s History of the United States',
        'The Immortal Life of Henrietta Lacks',
        'Killers of the Flower Moon',
        'The Warmth of Other Suns'
    ],
    philosophy: [
        'Meditations',
        'The Republic',
        'Thus Spoke Zarathustra',
        'The Art of War',
        'The Prince',
        'Beyond Good and Evil',
        'Sophie\'s World'
    ],
    poetry: [
        'The Collected Poems of Maya Angelou',
        'Leaves of Grass',
        'The Waste Land',
        'Howl and Other Poems',
        'The Sun and Her Flowers',
        'Milk and Honey',
        'Selected Poems of Emily Dickinson'
    ],
    adventure: [
        'The Lord of the Rings',
        'Jurassic Park',
        'The Hunger Games',
        'The Hobbit',
        'Treasure Island',
        'Around the World in Eighty Days',
        'The Count of Monte Cristo'
    ],
    thriller: [
        'Gone Girl',
        'The Girl with the Dragon Tattoo',
        'The Da Vinci Code',
        'The Girl on the Train',
        'The Silent Patient',
        'Sharp Objects',
        'The Woman in the Window'
    ]
};

// Mood to book recommendations mapping
const moodBookMap = {
    happy: ['comedy', 'light-hearted fiction', 'romance', 'children books'],
    sad: ['inspirational', 'self-help', 'poetry', 'philosophy'],
    romantic: ['romance novels', 'classic romance', 'love stories'],
    adventurous: ['adventure fiction', 'thriller', 'action novels', 'fantasy adventure'],
    mysterious: ['mystery novels', 'detective stories', 'crime fiction', 'thrillers'],
    thoughtful: ['philosophy', 'literary fiction', 'classics', 'biography'],
    exciting: ['thriller', 'suspense', 'action', 'adventure'],
    calm: ['poetry', 'meditation books', 'nature writing', 'philosophy'],
    nostalgic: ['classics', 'historical fiction', 'biography', 'memoirs'],
    inspiring: ['biography', 'self-help', 'motivational', 'philosophy'],
    dark: ['horror', 'gothic fiction', 'thriller', 'mystery'],
    fantasy: ['fantasy novels', 'sci-fi fantasy', 'epic fantasy'],
    sci_fi: ['science fiction', 'sci-fi novels', 'space opera'],
    horror: ['horror novels', 'gothic horror', 'supernatural'],
    comedy: ['humor', 'comedy novels', 'satire', 'light fiction']
};

/**
 * Get book recommendations from Google Books API based on genre or book title
 */
async function getBooksFromGoogleBooks(query, limit = 5) {
    try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: query,
                maxResults: limit,
                langRestrict: 'en',
                orderBy: 'relevance'
            }
        });

        if (!response.data.items) {
            return [];
        }

        return response.data.items.map(item => {
            const volumeInfo = item.volumeInfo || {};
            return {
                id: item.id || `book-${Date.now()}-${Math.random()}`,
                title: volumeInfo.title || 'Unknown Title',
                author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
                description: volumeInfo.description || 'No description available.',
                image: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
                rating: volumeInfo.averageRating || null,
                ratingCount: volumeInfo.ratingsCount || 0,
                publishedDate: volumeInfo.publishedDate || '',
                pageCount: volumeInfo.pageCount || 0,
                previewLink: volumeInfo.previewLink || '',
                infoLink: volumeInfo.infoLink || '',
                categories: volumeInfo.categories || [],
                source: 'Google Books'
            };
        });
    } catch (error) {
        console.error('Error fetching from Google Books:', error.message);
        return [];
    }
}

/**
 * Get top books for a specific genre
 */
async function getTopBooksByGenre(genre, limit = 5) {
    const bookTitles = topBooksByGenre[genre] || [];
    const allBooks = [];

    // Fetch books by title
    for (const title of bookTitles.slice(0, limit)) {
        const books = await getBooksFromGoogleBooks(`intitle:"${title}"`, 1);
        if (books.length > 0) {
            allBooks.push({ ...books[0], genre });
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // If we don't have enough, fill with genre search
    if (allBooks.length < limit) {
        const genreBooks = await getBooksFromGoogleBooks(`subject:${genre}`, limit - allBooks.length);
        const uniqueBooks = genreBooks.filter(book => 
            !allBooks.some(existing => existing.title.toLowerCase() === book.title.toLowerCase())
        );
        uniqueBooks.forEach(book => {
            allBooks.push({ ...book, genre });
        });
    }

    return allBooks.slice(0, limit);
}

/**
 * Get top books from all genres
 */
async function getTopBooksFromAllGenres(booksPerGenre = 4) {
    const genres = Object.keys(topBooksByGenre);
    const allBooks = [];

    for (const genre of genres) {
        try {
            const books = await getTopBooksByGenre(genre, booksPerGenre);
            allBooks.push(...books);
        } catch (error) {
            console.error(`Error fetching books for genre ${genre}:`, error.message);
        }
        // Delay between genre requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    return allBooks;
}

/**
 * Detect mood from user input using keywords
 */
function detectMood(input) {
    const lowerInput = input.toLowerCase();
    
    const moodKeywords = {
        happy: ['happy', 'cheerful', 'joyful', 'upbeat', 'positive', 'light', 'fun'],
        sad: ['sad', 'depressed', 'down', 'melancholy', 'sorrowful', 'blue'],
        romantic: ['romantic', 'love', 'romance', 'dating', 'relationship', 'heart'],
        adventurous: ['adventure', 'adventurous', 'exciting', 'thrilling', 'action', 'journey'],
        mysterious: ['mystery', 'mysterious', 'secret', 'puzzle', 'detective', 'crime'],
        thoughtful: ['thoughtful', 'deep', 'philosophical', 'reflective', 'contemplative'],
        exciting: ['exciting', 'thrilling', 'intense', 'action-packed', 'fast-paced'],
        calm: ['calm', 'peaceful', 'relaxing', 'serene', 'tranquil', 'zen'],
        nostalgic: ['nostalgic', 'nostalgia', 'memories', 'remembering', 'past'],
        inspiring: ['inspiring', 'motivational', 'uplifting', 'empowering', 'encouraging'],
        dark: ['dark', 'grim', 'gritty', 'noir', 'dystopian'],
        fantasy: ['fantasy', 'magical', 'wizard', 'dragon', 'epic'],
        sci_fi: ['sci-fi', 'science fiction', 'space', 'futuristic', 'alien'],
        horror: ['horror', 'scary', 'frightening', 'terrifying', 'haunted'],
        comedy: ['funny', 'humor', 'comedy', 'comical', 'hilarious', 'witty']
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (keywords.some(keyword => lowerInput.includes(keyword))) {
            return mood;
        }
    }

    return 'thoughtful'; // Default mood
}

/**
 * Generate recommendations using Hugging Face AI
 */
async function generateRecommendationsWithAI(mood, userInput) {
    if (!HF_API_KEY) {
        console.warn('Hugging Face API key not found, using fallback recommendations');
        return null;
    }

    try {
        // Use a simpler model that's more reliable for recommendations
        const prompt = `Based on the mood "${mood}" and user input "${userInput}", suggest 3-5 book genres that match this mood. Respond with only the genres, comma-separated.`;

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                inputs: prompt,
                parameters: {
                    max_new_tokens: 100,
                    return_full_text: false
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Hugging Face API error:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Get book recommendations based on mood
 */
async function getMoodBasedRecommendations(mood, userInput) {
    // Get genres for the mood
    const genres = moodBookMap[mood] || moodBookMap['thoughtful'];
    
    // Get books from first genre
    const primaryGenre = genres[0];
    let books = await getBooksFromGoogleBooks(primaryGenre, 5);

    // If we don't have enough books, try other genres
    if (books.length < 3) {
        for (const genre of genres.slice(1)) {
            const additionalBooks = await getBooksFromGoogleBooks(genre, 3);
            books = [...books, ...additionalBooks];
            if (books.length >= 5) break;
        }
    }

    // Remove duplicates and limit to 5
    const uniqueBooks = [];
    const seenTitles = new Set();
    
    for (const book of books) {
        if (!seenTitles.has(book.title.toLowerCase())) {
            seenTitles.add(book.title.toLowerCase());
            uniqueBooks.push(book);
            if (uniqueBooks.length >= 5) break;
        }
    }

    return uniqueBooks;
}

/**
 * POST /api/recommend - Get book recommendations based on mood
 */
app.post('/api/recommend', async (req, res) => {
    try {
        const { mood, userInput } = req.body;

        if (!mood && !userInput) {
            return res.status(400).json({ 
                error: 'Please provide either a mood or user input' 
            });
        }

        // Detect mood if not provided
        const detectedMood = mood || detectMood(userInput || '');
        
        console.log(`Processing recommendation for mood: ${detectedMood}`);

        // Try AI generation first (optional)
        // const aiResponse = await generateRecommendationsWithAI(detectedMood, userInput);

        // Get book recommendations
        const recommendations = await getMoodBasedRecommendations(detectedMood, userInput);

        if (recommendations.length === 0) {
            return res.status(404).json({ 
                error: 'No books found for this mood. Please try a different mood.' 
            });
        }

        res.json({
            mood: detectedMood,
            recommendations: recommendations,
            message: `Based on your ${detectedMood} mood, here are some great book recommendations!`
        });

    } catch (error) {
        console.error('Error in /api/recommend:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
});

/**
 * GET /api/top-books - Get top books from all genres
 */
app.get('/api/top-books', async (req, res) => {
    try {
        const { genre, limit } = req.query;
        
        if (genre) {
            // Get top books for specific genre
            const books = await getTopBooksByGenre(genre, parseInt(limit) || 5);
            res.json({
                genre,
                books,
                count: books.length
            });
        } else {
            // Get top books from all genres
            const booksPerGenre = parseInt(req.query.perGenre) || 3;
            const books = await getTopBooksFromAllGenres(booksPerGenre);
            res.json({
                books,
                count: books.length,
                genres: Object.keys(topBooksByGenre)
            });
        }
    } catch (error) {
        console.error('Error in /api/top-books:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
});

/**
 * GET /api/genres - Get all available genres
 */
app.get('/api/genres', (req, res) => {
    res.json({
        genres: Object.keys(topBooksByGenre).map(genre => ({
            name: genre,
            displayName: genre.charAt(0).toUpperCase() + genre.slice(1).replace(/([A-Z])/g, ' $1'),
            bookCount: topBooksByGenre[genre].length
        }))
    });
});

/**
 * GET /api/recommend-by-genre/:genre - Get recommendations for a specific genre
 */
app.get('/api/recommend-by-genre/:genre', async (req, res) => {
    try {
        const genre = req.params.genre.toLowerCase();
        
        if (!topBooksByGenre[genre]) {
            return res.status(400).json({ 
                error: 'Genre not found',
                availableGenres: Object.keys(topBooksByGenre)
            });
        }

        const books = await getTopBooksByGenre(genre, 10);
        
        res.json({
            genre,
            recommendations: books,
            message: `Top ${genre} books`
        });
    } catch (error) {
        console.error('Error in /api/recommend-by-genre:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'Mood Based Book Recommendor',
        hfApiKey: HF_API_KEY ? 'configured' : 'not configured'
    });
});

/**
 * GET / - Serve the main page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`💫 Mood Based Book Recommendor server running on http://localhost:${PORT}`);
    console.log(`Using Hugging Face model: ${HF_MODEL}`);
    if (!HF_API_KEY) {
        console.warn('⚠️  Warning: HF_API_KEY not found in .env file. AI features will use fallback.');
    }
});

