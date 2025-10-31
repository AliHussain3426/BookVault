# 📚 Livre Verse - Your Digital Library

A beautiful, modern web application for discovering and exploring books from multiple free APIs. Search by title, author, keyword, or browse by genre to find your next great read!

## ✨ Features

- **🔍 Search Books** - Search across thousands of books by title, author, or keyword
- **📚 Browse by Genre** - Explore 12 different genres including Fiction, Mystery, Romance, Sci-Fi, Fantasy, and more
- **⭐ Ratings Display** - View book ratings and reviews
- **🖼️ Book Covers** - See beautiful book cover images
- **📖 Free Books** - Access 75,000+ free books from Project Gutenberg
- **📱 Responsive Design** - Works beautifully on mobile, tablet, and desktop
- **🚀 Zero Dependencies** - Pure vanilla JavaScript, no frameworks required

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Local Server (Recommended)

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then open `http://localhost:8000` in your browser.

### Option 3: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📁 Project Structure

```
livre-verse/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── api.js             # API integration (Google Books, Open Library, Gutendex)
│   ├── app.js             # Main application logic
│   └── utils.js           # Utility functions
├── README.md              # This file
├── QUICK_START.md         # Quick start guide
├── PROJECT_SUMMARY.md     # Complete project details
├── CURSOR_GUIDE.md        # Cursor IDE development guide
└── API_DOCUMENTATION.md   # Complete API reference
```

## 🔌 APIs Used

1. **Google Books API** - Extensive catalog with ratings and reviews
2. **Open Library API** - 3M+ books from Internet Archive
3. **Gutendex API** - 75,000+ free Project Gutenberg books

All APIs are free and require no API keys!

## 🎯 Usage

### Search for Books
1. Type a book title, author, or keyword in the search box
2. Click "Search" or press Enter
3. Browse through the results

### Browse by Genre
1. Click any genre button (Fiction, Mystery, Romance, etc.)
2. Explore books in that category
3. Click "Free Books" for access to Project Gutenberg titles

### View Book Details
- Click "Preview" or "View Details" on any book card
- Opens the book in a new tab

## 🛠️ Customization

### Change Colors
Edit `css/styles.css` and modify the CSS variables:

```css
:root {
    --primary-color: #667eea;    /* Change to your color */
    --secondary-color: #764ba2;  /* Change to your color */
}
```

### Add More Genres
Edit `index.html` and add a new button:

```html
<button class="genre-btn" onclick="searchByGenre('your-genre')">Your Genre</button>
```

### Modify Book Display
Edit `js/app.js` in the `createBookCard()` function to customize how books are displayed.

## 📝 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 steps
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
- **[CURSOR_GUIDE.md](CURSOR_GUIDE.md)** - Development guide for Cursor IDE
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Detailed API reference
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 🌟 Features in Detail

### Search Functionality
- Searches across all three APIs simultaneously
- Removes duplicate results automatically
- Displays up to 60 books per search (20 from each API)

### Genre Browsing
- 12 predefined genres
- Special "Free Books" category for Project Gutenberg
- Quick access to popular book categories

### Book Display
- Beautiful card-based layout
- Book cover images with fallback placeholders
- Star ratings (when available)
- Truncated descriptions
- Direct links to preview/read books

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Clean, minimalist interface
- Accessible and user-friendly

## 🔧 Technical Details

- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies**: Pure vanilla JavaScript
- **APIs**: RESTful APIs (no authentication required)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 📊 Project Stats

- **Files**: 8 core files
- **Lines of Code**: ~1,500+
- **Size**: ~140 KB
- **APIs**: 3 free book APIs
- **Zero Setup**: Works immediately

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- **Google Books API** - For the extensive book catalog
- **Open Library** - For the Internet Archive book collection
- **Project Gutenberg** - For 75,000+ free books
- **Gutendex** - For the Project Gutenberg API

## 💡 Future Enhancements

Potential features for future development:
- Dark mode toggle
- Favorites/bookmarking (localStorage)
- Advanced filtering (by year, rating, language)
- Pagination for large result sets
- Book details modal
- Reading progress tracking
- Social sharing features

## 🐛 Known Issues

- Some books may not have cover images (placeholders are shown)
- Ratings are only available from Google Books
- Large result sets may take a few seconds to load

## 📞 Support

If you encounter any issues or have questions:
1. Check the documentation files
2. Review the code comments
3. Open an issue if needed

---

**Made with ❤️ for book lovers everywhere**

*Enjoy exploring the world of books with Livre Verse!* 📚✨


