/**
 * Book Recommender - BookVault
 * Interactive book recommendation system
 */

let chatHistory = [];

// Book recommendations database by genre
const bookRecommendations = {
    fantasy: [
        "Harry Potter series by J.K. Rowling",
        "A Song of Ice and Fire by George R.R. Martin",
        "The Chronicles of Narnia by C.S. Lewis",
        "The Lord of the Rings by J.R.R. Tolkien",
        "The Hobbit by J.R.R. Tolkien",
        "Percy Jackson series by Rick Riordan",
        "The Name of the Wind by Patrick Rothfuss",
        "Mistborn series by Brandon Sanderson",
        "The Wheel of Time by Robert Jordan",
        "The Magicians by Lev Grossman",
        "Eragon by Christopher Paolini",
        "Throne of Glass by Sarah J. Maas"
    ],
    fiction: [
        "The Great Gatsby by F. Scott Fitzgerald",
        "To Kill a Mockingbird by Harper Lee",
        "1984 by George Orwell",
        "Pride and Prejudice by Jane Austen",
        "The Catcher in the Rye by J.D. Salinger",
        "The Kite Runner by Khaled Hosseini",
        "The Book Thief by Markus Zusak",
        "The Handmaid's Tale by Margaret Atwood"
    ],
    mystery: [
        "Sherlock Holmes by Arthur Conan Doyle",
        "And Then There Were None by Agatha Christie",
        "The Girl with the Dragon Tattoo by Stieg Larsson",
        "Gone Girl by Gillian Flynn",
        "The Da Vinci Code by Dan Brown",
        "Big Little Lies by Liane Moriarty"
    ],
    romance: [
        "Pride and Prejudice by Jane Austen",
        "The Notebook by Nicholas Sparks",
        "Me Before You by Jojo Moyes",
        "Outlander by Diana Gabaldon",
        "The Fault in Our Stars by John Green",
        "It Ends with Us by Colleen Hoover"
    ],
    scifi: [
        "Dune by Frank Herbert",
        "The Hitchhiker's Guide to the Galaxy by Douglas Adams",
        "Ender's Game by Orson Scott Card",
        "The Martian by Andy Weir",
        "Neuromancer by William Gibson",
        "Foundation by Isaac Asimov",
        "The Expanse series by James S.A. Corey"
    ],
    horror: [
        "It by Stephen King",
        "The Shining by Stephen King",
        "Dracula by Bram Stoker",
        "Frankenstein by Mary Shelley",
        "The Haunting of Hill House by Shirley Jackson",
        "Bird Box by Josh Malerman"
    ],
    biography: [
        "The Diary of a Young Girl by Anne Frank",
        "Steve Jobs by Walter Isaacson",
        "Educated by Tara Westover",
        "The Glass Castle by Jeannette Walls",
        "Born a Crime by Trevor Noah"
    ],
    history: [
        "Sapiens by Yuval Noah Harari",
        "Guns, Germs, and Steel by Jared Diamond",
        "A People's History of the United States by Howard Zinn",
        "The Immortal Life of Henrietta Lacks by Rebecca Skloot"
    ],
    philosophy: [
        "Meditations by Marcus Aurelius",
        "The Republic by Plato",
        "Thus Spoke Zarathustra by Friedrich Nietzsche",
        "The Art of War by Sun Tzu",
        "The Prince by Niccolò Machiavelli"
    ],
    poetry: [
        "The Collected Poems by Maya Angelou",
        "Leaves of Grass by Walt Whitman",
        "The Waste Land by T.S. Eliot",
        "Howl by Allen Ginsberg"
    ]
};

// Genre keywords mapping
const genreKeywords = {
    fantasy: ['harry potter', 'potter', 'game of thrones', 'narnia', 'lord of the rings', 'hobbit', 'fantasy', 'magic', 'wizard', 'witch', 'dragon', 'kingdom', 'quest', 'epic', 'mythical'],
    fiction: ['fiction', 'novel', 'story', 'literature', 'classic'],
    mystery: ['mystery', 'detective', 'crime', 'thriller', 'sherlock', 'murder', 'suspense'],
    romance: ['romance', 'love', 'romantic', 'relationship', 'dating'],
    scifi: ['sci-fi', 'science fiction', 'space', 'futuristic', 'dystopian', 'alien', 'robot', 'cyberpunk', 'technology'],
    horror: ['horror', 'scary', 'ghost', 'zombie', 'vampire', 'haunted', 'terror'],
    biography: ['biography', 'autobiography', 'memoir', 'life story', 'real life'],
    history: ['history', 'historical', 'war', 'past', 'ancient'],
    philosophy: ['philosophy', 'philosophical', 'wisdom', 'meaning', 'existential'],
    poetry: ['poetry', 'poem', 'verse', 'rhyme']
};

// Detect genre from user input
function detectGenre(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [genre, keywords] of Object.entries(genreKeywords)) {
        for (const keyword of keywords) {
            if (lowerMessage.includes(keyword)) {
                return genre;
            }
        }
    }
    
    return null;
}

