/**
 * Mood Based Book Recommendor - Frontend
 * Interactive mood-based book recommendation system
 */

let chatHistory = [];
let moodHistory = []; // Store last 3 moods

// Initialize Mood Based Book Recommendor
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
            addAIMessage('assistant', 'Hello! I\'m your 💫 Mood Based Book Recommendor! Tell me how you\'re feeling or what mood you\'re in (like "happy", "romantic", "adventurous", "mysterious"), and I\'ll recommend perfect books for you! 📚✨');
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
        const sendMessage = async () => {
            const message = aiChatInput.value.trim();
            if (!message) return;
            
            addAIMessage('user', message);
            aiChatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                // Determine backend URL (use same origin if possible, otherwise default to 3000)
                const backendUrl = window.location.origin.includes('8000') 
                    ? 'http://localhost:3000' 
                    : window.location.origin;
                
                // Call backend API
                const response = await fetch(`${backendUrl}/api/recommend`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userInput: message,
                        mood: null // Let backend detect mood
                    })
                });

                hideTypingIndicator();

                if (!response.ok) {
                    throw new Error('Failed to get recommendations');
                }

                const data = await response.json();
                
                // Store mood in history
                if (data.mood && !moodHistory.includes(data.mood)) {
                    moodHistory.push(data.mood);
                    if (moodHistory.length > 3) {
                        moodHistory.shift(); // Keep only last 3
                    }
                }

                // Display recommendations
                displayRecommendations(data);

            } catch (error) {
                hideTypingIndicator();
                console.error('Error:', error);
                addAIMessage('assistant', 'Sorry, I encountered an error. Please make sure the backend server is running on http://localhost:3000. You can try again or use fallback recommendations!');
                
                // Fallback recommendations
                const fallbackResponse = processFallbackRecommendation(message);
                addAIMessage('assistant', fallbackResponse);
            }
        };
        
        aiSendBtn.addEventListener('click', sendMessage);
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

/**
 * Display book recommendations in chat
 */
function displayRecommendations(data) {
    const { mood, recommendations, message } = data;

    // Add mood-based message
    let responseText = `Based on your ${mood} mood, here are some great recommendations:\n\n`;
    
    // Show mood history context if available
    if (moodHistory.length > 1) {
        responseText += `Since you've been interested in ${moodHistory.slice(0, -1).join(', ')} moods, `;
    }

    recommendations.forEach((book, index) => {
        responseText += `${index + 1}. **${book.title}**\n`;
        responseText += `   by ${book.author}\n`;
        
        // Truncate description
        const shortDesc = book.description.length > 150 
            ? book.description.substring(0, 150) + '...' 
            : book.description;
        responseText += `   ${shortDesc}\n\n`;
    });

    responseText += `\nClick on any book in the search results to learn more! You can also search for these titles in BookVault.`;

    addAIMessage('assistant', responseText);

    // Also trigger a search in the main app to show books
    if (recommendations.length > 0) {
        triggerBookSearch(recommendations);
    }
}

/**
 * Trigger search in main app to display books
 */
function triggerBookSearch(recommendations) {
    // Search for the first book title to show results
    if (recommendations[0] && typeof performSearch === 'function') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = recommendations[0].title;
            // Small delay to let the message display first
            setTimeout(() => {
                if (typeof handleSearch === 'function') {
                    handleSearch();
                }
            }, 500);
        }
    }
}

/**
 * Fallback recommendation system (if API fails)
 */
function processFallbackRecommendation(message) {
    const lowerMessage = message.toLowerCase();
    
    const fallbackMoods = {
        happy: ['The Hitchhiker\'s Guide to the Galaxy', 'The Princess Bride', 'Good Omens'],
        sad: ['The Book Thief', 'The Kite Runner', 'A Man Called Ove'],
        romantic: ['Pride and Prejudice', 'The Notebook', 'Me Before You'],
        adventurous: ['The Lord of the Rings', 'Jurassic Park', 'The Hunger Games'],
        mysterious: ['And Then There Were None', 'Gone Girl', 'The Girl with the Dragon Tattoo'],
        thoughtful: ['1984', 'The Great Gatsby', 'To Kill a Mockingbird']
    };

    for (const [mood, books] of Object.entries(fallbackMoods)) {
        if (lowerMessage.includes(mood)) {
            return `Here are some ${mood} mood book recommendations:\n\n${books.map((b, i) => `${i+1}. ${b}`).join('\n')}\n\nSearch for these in BookVault!`;
        }
    }

    return 'I understand! Try describing your mood more specifically - like "happy", "romantic", "adventurous", or "mysterious" - and I\'ll find the perfect books for you!';
}

// Add message to chat
function addAIMessage(role, message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${role}`;
    
    const messageText = document.createElement('div');
    messageText.className = 'ai-message-text';
    
    // Convert markdown-style bold to HTML
    let formattedMessage = message.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formattedMessage = formattedMessage.replace(/\n/g, '<br>');
    
    messageText.innerHTML = formattedMessage;
    
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
