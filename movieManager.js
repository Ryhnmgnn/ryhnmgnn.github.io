class MovieManager {
    constructor() {
        this.movies = allMovies;
        this.searchForm = document.getElementById('search-form');
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.movieContainer = document.getElementById('movie-container');
        
        // Hapus atau komentari baris-baris berikut
        // this.searchIcon = document.createElement('div');
        // this.searchIcon.className = 'search-icon';
        // this.searchIcon.innerHTML = '<i class="fas fa-film"></i>';
        // this.searchForm.appendChild(this.searchIcon);
        // this.searchIcon.style.display = 'none';
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchForm.addEventListener('submit', (e) => this.handleSearchSubmit(e));
        this.searchInput.addEventListener('input', () => this.handleSearchInput());
        document.addEventListener('click', (e) => {
            if (!this.searchResults.contains(e.target) && e.target !== this.searchInput) {
                this.closeSearchResults();
            }
        });
        // Tambahkan event listener untuk hasil pencarian
        this.searchResults.addEventListener('click', (e) => this.handleSearchResultClick(e));
    }

    handleSearchSubmit(e) {
        e.preventDefault();
        const query = this.searchInput.value.trim();
        if (query) {
            this.searchMovies(query);
        }
    }

    handleSearchInput() {
        if (this.searchInput.value.trim() === '') {
            this.searchResults.style.display = 'none';
        } else {
            this.handleSearchSubmit(new Event('submit'));
        }
    }

    handleClickOutside(e) {
        if (!this.searchResults.contains(e.target) && e.target !== this.searchInput) {
            this.searchResults.style.display = 'none';
        }
    }

    searchMovies(query) {
        const results = this.movies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<p>Tidak ada film yang ditemukan.</p>';
        } else {
            let html = '<div class="movie-grid">';
            results.forEach(movie => {
                html += this.createMovieCard(movie);
            });
            html += '</div>';
            this.searchResults.innerHTML = html;
        }
        this.searchResults.style.display = 'block';
        
        // Hapus atau komentari baris berikut
        // this.searchIcon.style.display = 'block';
        
        // Posisikan hasil pencarian di bawah tombol search
        const searchFormRect = this.searchForm.getBoundingClientRect();
        this.searchResults.style.top = `${searchFormRect.bottom}px`;
        this.searchResults.style.left = `${searchFormRect.left}px`;
        this.searchResults.style.width = `${searchFormRect.width}px`;
    }

    createMovieCard(movie) {
        return `
            <div class="movie-item">
                <img src="${movie.image}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <div class="movie-info">
                    <span class="rating">${movie.rating}/5</span>
                    <span class="year">${movie.year}</span>
                    <span class="duration">${movie.duration}</span>
                </div>
                <a href="${movie.href}" class="watch-button">Tonton Film</a>
            </div>
        `;
    }

    handleSearchResultClick(e) {
        if (e.target.classList.contains('watch-button')) {
            e.preventDefault();
            window.location.href = e.target.href;
        }
    }

    displayMoviesByCategory(category) {
        const categoryMovies = this.movies.filter(movie => movie.category === category);
        if (this.movieContainer) {
            let html = '<div class="movie-grid">';
            categoryMovies.forEach(movie => {
                html += this.createMovieCard(movie);
            });
            html += '</div>';
            this.movieContainer.innerHTML = html;
        }
    }
}

// Initialize MovieManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.movieManager = new MovieManager();
    
    // Check if we're on a category page and display movies accordingly
    const category = document.body.dataset.category;
    if (category) {
        window.movieManager.displayMoviesByCategory(category);
    }
});
