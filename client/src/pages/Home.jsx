import { useState, useEffect } from 'react';
import api from '../api';
import MovieCard from '../components/MovieCard';

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('release-newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [search, selectedGenre, sortBy]);

  const fetchMovies = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;
      if (sortBy) params.sortBy = sortBy;

      const response = await api.get('/movies', { params });
      setMovies(response.data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = ['Action', 'Romance', 'Thriller', 'Comedy', 'Drama', 'Horror'];

  return (
    <div className="container">
      <h1>Now Showing</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="genre-select"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="release-newest">Newest Release</option>
          <option value="release-oldest">Oldest Release</option>
          <option value="rating-highest">Highest Rating</option>
          <option value="rating-lowest">Lowest Rating</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      </div>

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
