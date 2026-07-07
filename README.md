<<<<<<< HEAD
# VibeFlix - Plain HTML/CSS Movie App

A responsive, cinema-inspired movie discover website built with **pure HTML, CSS, and vanilla JavaScript**—no frameworks, no dependencies
 that fetches and displays real-time movie data from the TMDB API.


## Features

✨ **Cinematic Minimalism Design**
- Dark theme with vibrant red black accents
- Glowing hover effects on movie cards
- Smooth 300ms transitions and animations

🎬 **Responsive Layout**
- Mobile-first design (1 column on mobile)
- 2 columns on tablets
- 4+ columns on desktop
- Fully responsive grid using CSS Grid

🔍 **Search Functionality**
- Real-time search filtering by movie title and rating
- Beige glow effect on search input focus
- Empty state messaging

♿ **Accessibility**
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support (Ctrl+K to focus search)
- Respects `prefers-reduced-motion` preference

🎨 **Interactive Elements**
- All interactive elements have unique IDs for easy targeting
- Staggered card entrance animations (60ms delays)
- Smooth scale and translate effects on hover
- Overlay reveals title and rating on card hover

## File Structure

```
vibeflix-plain/
├── index.html       # Main HTML structure
├── styles.css       # All styling and animations
├── script.js        # Vanilla JavaScript functionality
└── README.md        # This file
```

## Quick Start

### Option 1: Open Directly in Browser
Simply open `index.html` in your web browser:
```bash
open index.html
# or
firefox index.html
# or double-click the file
```

### Option 2: Local Server (Recommended)
For best results with image loading, use a local server:

**Using Python 3:**
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
# Then visit http://localhost:8000
```

**Using Node.js (http-server):**
```bash
npx http-server
# Then visit http://localhost:8080
```

**Using PHP:**
```bash
php -S localhost:8000
# Then visit http://localhost:8000
```

## Customization




### Add More Movies
Edit the `MOVIES` array in `script.js`:
```javascript
const MOVIES = [
    {
        id: 'movie-9',
        title: 'Your Movie Title',
        rating: '8.5/10',
        poster: 'path/to/poster.jpg',
    },
    // ... more movies
];
```

### Adjust Animation Speed
Modify the transition variables in `styles.css`:
```css
--transition-fast: 200ms;      /* Fast animations */
--transition-normal: 300ms;    /* Normal animations */
```

## Interactive Element IDs

All interactive elements have unique IDs for easy JavaScript targeting:

| Element | ID | Purpose |
|---------|----|---------| 
| App Title | `#app-title` | Main heading |
| Logo | `#header-logo` | VibeFlix logo |
| Search Input | `#search-input` | Movie search box |
| Search Icon | `#search-icon` | Magnifying glass icon |
| Movie Grid | `#movies-grid` | Container for all cards |
| Movie Cards | `#movie-{id}` | Individual movie cards |
| Rating Badges | `#rating-{id}` | Rating display per card |
| No Results | `#no-results-container` | Empty state container |

## Keyboard Shortcuts

- **Ctrl+K** (Windows/Linux) or **Cmd+K** (Mac): Focus search input

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ⚠️ Limited support (no CSS Grid, no aspect-ratio)

## Performance

- **Zero dependencies** - No npm packages required
- **Lightweight** - ~15KB total (HTML + CSS + JS)
- **Fast loading** - Lazy-loaded images with `loading="lazy"`
- **Smooth animations** - GPU-accelerated transforms and opacity

## Accessibility Features

- Semantic HTML5 elements (`<header>`, `<main>`, `<article>`)
- ARIA labels on form inputs
- Focus-visible styles for keyboard navigation
- Respects user's motion preferences (`prefers-reduced-motion`)
- High contrast dark theme (WCAG AA compliant)

## License

Free to use and modify for any purpose.

## Notes

- Movie poster images are loaded from external URLs
- For offline use, download the images and update the `poster` paths in `script.js`
- The app uses CSS Grid which requires modern browsers (IE 11 not supported)
- All animations respect the user's `prefers-reduced-motion` setting for accessibility

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
=======
# Vibeflix
A responsive movie streaming website built with HTML, CSS, and JavaScript, featuring real-time movie data fetched from the TMDB API. The project showcases dynamic content rendering, API integration, search functionality, and a clean, user-friendly interface developed through vibe coding.
>>>>>>> 424ad151d85c788d71fd2ad2da655f6a5d7d44e6
