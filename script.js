// Data film (contoh)
const movies = [
    { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", image: "https://example.com/inception.jpg" },
    { id: 2, title: "The Shawshank Redemption", year: 1994, genre: "Drama", image: "https://example.com/shawshank.jpg" },
    { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", image: "https://example.com/dark-knight.jpg" },
    { id: 4, title: "Pulp Fiction", year: 1994, genre: "Crime", image: "https://example.com/pulp-fiction.jpg" },
    { id: 5, title: "Forrest Gump", year: 1994, genre: "Drama", image: "https://example.com/forrest-gump.jpg" },
    // Tambahkan lebih banyak film sesuai kebutuhan
];

const featuredMoviesContainer = document.querySelector('#featured .movie-grid');
const popularMoviesContainer = document.querySelector('#popular .movie-grid');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResultsSection = document.getElementById('searchResults');
const searchResultsContainer = document.querySelector('#searchResults .movie-grid');

// Fungsi untuk membuat kartu film
function createMovieCard(movie) {
    return `
        <div class="movie-card" data-id="${movie.id}">
            <img src="${movie.image}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.year} | ${movie.genre}</p>
            </div>
        </div>
    `;
}

// Menampilkan film unggulan (5 film pertama)
function displayFeaturedMovies() {
    const featuredMovies = movies.slice(0, 5);
    featuredMoviesContainer.innerHTML = featuredMovies.map(createMovieCard).join('');
}

// Menampilkan film populer (5 film terakhir)
function displayPopularMovies() {
    const popularMovies = movies.slice(-5);
    popularMoviesContainer.innerHTML = popularMovies.map(createMovieCard).join('');
}

// Fungsi pencarian film
function searchMovies() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm === '') {
        searchResultsSection.classList.add('hidden');
        return;
    }

    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm) ||
        movie.year.toString().includes(searchTerm)
    );

    displaySearchResults(filteredMovies);
}

// Menampilkan hasil pencarian
function displaySearchResults(results) {
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>Tidak ada hasil yang ditemukan.</p>';
    } else {
        searchResultsContainer.innerHTML = results.map(createMovieCard).join('');
    }
    searchResultsSection.classList.remove('hidden');
}

// Event listeners
searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchMovies();
    }
});

// Debounce function untuk mengurangi frekuensi pencarian saat mengetik
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Terapkan debounce pada fungsi pencarian
const debouncedSearch = debounce(searchMovies, 300);
searchInput.addEventListener('input', debouncedSearch);

// Inisialisasi
displayFeaturedMovies();
displayPopularMovies();

