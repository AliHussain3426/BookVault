# 📚 API Documentation - Livre Verse

Complete reference for all APIs used in Livre Verse.

## 🔌 Overview

Livre Verse integrates with three free, public book APIs:
1. Google Books API
2. Open Library API
3. Gutendex API (Project Gutenberg)

**All APIs are free and require no authentication!**

---

## 1. Google Books API

### Base Information
- **URL**: `https://www.googleapis.com/books/v1/volumes`
- **Documentation**: https://developers.google.com/books/docs/v1/using
- **Authentication**: None required
- **Rate Limit**: 1,000 requests/day (generous)
- **Response Format**: JSON

### Search Endpoint

**URL Pattern:**
```
GET https://www.googleapis.com/books/v1/volumes?q={query}&maxResults={num}
```

**Parameters:**
- `q` (required): Search query (title, author, ISBN, etc.)
- `maxResults` (optional): Number of results (default: 10, max: 40)
- `startIndex` (optional): Start position for pagination

**Example Request:**
```javascript
fetch('https://www.googleapis.com/books/v1/volumes?q=harry+potter&maxResults=20')
```

### Response Structure

```json
{
  "items": [
    {
      "id": "book-id",
      "volumeInfo": {
        "title": "Book Title",
        "authors": ["Author Name"],
        "description": "Book description...",
        "imageLinks": {
          "thumbnail": "https://...",
          "smallThumbnail": "https://..."
        },
        "averageRating": 4.5,
        "ratingsCount": 1234,
        "publishedDate": "2001",
        "pageCount": 320,
        "categories": ["Fiction"],
        "language": "en",
        "previewLink": "https://books.google.com/...",
        "infoLink": "https://books.google.com/..."
      }
    }
  ],
  "totalItems": 1000
}
```

### Data Mapping

| Google Books Field | Livre Verse Field | Notes |
|-------------------|-------------------|-------|
| `volumeInfo.title` | `title` | Required |
| `volumeInfo.authors[]` | `authors[]` | Array |
| `volumeInfo.description` | `description` | May be HTML |
| `volumeInfo.imageLinks.thumbnail` | `thumbnail` | URL to cover |
| `volumeInfo.averageRating` | `rating` | 0-5 scale |
| `volumeInfo.ratingsCount` | `ratingCount` | Number |
| `volumeInfo.publishedDate` | `publishedDate` | Year or date |
| `volumeInfo.pageCount` | `pageCount` | Number |
| `volumeInfo.categories[]` | `categories[]` | Array |
| `volumeInfo.previewLink` | `previewLink` | Google preview |
| `volumeInfo.infoLink` | `infoLink` | Book info page |

### Features
- ✅ Ratings and reviews
- ✅ High-quality cover images
- ✅ Detailed descriptions
- ✅ Preview links
- ✅ Extensive metadata

### Limitations
- Some books may not have covers
- Not all books have ratings
- Descriptions may be truncated

---

## 2. Open Library API

### Base Information
- **URL**: `https://openlibrary.org/search.json`
- **Documentation**: https://openlibrary.org/developers/api
- **Authentication**: None required
- **Rate Limit**: None specified (be respectful)
- **Response Format**: JSON

### Search Endpoint

**URL Pattern:**
```
GET https://openlibrary.org/search.json?q={query}&limit={num}
```

**Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results (default: 10, max: 100)

**Example Request:**
```javascript
fetch('https://openlibrary.org/search.json?q=harry+potter&limit=20')
```

### Response Structure

```json
{
  "docs": [
    {
      "key": "/works/OL82563W",
      "title": "Book Title",
      "author_name": ["Author Name"],
      "first_sentence": ["First sentence..."],
      "cover_i": 1234567,
      "first_publish_year": 2001,
      "number_of_pages_median": 320,
      "subject": ["Fiction", "Fantasy"],
      "language": ["eng"],
      "isbn": ["1234567890"]
    }
  ],
  "numFound": 1000
}
```

### Cover Images

Open Library covers are accessed separately:

```
https://covers.openlibrary.org/b/id/{cover_i}-L.jpg
```

Where `cover_i` is the cover ID from the search response.

- `-S.jpg`: Small (thumbnail)
- `-M.jpg`: Medium
- `-L.jpg`: Large

### Data Mapping

| Open Library Field | Livre Verse Field | Notes |
|-------------------|-------------------|-------|
| `title` | `title` | Required |
| `author_name[]` | `authors[]` | Array of strings |
| `first_sentence[0]` | `description` | First sentence only |
| `cover_i` | `thumbnail` | Construct URL from ID |
| N/A | `rating` | Not available |
| `first_publish_year` | `publishedDate` | Year only |
| `number_of_pages_median` | `pageCount` | May be null |
| `subject[]` | `categories[]` | Array |
| `language[0]` | `language` | First language |
| `key` | `infoLink` | Construct URL: `https://openlibrary.org{key}` |

### Features
- ✅ 3M+ books in catalog
- ✅ Cover images (when available)
- ✅ Extensive metadata
- ✅ Work keys for linking

### Limitations
- No ratings/reviews
- Descriptions limited to first sentence
- Some books lack cover images
- Metadata may be incomplete

---

## 3. Gutendex API (Project Gutenberg)