// Get recommendations based on genre
function getRecommendationsByGenre(genre, count = 6) {
    const books = bookRecommendations[genre] || [];
    const shuffled = [...books].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Initialize Book Recommender
function initializeAIAssistant() {
    const aiToggle = document.getElementById('aiToggle');
    const aiChatWidget = document.getElementById('aiChatWidget');
    const aiMinimize = document.getElementById('aiMinimize');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiChatInput = document.getElementById('aiChatInput');
    
    if (!aiToggle || !aiChatWidget) return;
    
    // Toggle chat widget
    aiToggle.addEventListener('click', () => {
        const isVisible = aiChatWidget.style.display !== 'none';
        aiChatWidget.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && chatHistory.length === 0) {
            addAIMessage('assistant', 'Hello! I\'m your Book Recommender. Tell me what you like - for example, "I like Harry Potter movies" or "I enjoy mystery novels" - and I\'ll suggest great books for you to read! 📚');
        }
    });
    
    // Minimize
    if (aiMinimize) {
        aiMinimize.addEventListener('click', () => {
            aiChatWidget.style.display = 'none';
        });
    }
    
    // Send message
    if (aiSendBtn && aiChatInput) {
        const sendMessage = () => {
            const message = aiChatInput.value.trim();
            if (!message) return;
            
            addAIMessage('user', message);
            aiChatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Process message
            setTimeout(() => {
                hideTypingIndicator();
                const response = processAIMessage(message);
                addAIMessage('assistant', response);
            }, 1000 + Math.random() * 1000);
        };
        
        aiSendBtn.addEventListener('click', sendMessage);
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Add message to chat
function addAIMessage(role, message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${role}`;
    
    const messageText = document.createElement('div');
    messageText.className = 'ai-message-text';
    
    // Support for line breaks in messages
    messageText.innerHTML = message.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(messageText);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to history
    chatHistory.push({ role, message, timestamp: Date.now() });
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'aiTypingIndicator';
    typingDiv.className = 'ai-message ai-message-assistant ai-typing';
    typingDiv.innerHTML = '<div class="ai-message-text"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('aiTypingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Process message and generate recommendations
function processAIMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check if user is expressing a preference
    if (lowerMessage.includes('like') || lowerMessage.includes('love') || lowerMessage.includes('enjoy') || 
        lowerMessage.includes('interested') || lowerMessage.includes('prefer') || lowerMessage.includes('favorite')) {
        
        // Detect genre from message
        const detectedGenre = detectGenre(message);
        
        if (detectedGenre) {
            const recommendations = getRecommendationsByGenre(detectedGenre, 8);
            const genreName = detectedGenre.charAt(0).toUpperCase() + detectedGenre.slice(1).replace('scifi', 'Sci-Fi');
            
            let response = `Great! Since you enjoy ${genreName}, here are some excellent books you might love:\n\n`;
            
            recommendations.forEach((book, index) => {
                response += `${index + 1}. ${book}\n`;
            });
            
            response += `\nTry searching for any of these in BookVault to find and read them! You can also browse the "${genreName}" genre using the Browse Genres button.`;
            
            return response;
        } else {
            // No specific genre detected, ask for more details
            return 'That sounds interesting! Could you tell me more about what you like? For example:\n• "I like fantasy books"\n• "I enjoy mystery novels"\n• "I love Harry Potter"\n• "I\'m interested in science fiction"\n\nThis will help me suggest the perfect books for you!';
        }
    }
    
    // Check for specific book mentions
    const fantasyBooks = ['harry potter', 'game of thrones', 'narnia', 'lord of the rings'];
    for (const book of fantasyBooks) {
        if (lowerMessage.includes(book)) {
            const recommendations = getRecommendationsByGenre('fantasy', 8);
            let response = `If you like ${book.charAt(0).toUpperCase() + book.slice(1)}, you'll love these fantasy books:\n\n`;
            recommendations.forEach((rec, index) => {
                if (!rec.toLowerCase().includes(book)) {
                    response += `${index + 1}. ${rec}\n`;
                }
            });
            response += `\nSearch for these in BookVault to start reading!`;
            return response;
        }
    }
    
    // General recommendations request
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('what should')) {
        return 'I\'d love to recommend books! Tell me what you enjoy - for example:\n• "I like Harry Potter movies"\n• "I enjoy mystery novels"\n• "I love romantic stories"\n• "I\'m into science fiction"\n\nOr you can browse by genre using the "Browse Genres" button!';
    }
    
    // Book summaries
    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary') || lowerMessage.includes('what is')) {
        const bookMatch = message.match(/summarize\s+['"](.+?)['"]/i) || message.match(/what is\s+['"](.+?)['"]/i);
        if (bookMatch) {
            return `To get a summary of "${bookMatch[1]}", search for it in BookVault and click "View Details" to see the full description and reviews.`;
        }
        return 'I can help you find summaries! Search for a book title in BookVault, and click "View Details" to see its description. Which book would you like to learn about?';
    }
    
    // Themes
    if (lowerMessage.includes('theme') || lowerMessage.includes('about')) {
        return 'To learn about a book\'s themes, search for it in BookVault and click "View Details". The description and reviews discuss the main themes. Which book are you interested in?';
    }
    
    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
        return 'I\'m your Book Recommender! I can:\n• Suggest books based on what you like\n• Recommend books by genre\n• Help you discover new reads\n\nJust tell me what you enjoy, like "I like Harry Potter movies" or "I love mystery books", and I\'ll suggest great books for you!';
    }
    
    // Search assistance
    if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
        return 'Use the search bar at the top to find books by title, author, or keywords. You can also browse by genre using the "Browse Genres" dropdown!';
    }
    
    // Try to detect genre from any message
    const genre = detectGenre(message);
    if (genre) {
        const recommendations = getRecommendationsByGenre(genre, 6);
        const genreName = genre.charAt(0).toUpperCase() + genre.slice(1).replace('scifi', 'Sci-Fi');
        
        let response = `Here are some great ${genreName} books:\n\n`;
        recommendations.forEach((book, index) => {
            response += `${index + 1}. ${book}\n`;
        });
        response += `\nSearch for these in BookVault to find and read them!`;
        return response;
    }
    
    // Default response
    return 'I\'m here to recommend books! Tell me what you like - for example, "I like Harry Potter movies" or "I enjoy mystery novels" - and I\'ll suggest perfect books for you. You can also browse by genre using the "Browse Genres" button!';
}