// Tambahkan event listener untuk kartu film
document.addEventListener('click', (e) => {
    const movieCard = e.target.closest('.movie-card');
    if (movieCard) {
        const movieId = parseInt(movieCard.dataset.id);
        const selectedMovie = movies.find(movie => movie.id === movieId);
        if (selectedMovie) {
            alert(`Anda memilih film: ${selectedMovie.title}`);
            // Di sini Anda dapat menambahkan logika untuk menampilkan detail film atau memulai pemutaran
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('dropdown') || e.target.parentNode.classList.contains('dropdown')) {
                this.querySelector('.dropdown-content').classList.toggle('show');
            }
        });
    });

    // Menutup dropdown jika user mengklik di luar dropdown
    window.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown') && !e.target.parentNode.matches('.dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
            document.addEventListener('DOMContentLoaded', function() {
                const dropdowns = document.querySelectorAll('.dropdown');
            
                dropdowns.forEach(dropdown => {
                    const link = dropdown.querySelector('a');
                    const content = dropdown.querySelector('.dropdown-content');
            
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        content.classList.toggle('show');
                    });
            
                    // Tambahkan event listener untuk keyboard navigation
                    link.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            content.classList.toggle('show');
                        }
                    });
                });
            
                // Menutup dropdown jika user mengklik di luar dropdown
                window.addEventListener('click', function(e) {
                    if (!e.target.matches('.dropdown') && !e.target.closest('.dropdown')) {
                        const dropdowns = document.querySelectorAll('.dropdown-content');
                        dropdowns.forEach(dropdown => {
                            if (dropdown.classList.contains('show')) {
                                dropdown.classList.remove('show');
                            }

                            const featuredMovies = [
                                { title: "Inception", description: "Film sci-fi tentang pencurian mimpi", image: "path/to/inception.jpg", rating: 8.8 },
                                { title: "The Shawshank Redemption", description: "Drama tentang persahabatan di penjara", image: "path/to/shawshank.jpg", rating: 9.3 },
                                { title: "Pulp Fiction", description: "Film kriminal dengan cerita non-linear", image: "path/to/pulpfiction.jpg", rating: 8.9 },
                                { title: "The Dark Knight", description: "Film superhero tentang Batman", image: "path/to/darkknight.jpg", rating: 9.0 }
                            ];
                            
                            const popularMovies = [
                                { title: "Stranger Things", description: "Serial TV sci-fi horor", image: "path/to/strangerthings.jpg", rating: 8.7 },
                                { title: "Breaking Bad", description: "Drama kriminal tentang produksi narkoba", image: "path/to/breakingbad.jpg", rating: 9.5 },
                                { title: "Game of Thrones", description: "Serial fantasi epik", image: "path/to/got.jpg", rating: 9.3 },
                                { title: "The Mandalorian", description: "Serial TV Star Wars", image: "path/to/mandalorian.jpg", rating: 8.8 }
                            ];
                            
                            function createMovieCard(movie) {
                                return `
                                    <div class="movie-card">
                                        <img src="${movie.image}" alt="${movie.title}">
                                        <div class="movie-card-content">
                                            <h3>${movie.title}</h3>
                                            <p>${movie.description}</p>
                                            <div class="rating">Rating: ${movie.rating}/10</div>
                                        </div>
                                    </div>
                                `;
                            }
                            
                            function populateMovieGrid(movies, gridId) {
                                const grid = document.getElementById(gridId);
                                grid.innerHTML = movies.map(createMovieCard).join('');
                            }
                            
                            document.addEventListener('DOMContentLoaded', () => {
                                populateMovieGrid(featuredMovies, 'featured-movies');
                                populateMovieGrid(popularMovies, 'popular-movies');
                            
                                const featuredMovies = [
                                    { title: "Judul Film 1", image: "https://via.placeholder.com/200x300?text=Film+1" },
                                    { title: "Judul Film 2", image: "https://via.placeholder.com/200x300?text=Film+2" },
                                    { title: "Judul Film 3", image: "https://via.placeholder.com/200x300?text=Film+3" },
                                    { title: "Judul Film 4", image: "https://via.placeholder.com/200x300?text=Film+4" },
                                ];
                                
                                const popularMovies = [
                                    { title: "Film Populer 1", image: "https://via.placeholder.com/200x300?text=Populer+1" },
                                    { title: "Film Populer 2", image: "https://via.placeholder.com/200x300?text=Populer+2" },
                                    { title: "Film Populer 3", image: "https://via.placeholder.com/200x300?text=Populer+3" },
                                    { title: "Film Populer 4", image: "https://via.placeholder.com/200x300?text=Populer+4" },
                                ];
                                
                                function createMovieCard(movie) {
                                    return `
                                        <div class="movie-card">
                                            <img src="${movie.image}" alt="${movie.title}">
                                            <div class="movie-info">
                                                <h3>${movie.title}</h3>
                                            </div>
                                        </div>
                                    `;
                                }
                                
                                function populateMovieGrid(movies, gridId) {
                                    const grid = document.getElementById(gridId);
                                    grid.innerHTML = movies.map(createMovieCard).join('');
                                }
                                
                                document.addEventListener('DOMContentLoaded', () => {
                                    populateMovieGrid(featuredMovies, 'featured-movies');
                                    populateMovieGrid(popularMovies, 'popular-movies');
                                });
                            });
                        });
                    }
                });
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.toggle('active');
            }
        });
    });

    // Tutup menu saat mengklik di luar
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Reset menu saat ukuran layar berubah
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
});

function searchMovie() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const query = searchInput.value.toLowerCase().trim();

    // Clear previous results
    searchResults.innerHTML = '';

    if (query.length === 0) {
        searchResults.style.display = 'none';
        return;
    }

    // Filter movies based on the search query
    const matchedMovies = movieData.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.description.toLowerCase().includes(query)
    );

    // Display results
    if (matchedMovies.length > 0) {
        const resultsList = document.createElement('ul');
        matchedMovies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="${movie.link}">
                    <img src="${movie.image}" alt="${movie.title}">
                    <span>${movie.title}</span>
                </a>
            `;
            resultsList.appendChild(listItem);
        });
        searchResults.appendChild(resultsList);
        searchResults.style.display = 'block';
    } else {
        searchResults.innerHTML = '<p>Tidak ada film yang ditemukan.</p>';
        searchResults.style.display = 'block';
    }
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    const searchResults = document.getElementById('search-results');
    const searchForm = document.getElementById('search-form');
    if (!searchForm.contains(event.target) && !searchResults.contains(event.target)) {
        searchResults.style.display = 'none';
    }
});

// Prevent form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
});

document.getElementById('search-input').addEventListener('input', searchMovie);