### Base Information
- **URL**: `https://gutendex.com/books`
- **Documentation**: https://gutendex.com/
- **Authentication**: None required
- **Rate Limit**: None specified (be respectful)
- **Response Format**: JSON

### Search Endpoint

**URL Pattern:**
```
GET https://gutendex.com/books/?search={query}&limit={num}
```

**Parameters:**
- `search` (optional): Search query
- `limit` (optional): Number of results (default: 32, max: 32)
- `page` (optional): Page number for pagination

**Example Request:**
```javascript
fetch('https://gutendex.com/books/?search=shakespeare&limit=20')
```

### Response Structure

```json
{
  "results": [
    {
      "id": 12345,
      "title": "Book Title",
      "authors": [
        {
          "name": "Author Name",
          "birth_year": 1564,
          "death_year": 1616
        }
      ],
      "subjects": ["Fiction", "Drama"],
      "languages": ["en"],
      "download_count": 1234,
      "formats": {
        "image/jpeg": "https://www.gutenberg.org/...",
        "text/html": "https://www.gutenberg.org/...",
        "text/plain; charset=utf-8": "https://..."
      }
    }
  ],
  "count": 1000,
  "next": "https://gutendex.com/books/?page=2"
}
```

### Data Mapping

| Gutendex Field | Livre Verse Field | Notes |
|----------------|-------------------|-------|
| `title` | `title` | Required |
| `authors[].name` | `authors[]` | Extract names |
| N/A | `description` | Not available |
| `formats['image/jpeg']` | `thumbnail` | May be null |
| N/A | `rating` | Not available |
| `published` | `publishedDate` | May be null |
| N/A | `pageCount` | Not available |
| `subjects[]` | `categories[]` | Array |
| `languages[0]` | `language` | First language |
| `formats['text/html']` | `previewLink` | HTML version |
| `id` | `infoLink` | Construct: `https://www.gutenberg.org/ebooks/{id}` |

### Features
- ✅ 75,000+ free books
- ✅ No copyright restrictions
- ✅ Download counts
- ✅ Multiple file formats
- ✅ Classic literature

### Limitations
- No ratings/reviews
- No descriptions
- Limited modern books
- Cover images not always available

---

## 🔄 Implementation Details

### Search Function

**Location**: `js/api.js`

**Function**: `searchAllBooks(query, source = 'all')`

**Behavior:**
- Searches all three APIs in parallel
- Uses `Promise.allSettled()` for error handling
- Combines results into single array
- Removes duplicates

**Code Example:**
```javascript
async function searchAllBooks(query, source = 'all') {
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
    // Combine and deduplicate...
}
```

### Data Normalization

All three APIs return different formats. The code normalizes them into a common structure:

```javascript
{
    id: string,
    title: string,
    authors: string[],
    description: string,
    thumbnail: string,
    rating: number | null,
    ratingCount: number,
    publishedDate: string,
    pageCount: number,
    categories: string[],
    language: string,
    previewLink: string,
    infoLink: string,
    source: string
}
```

### Error Handling

Each API function:
- Wraps requests in try-catch
- Returns empty array on error
- Logs errors to console
- Continues with other APIs if one fails

---

## 📊 API Comparison

| Feature | Google Books | Open Library | Gutendex |
|---------|-------------|--------------|----------|
| **Books** | Millions | 3M+ | 75K+ |
| **Ratings** | ✅ Yes | ❌ No | ❌ No |
| **Covers** | ✅ Yes | ✅ Yes | ⚠️ Limited |
| **Descriptions** | ✅ Yes | ⚠️ Limited | ❌ No |
| **Free Books** | ⚠️ Limited | ⚠️ Some | ✅ All |
| **Modern Books** | ✅ Yes | ✅ Yes | ❌ No |
| **Classics** | ✅ Yes | ✅ Yes | ✅ Yes |
| **API Speed** | Fast | Medium | Fast |
| **Reliability** | High | High | High |

---

## 🛠️ Customization

### Adding a New API

1. **Create search function** in `js/api.js`:
```javascript
async function searchNewAPI(query, maxResults = 20) {
    try {
        const url = `https://api.example.com/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        return data.items.map(item => ({
            id: item.id,
            title: item.title,
            // ... normalize to common format
            source: 'New API'
        }));
    } catch (error) {
        console.error('Error searching New API:', error);
        return [];
    }
}
```

2. **Add to searchAllBooks()**:
```javascript
if (source === 'all' || source === 'newapi') {
    searchPromises.push(searchNewAPI(query));
}
```

3. **Test thoroughly!**

---

## 📝 Best Practices

### Rate Limiting
- Don't spam APIs
- Cache results when possible
- Use debouncing for search

### Error Handling
- Always wrap API calls in try-catch
- Handle network errors gracefully
- Provide fallbacks for missing data

### Data Validation
- Check for null/undefined values
- Validate URLs before using
- Sanitize user input

---

## 🔗 Useful Links

- **Google Books API**: https://developers.google.com/books/docs/v1/using
- **Open Library API**: https://openlibrary.org/developers/api
- **Gutendex**: https://gutendex.com/
- **Project Gutenberg**: https://www.gutenberg.org/

---

**All APIs are free and open. Enjoy exploring!** 📚✨


