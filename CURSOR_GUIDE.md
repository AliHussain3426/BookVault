# 🎯 Cursor IDE Development Guide - Livre Verse

A comprehensive guide for developing and customizing Livre Verse using Cursor IDE.

## 🚀 Getting Started in Cursor

### Opening the Project

1. **Open Cursor IDE**
2. **File → Open Folder**
3. Navigate to the `livre-verse` folder
4. Click "Select Folder"

### Project Structure in Cursor

```
livre-verse/
├── index.html          ← Main entry point
├── css/
│   └── styles.css     ← All styling
└── js/
    ├── api.js         ← API calls
    ├── app.js         ← Main logic
    └── utils.js       ← Utilities
```

## 💡 Using Cursor AI Features

### Quick Customizations with AI

**Change Colors:**
```
@styles.css "Change the primary color to #FF6B6B"
```

**Add a New Genre:**
```
@index.html "Add a Horror genre button"
```

**Modify Book Display:**
```
@app.js "Add publication date to book cards"
```

**Add Dark Mode:**
```
@styles.css "Add a dark mode color scheme"
```

## 🔧 Common Development Tasks

### 1. Adding a New Genre

**Location**: `index.html` (around line 47)

**Steps**:
1. Find the genre buttons section
2. Add a new button:
```html
<button class="genre-btn" onclick="searchByGenre('new-genre')">New Genre</button>
```

3. The `searchByGenre()` function in `app.js` will handle it automatically

### 2. Changing the Color Scheme

**Location**: `css/styles.css` (lines 3-12)

**Edit CSS Variables**:
```css
:root {
    --primary-color: #667eea;    /* Your color */
    --secondary-color: #764ba2;  /* Your color */
    --accent-color: #f093fb;     /* Your color */
}
```

**Tip**: Use Cursor's color picker by hovering over hex codes!

### 3. Modifying Book Card Layout

**Location**: `js/app.js` → `createBookCard()` function

**What you can customize**:
- Field order
- Which fields to show/hide
- Styling classes
- Additional information

**Example - Add publication year**:
```javascript
// In createBookCard(), after author:
if (book.publishedDate) {
    const dateElement = document.createElement('p');
    dateElement.className = 'book-date';
    dateElement.textContent = book.publishedDate;
    infoDiv.appendChild(dateElement);
}
```

### 4. Adding Dark Mode

**Step 1**: Add toggle button in `index.html`:
```html
<button id="darkModeToggle" class="dark-mode-toggle">🌙</button>
```

**Step 2**: Add dark mode styles in `css/styles.css`:
```css
[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --card-bg: #2d2d2d;
    /* ... more colors */
}
```

**Step 3**: Add toggle logic in `js/app.js`:
```javascript
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
});
```

**Ask Cursor**: "Add a dark mode toggle to Livre Verse"

### 5. Adding Favorites Feature

**Step 1**: Create favorites storage:
```javascript
// In app.js
function saveFavorite(book) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites.push(book);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
```

**Step 2**: Add favorite button to book cards:
```javascript
// In createBookCard()
const favBtn = document.createElement('button');
favBtn.textContent = '❤️';
favBtn.onclick = () => saveFavorite(book);
```

**Ask Cursor**: "Add a favorites feature using localStorage"

## 🔍 Understanding the Codebase

### File Responsibilities

**index.html**
- Structure and layout
- User interface elements
- Event handlers (onclick)

**css/styles.css**
- All visual styling
- Responsive breakpoints
- Animations and transitions
- CSS variables for theming

**js/api.js**
- API endpoint URLs
- Fetch requests
- Data transformation
- Error handling for APIs

**js/app.js**
- DOM manipulation
- Event listeners
- Search orchestration
- UI updates
- Book card creation

**js/utils.js**
- Helper functions
- Formatting utilities
- Validation functions
- Common operations

## 🛠️ Debugging in Cursor

### Using Cursor's Debugger

1. **Set Breakpoints**: Click line numbers in Cursor
2. **Debug Console**: View `console.log()` output
3. **Browser DevTools**: Right-click → "Inspect" in browser

### Common Issues & Solutions

**API not returning results?**
- Check browser console (F12)
- Verify internet connection
- Check API status (APIs may be down)

**Styling not updating?**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check CSS file path

**JavaScript errors?**
- Check browser console
- Verify all JS files loaded
- Check for syntax errors

## 📦 Adding New Features

### Example: Add Pagination

**Ask Cursor**:
```
Add pagination to show 20 books per page with Previous/Next buttons
```

**Or manually**:

1. **Track page state** in `app.js`:
```javascript
let currentPage = 1;
const booksPerPage = 20;
```

2. **Add pagination UI** in `index.html`:
```html
<div class="pagination">
    <button id="prevBtn">Previous</button>
    <span id="pageInfo">Page 1</span>
    <button id="nextBtn">Next</button>
</div>
```

3. **Implement pagination logic** in `app.js`

## 🎨 Styling Tips

### Using Cursor's CSS Features

- **Color Picker**: Hover over hex codes
- **Autocomplete**: CSS properties and values
- **Format**: Right-click → "Format Document"

### CSS Variables

All colors use CSS variables for easy theming:
```css
:root {
    --primary-color: #667eea;
}
```

Change once, applies everywhere!

## 🚀 Deployment from Cursor

### Option 1: GitHub Pages

1. **Initialize Git** (in Cursor terminal):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Push to GitHub**:
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

3. **Enable GitHub Pages** in repo settings

### Option 2: Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
netlify deploy
```

3. **Or drag & drop** `index.html` at netlify.com

## 💬 Asking Cursor AI

### Effective Prompts

**Specific**:
❌ "Make it better"
✅ "Change the book card layout to show rating first, then title"

**Context-aware**:
❌ "Add search"
✅ "Add a search filter for books published after 2020"

**Incremental**:
❌ "Build a social network"
✅ "Add a share button that copies the book title and link"

### Example Prompts

```
"Add a loading skeleton animation while books are loading"
```

```
"Create a modal that shows full book details when clicking a book card"
```

```
"Add a filter dropdown to sort books by rating, title, or date"
```

```
"Make the genre buttons show a count of available books"
```

## 📚 Learning Resources

### Understanding the Code

- **ES6 Features**: Arrow functions, async/await, destructuring
- **Fetch API**: Making HTTP requests
- **DOM API**: Creating and manipulating elements
- **CSS Grid**: Layout system
- **LocalStorage**: Client-side storage

### Cursor Features

- **AI Chat**: Ask questions about code
- **Code Completion**: AI-powered autocomplete
- **Refactor**: Right-click → "Refactor"
- **Go to Definition**: Ctrl+Click
- **Find References**: Right-click → "Find All References"

## 🎯 Quick Reference

### Key Functions

- `searchAllBooks(query)` - Search across all APIs
- `searchByGenre(genre)` - Search by genre
- `displayBooks(books, title)` - Render books
- `createBookCard(book)` - Create single book card
- `formatRating(rating)` - Format star rating

### Important Classes

- `.book-card` - Individual book container
- `.books-container` - Grid container
- `.genre-btn` - Genre button
- `.search-input` - Search field

## 🐛 Common Modifications

### Change Max Results
**File**: `js/api.js`
**Change**: `maxResults: 20` to your desired number

### Change Grid Columns
**File**: `css/styles.css`
**Change**: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`

### Add New API
**File**: `js/api.js`
**Add**: New async function following existing patterns

---

**Happy coding with Cursor!** 🚀

For more details, see other documentation files or ask Cursor AI for help!


