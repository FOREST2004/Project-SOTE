import { useState, useEffect } from 'react';
import api from '../api';
import MovieCard from '../components/MovieCard';

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [search, selectedGenre]);

  const fetchMovies = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;

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
