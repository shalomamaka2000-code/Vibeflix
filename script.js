// script.js

// ============================================
// 1. CONFIGURATION
// ============================================
const TMDB_CONFIG = {
    API_KEY: '8c7e310b6c30c6f4538beb995bc13e57', // Replace with your actual API key
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
    POSTER_SIZES: {
        SMALL: 'w185',
        MEDIUM: 'w342',
        LARGE: 'w500',
        ORIGINAL: 'original'
    },
    DEFAULT_POSTER: 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster'
};

// ============================================
// 2. DOM REFERENCES
// ============================================
const DOM = {
    searchInput: document.getElementById('search-input'),
    moviesGrid: document.getElementById('movies-grid'),
    noResultsContainer: document.getElementById('no-results-container'),
    noResultsText: document.getElementById('no-results'),
    appTitle: document.getElementById('app-title'),
    headerLogo: document.getElementById('header-logo')
};

// ============================================
// 3. STATE MANAGEMENT
// ============================================
const State = {
    currentPage: 1,
    totalPages: 0,
    currentQuery: '',
    isLoading: false,
    movies: [],
    selectedMovie: null
};

// ============================================
// 4. API FUNCTIONS
// ============================================
class TMDbAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = TMDB_CONFIG.BASE_URL;
    }

    

    async searchMovies(query, page = 1) {
        if (!query.trim()) {
            return this.getPopularMovies(page);
        }

        try {
            const response = await fetch(
                `${this.baseURL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }

    async getPopularMovies(page = 1) {
        try {
            const response = await fetch(
                `${this.baseURL}/movie/popular?api_key=${this.apiKey}&page=${page}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            throw error;
        }
    }

    async getMovieDetails(movieId) {
        try {
            const response = await fetch(
                `${this.baseURL}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits,videos,similar`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    }

    async getTrendingMovies(timeWindow = 'week') {
        try {
            const response = await fetch(
                `${this.baseURL}/trending/movie/${timeWindow}?api_key=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching trending movies:', error);
            throw error;
        }
    }

    getPosterUrl(path, size = 'w342') {
        if (!path) return TMDB_CONFIG.DEFAULT_POSTER;
        return `${TMDB_CONFIG.IMAGE_BASE_URL}${size}${path}`;
    }

    getBackdropUrl(path, size = 'original') {
        if (!path) return '';
        return `${TMDB_CONFIG.IMAGE_BASE_URL}${size}${path}`;
    }
}

// ============================================
// 5. MOVIE CARD RENDERER
// ============================================
class MovieRenderer {
    constructor(api) {
        this.api = api;
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.movieId = movie.id;

        const posterPath = this.api.getPosterUrl(movie.poster_path);
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const title = movie.title || 'Untitled';

        card.innerHTML = `
            <div class="movie-poster-wrapper">
                <img 
                    src="${posterPath}" 
                    alt="${title} poster" 
                    class="movie-poster"
                    loading="lazy"
                    onerror="this.src='${TMDB_CONFIG.DEFAULT_POSTER}'"
                >
                <div class="movie-rating-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    ${rating}
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${title}</h3>
                <p class="movie-year">${year}</p>
            </div>
        `;

        // Add click event for movie details
        card.addEventListener('click', () => {
            this.showMovieDetails(movie.id);
        });

        return card;
    }

    renderMovies(movies, container) {
        container.innerHTML = '';
        
        if (!movies || movies.length === 0) {
            this.showNoResults(true);
            return;
        }

        this.showNoResults(false);

        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            container.appendChild(card);
        });
    }

    showNoResults(show) {
        const noResultsContainer = document.getElementById('no-results-container');
        const noResultsText = document.getElementById('no-results');
        
        if (show) {
            noResultsContainer.style.display = 'block';
        } else {
            noResultsContainer.style.display = 'none';
        }
    }

    async showMovieDetails(movieId) {
        try {
            const movieDetails = await this.api.getMovieDetails(movieId);
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'movie-modal';
            
            const backdrop = this.api.getBackdropUrl(movieDetails.backdrop_path);
            const poster = this.api.getPosterUrl(movieDetails.poster_path, 'w500');
            const rating = movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : 'N/A';
            const runtime = movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A';
            const genres = movieDetails.genres ? movieDetails.genres.map(g => g.name).join(', ') : 'N/A';
            const cast = movieDetails.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A';
            
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <button class="modal-close" aria-label="Close modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        ${backdrop ? `
                            <div class="modal-backdrop" style="background-image: url('${backdrop}')">
                                <div class="modal-backdrop-overlay"></div>
                            </div>
                        ` : ''}
                        <div class="modal-body">
                            <div class="modal-poster">
                                <img 
                                    src="${poster}" 
                                    alt="${movieDetails.title} poster"
                                    onerror="this.src='${TMDB_CONFIG.DEFAULT_POSTER}'"
                                >
                            </div>
                            <div class="modal-info">
                                <h2 class="modal-title">${movieDetails.title}</h2>
                                <div class="modal-meta">
                                    <span>${movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A'}</span>
                                    <span>•</span>
                                    <span>${runtime}</span>
                                    <span>•</span>
                                    <span class="modal-rating">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                        ${rating}
                                    </span>
                                </div>
                                <p class="modal-overview">${movieDetails.overview || 'No overview available.'}</p>
                                <div class="modal-details">
                                    <div class="modal-detail-item">
                                        <span class="modal-detail-label">Genres:</span>
                                        <span class="modal-detail-value">${genres}</span>
                                    </div>
                                    <div class="modal-detail-item">
                                        <span class="modal-detail-label">Cast:</span>
                                        <span class="modal-detail-value">${cast}</span>
                                    </div>
                                    ${movieDetails.videos?.results?.length > 0 ? `
                                        <div class="modal-trailer">
                                            <button class="modal-trailer-btn" data-key="${movieDetails.videos.results[0].key}">
                                                ▶ Watch Trailer
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal on overlay click or close button click
            const closeModal = () => {
                modal.remove();
            };
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                if (e.target === modal.querySelector('.modal-overlay')) {
                    closeModal();
                }
            });
            
            // Close on Escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            
            // Trailer button
            const trailerBtn = modal.querySelector('.modal-trailer-btn');
            if (trailerBtn) {
                trailerBtn.addEventListener('click', () => {
                    const key = trailerBtn.dataset.key;
                    const trailerModal = document.createElement('div');
                    trailerModal.className = 'trailer-modal';
                    trailerModal.innerHTML = `
                        <div class="trailer-overlay">
                            <div class="trailer-content">
                                <button class="trailer-close" aria-label="Close trailer">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                                <iframe 
                                    src="https://www.youtube.com/embed/${key}?autoplay=1" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                    class="trailer-iframe"
                                ></iframe>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(trailerModal);
                    
                    trailerModal.querySelector('.trailer-close').addEventListener('click', () => {
                        trailerModal.remove();
                    });
                    trailerModal.querySelector('.trailer-overlay').addEventListener('click', (e) => {
                        if (e.target === trailerModal.querySelector('.trailer-overlay')) {
                            trailerModal.remove();
                        }
                    });
                });
            }
            
        } catch (error) {
            console.error('Error fetching movie details:', error);
            alert('Failed to load movie details. Please try again.');
        }
    }
}

// ============================================
// 6. MAIN APPLICATION
// ============================================
class VibeFlixApp {
    constructor() {
        this.api = new TMDbAPI(TMDB_CONFIG.API_KEY);
        this.renderer = new MovieRenderer(this.api);
        this.searchTimeout = null;
        this.isLoading = false;
        this.currentPage = 1;
        this.currentQuery = '';
        this.hasMore = true;
        
        this.init();
    }

    init() {
        // Load initial movies
        this.loadPopularMovies();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup infinite scroll
        this.setupInfiniteScroll();
        
        // Update header with animation
        this.animateHeader();
    }

    async loadPopularMovies(page = 1) {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showLoading();
            
            const data = await this.api.getPopularMovies(page);
            
            if (page === 1) {
                this.renderer.renderMovies(data.results, DOM.moviesGrid);
            } else {
                // Append more movies
                data.results.forEach(movie => {
                    const card = this.renderer.createMovieCard(movie);
                    DOM.moviesGrid.appendChild(card);
                });
            }
            
            this.currentPage = data.page;
            this.hasMore = data.page < data.total_pages;
            
        } catch (error) {
            console.error('Error loading popular movies:', error);
            this.showError('Failed to load popular movies. Please refresh the page.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    async searchMovies(query, page = 1) {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showLoading();
            
            const data = await this.api.searchMovies(query, page);
            
            if (page === 1) {
                this.renderer.renderMovies(data.results, DOM.moviesGrid);
            } else {
                data.results.forEach(movie => {
                    const card = this.renderer.createMovieCard(movie);
                    DOM.moviesGrid.appendChild(card);
                });
            }
            
            this.currentPage = data.page;
            this.hasMore = data.page < data.total_pages;
            this.currentQuery = query;
            
        } catch (error) {
            console.error('Error searching movies:', error);
            this.showError('Failed to search movies. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    setupEventListeners() {
        // Search with debounce
        DOM.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            const query = e.target.value.trim();
            
            this.searchTimeout = setTimeout(() => {
                if (query) {
                    this.currentQuery = query;
                    this.currentPage = 1;
                    this.searchMovies(query, 1);
                } else {
                    this.currentQuery = '';
                    this.currentPage = 1;
                    this.loadPopularMovies(1);
                }
            }, 500);
        });

        // Search on Enter key
        DOM.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(this.searchTimeout);
                const query = e.target.value.trim();
                if (query) {
                    this.currentQuery = query;
                    this.currentPage = 1;
                    this.searchMovies(query, 1);
                }
            }
        });

        // Clear search with Escape key
        DOM.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                DOM.searchInput.value = '';
                DOM.searchInput.blur();
                this.currentQuery = '';
                this.currentPage = 1;
                this.loadPopularMovies(1);
            }
        });
    }

    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.hasMore && !this.isLoading) {
                    const nextPage = this.currentPage + 1;
                    if (this.currentQuery) {
                        this.searchMovies(this.currentQuery, nextPage);
                    } else {
                        this.loadPopularMovies(nextPage);
                    }
                }
            });
        });

        // Create sentinel element
        const sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '20px';
        sentinel.style.margin = '20px 0';
        DOM.moviesGrid.parentNode.appendChild(sentinel);
        
        observer.observe(sentinel);
    }

    showLoading() {
        // Add loading spinner
        let loader = document.getElementById('loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader';
            loader.className = 'loader';
            loader.innerHTML = '<div class="spinner"></div>';
            DOM.moviesGrid.parentNode.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    hideLoading() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        DOM.moviesGrid.prepend(errorDiv);
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    animateHeader() {
        const title = DOM.appTitle;
        const logo = DOM.headerLogo;
        
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            title.style.transition = 'all 0.6s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
            
            logo.style.transition = 'all 0.6s ease 0.2s';
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1)';
        }, 100);
    }
}

// ============================================
// 7. STYLES (Add to styles.css)
// ============================================
const styles = `
    /* Loading Spinner */
    .loader {
        display: flex;
        justify-content: center;
        padding: 40px 0;
        width: 100%;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(139, 92, 246, 0.1);
        border-top: 4px solid #8b5cf6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Movie Card */
    .movie-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .movie-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        border-color: #8b5cf6;
    }
    
    .movie-poster-wrapper {
        position: relative;
        overflow: hidden;
        aspect-ratio: 2/3;
    }
    
    .movie-poster {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .movie-card:hover .movie-poster {
        transform: scale(1.05);
    }
    
    .movie-rating-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        padding: 4px 10px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 600;
        color: #fbbf24;
    }
    
    .movie-rating-badge svg {
        width: 14px;
        height: 14px;
    }
    
    .movie-info {
        padding: 16px;
    }
    
    .movie-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        color: #fff;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .movie-year {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
    }
    
    /* Modal */
    .movie-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .modal-content {
        position: relative;
        background: #1a1a2e;
        border-radius: 20px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: rgba(139, 92, 246, 0.6);
        transform: rotate(90deg);
    }
    
    .modal-backdrop {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    
    .modal-backdrop-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent 50%, #1a1a2e 100%);
    }
    
    .modal-body {
        padding: 24px;
        display: flex;
        gap: 24px;
        margin-top: -80px;
        position: relative;
        z-index: 2;
    }
    
    .modal-poster {
        flex-shrink: 0;
        width: 180px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    }
    
    .modal-poster img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .modal-info {
        flex: 1;
        color: #fff;
    }
    
    .modal-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
    }
    
    .modal-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin-bottom: 16px;
    }
    
    .modal-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #fbbf24;
        font-weight: 600;
    }
    
    .modal-overview {
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
        margin-bottom: 16px;
    }
    
    .modal-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .modal-detail-item {
        display: flex;
        gap: 8px;
        font-size: 14px;
    }
    
    .modal-detail-label {
        color: rgba(255, 255, 255, 0.5);
        min-width: 60px;
    }
    
    .modal-detail-value {
        color: rgba(255, 255, 255, 0.9);
    }
    
    .modal-trailer {
        margin-top: 16px;
    }
    
    .modal-trailer-btn {
        background: #8b5cf6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .modal-trailer-btn:hover {
        background: #7c3aed;
        transform: scale(1.05);
    }
    
    /* Trailer Modal */
    .trailer-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }
    
    .trailer-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .trailer-content {
        position: relative;
        width: 100%;
        max-width: 800px;
        aspect-ratio: 16/9;
    }
    
    .trailer-close {
        position: absolute;
        top: -48px;
        right: 0;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px;
        transition: transform 0.3s ease;
    }
    
    .trailer-close:hover {
        transform: rotate(90deg);
    }
    
    .trailer-iframe {
        width: 100%;
        height: 100%;
        border-radius: 12px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .modal-body {
            flex-direction: column;
            margin-top: 0;
            padding: 16px;
        }
        
        .modal-poster {
            width: 140px;
            margin: 0 auto;
        }
        
        .modal-backdrop {
            height: 120px;
        }
        
        .modal-title {
            font-size: 22px;
        }
    }
`;

// ============================================
// 8. INITIALIZE APP
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    // Initialize app
    const app = new VibeFlixApp();
});

// ============================================
// 9. ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e);
});

// Handle API key missing
if (TMDB_CONFIG.API_KEY === 'YOUR_TMDB_API_KEY') {
    console.warn('⚠️ Please replace YOUR_TMDB_API_KEY with your actual TMDb API key');
    alert('Please add your TMDb API key to the script. Get one at https://www.themoviedb.org/signup');
}