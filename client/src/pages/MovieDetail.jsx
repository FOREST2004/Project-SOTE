import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await api.get(`/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Failed to fetch movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        movieId: id,
        rating,
        comment,
      });
      setComment('');
      fetchMovie();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!movie) return <div className="container">Movie not found</div>;

  return (
    <div className="container">
      <div className="movie-detail">
        <div className="movie-detail-header">
          <img src={movie.posterUrl} alt={movie.title} className="movie-detail-poster" />

          <div className="movie-detail-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span className="genre">{movie.genre}</span>
              <span className="rating">⭐ {movie.rating.toFixed(1)}</span>
              <span className="duration">{movie.duration} min</span>
            </div>
            <p className="description">{movie.description}</p>

            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Watch Trailer
              </a>
            )}
          </div>
        </div>

        <div className="showtimes-section">
          <h2>Showtimes</h2>
          {movie.showtimes.length > 0 ? (
            <div className="showtimes-grid">
              {movie.showtimes.map((showtime) => (
                <Link
                  key={showtime.id}
                  to={`/booking/${showtime.id}`}
                  className="showtime-card"
                >
                  <div className="showtime-time">
                    {new Date(showtime.startTime).toLocaleString('vi-VN')}
                  </div>
                  <div className="showtime-room">{showtime.room.name}</div>
                  <div className="showtime-price">
                    {showtime.price.toLocaleString('vi-VN')} VND
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No showtimes available</p>
          )}
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>

          {user && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  placeholder="Write your review..."
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          )}

          <div className="reviews-list">
            {movie.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <strong>{review.user.fullName}</strong>
                  <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                {review.comment && <p>{review.comment}</p>}
                <small>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
