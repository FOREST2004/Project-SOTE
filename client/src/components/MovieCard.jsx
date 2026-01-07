import { Link } from 'react-router-dom';

function MovieCard({ movie, showBookingCount = false }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        <img src={movie.posterUrl} alt={movie.title} />
        {showBookingCount && movie.bookingCount !== undefined && (
          <div className="booking-badge">
            🎟️ {movie.bookingCount} bookings
          </div>
        )}
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span className="genre">{movie.genre}</span>
          <span className="rating">⭐ {movie.rating.toFixed(1)}</span>
        </div>
        <p className="duration">{movie.duration} minutes</p>
      </div>
    </Link>
  );
}

export default MovieCard;
