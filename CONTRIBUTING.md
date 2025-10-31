# 🤝 Contributing to Livre Verse

Thank you for your interest in contributing to Livre Verse! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submission Guidelines](#submission-guidelines)
- [Style Guide](#style-guide)
- [Testing](#testing)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Keep discussions on-topic

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- A code editor (Cursor IDE, VS Code, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Fork and Clone

1. Fork the repository (if applicable)
2. Clone your fork:
```bash
git clone https://github.com/your-username/livre-verse.git
cd livre-verse
```

## 🛠️ Development Setup

### Local Development

1. **Open the project** in your code editor
2. **Start a local server**:
   ```bash
   python -m http.server 8000
   ```
3. **Open** `http://localhost:8000` in your browser
4. **Make changes** and refresh to see updates

### Project Structure

```
livre-verse/
├── index.html          # Main HTML file
├── css/
│   └── styles.css     # All styles
├── js/
│   ├── api.js         # API integration
│   ├── app.js         # Main logic
│   └── utils.js       # Utilities
└── docs/              # Documentation
```

## 📝 Making Changes

### Types of Contributions

We welcome:
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔧 Code refactoring
- 🌐 Translations

### Development Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow the style guide
   - Add comments for complex logic
   - Test your changes

3. **Test thoroughly**:
   - Test in multiple browsers
   - Test on mobile devices
   - Check for console errors
   - Verify all features work

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push and create a pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📐 Style Guide

### HTML

- Use semantic HTML5 elements
- Include alt text for images
- Maintain consistent indentation (2 spaces)
- Use double quotes for attributes

```html
<!-- Good -->
<div class="book-card">
    <img src="cover.jpg" alt="Book cover">
</div>

<!-- Bad -->
<div class=book-card><img src='cover.jpg'></div>
```

### CSS

- Use CSS variables for colors
- Follow BEM naming when possible
- Use flexbox/grid for layout
- Keep selectors specific but not overly nested

```css
/* Good */
.book-card {
    background: var(--card-bg);
    border-radius: var(--radius);
}

/* Bad */
.book-card div p span {
    color: red;
}
```

### JavaScript

- Use ES6+ features (arrow functions, async/await)
- Use `const` and `let`, avoid `var`
- Write descriptive function names
- Add JSDoc comments for functions

```javascript
// Good
async function searchBooks(query) {
    try {
        const results = await fetch(url);
        return await results.json();
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

// Bad
function search(q) {
    fetch(url).then(r => r.json()).then(d => d);
}
```

### File Organization

- Keep files focused on single responsibility
- Group related functions together
- Use comments to separate sections
- Maintain consistent formatting

## ✅ Testing

### Manual Testing Checklist

Before submitting:
- [ ] Test search functionality
- [ ] Test genre browsing
- [ ] Test on desktop browser
- [ ] Test on mobile device
- [ ] Check console for errors
- [ ] Verify images load (or show placeholders)
- [ ] Test with slow internet connection
- [ ] Verify accessibility (keyboard navigation)

### Browser Testing

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 📤 Submission Guidelines

### Pull Request Process

1. **Update documentation** if needed
2. **Write clear commit messages**:
   ```
   Add dark mode toggle feature
   
   - Added dark mode button in header
   - Created dark theme CSS variables
   - Implemented localStorage persistence
   ```

3. **Describe your changes**:
   - What changed?
   - Why did you make these changes?
   - How was it tested?

4. **Keep PRs focused**: One feature/bug fix per PR

### What Makes a Good Contribution

✅ **Good Contributions:**
- Clear, readable code
- Well-documented
- Tested thoroughly
- Follows style guide
- Solves a real problem
- Doesn't break existing features

❌ **Avoid:**
- Code that's hard to understand
- Changes that break existing features
- Style inconsistencies
- Untested code
- Mixing multiple unrelated changes

## 🎯 Suggested Contributions

### Easy (Good for First Timers)

- Fix typos in documentation
- Improve CSS styling
- Add more genres
- Enhance error messages
- Add loading animations

### Medium

- Add dark mode
- Implement favorites/bookmarks
- Add pagination
- Create book details modal
- Add search filters

### Advanced

- Add user authentication
- Implement backend integration
- Add social sharing
- Create reading progress tracking
- Add book recommendations

## 📚 Documentation

When adding features:
- Update `README.md` if needed
- Add code comments
- Update relevant docs
- Include usage examples

## 🐛 Reporting Bugs

When reporting bugs, include:
- Browser and version
- Steps to reproduce
- Expected vs. actual behavior
- Console errors (if any)
- Screenshots (if applicable)

## 💡 Feature Requests

For feature requests:
- Describe the feature clearly
- Explain the use case
- Suggest implementation approach
- Consider edge cases

## 🔍 Code Review

Your code will be reviewed for:
- Functionality and correctness
- Code quality and style
- Performance implications
- Browser compatibility
- Accessibility

## 📞 Getting Help

- Check existing documentation
- Review code comments
- Ask questions in issues/PRs
- Use Cursor AI for assistance

## 🙏 Recognition

Contributors will be:
- Listed in project credits
- Acknowledged in release notes
- Thanked for their efforts

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Livre Verse!** 🎉

Your efforts help make this project better for everyone. Happy coding! 🚀


