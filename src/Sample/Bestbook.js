import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import './BestBook.css';

const BestBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = React.useState(null);
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [reviews, setReviews] = React.useState([]);
  const [showReviewForm, setShowReviewForm] = React.useState(false);

  React.useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/best/${bookId}`);
        setBook(response.data);
      } catch (error) {
        console.error('Failed to fetch book details', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/best/${bookId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      }
    };

    fetchBook();
    fetchReviews();
  }, [bookId]);

  const handleAddReview = async () => {
    try {
      await axios.post(`http://localhost:8080/api/best/${bookId}/reviews`, {
        username: 'User', // Replace with actual username
        review,
        rating,
      });
      setReview('');
      setRating(0);
      setShowReviewForm(false);
      alert('Review submitted successfully!');
      // Refresh reviews
      const response = await axios.get(`http://localhost:8080/api/best/${bookId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    }
  };

  if (!book) return <p>Loading...</p>;
  const handleButton = (bookTitle) => {
    const existingBooks = JSON.parse(localStorage.getItem('bookTitles')) || [];
    const updatedBooks = [...existingBooks, bookTitle];
    localStorage.setItem('bookTitles', JSON.stringify(updatedBooks));
    alert(`${bookTitle} has been added to your profile!`);
  };
  return (
    <div>
      <div className="book-header">
        <button onClick={() => navigate('/Home')} className="best-back-button">Back</button>
        <div className="best-logo-title-container">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/019/900/152/small/old-book-watercolor-illustration-png.png"
            alt="Logo"
            className="best-logoo"
          />
          <h1 className="best-titlee">NovelNook</h1>
        </div>
      </div>
      <div className="best-book-detail">
        <div className="best-book-card">
          <div className="best-book-info">
            <div className="best-book-image-wrapper">
              <img
                src={book.img}
                alt={book.title}
                className="best-book-image"
              />
            </div>
            <div className="best-book-details">
              <h2 className="best-book-title">{book.title}</h2>
              <p><strong>Author:</strong> {book.author || 'N/A'}</p>
              <p><strong>Theme:</strong> {book.theme || 'N/A'}</p>
              <p>{book.shortstory || 'No description available.'}</p>
              <p><strong>Published Date:</strong> {book.date || 'N/A'}</p>
              <p className="best-book-rating">
                <strong>Rating:</strong>
                <ReactStars
                  count={5}
                  value={book.rating}
                  size={24}
                  edit={false}
                  activeColor="#ffd700"
                />
              </p>
              <h4>About Author:</h4>
              <div className="best-author-section">
                <img src={book.authimg} alt="Author" className="best-author-image" />
                <p>{book.aboutauth || 'N/A'}</p>
                </div>
                <Button onClick={() => handleButton(book.title)} className="add-to-profile-button">Add Book to Profile</Button>
              <div className="best-rate-button-section">
                <Button onClick={() => setShowReviewForm(true)} className="best-rate-button" style={{backgroundColor:"#FFD580",color: "#000"}}>
                  Rate the product
                </Button>
              </div>
              {showReviewForm && (
                <div className="best-review-form">
                  <ReactStars
                    count={5}
                    value={rating}
                    onChange={setRating}
                    size={24}
                    activeColor="#ffd700"
                  />
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here..."
                  />
                  <Button onClick={handleAddReview}>Submit Review</Button>
                </div>
              )}
              <div className="best-reviews-section">
                <h3>Ratings & Reviews:</h3>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="best-review">
                      <p><strong>{review.username}:</strong></p>
                      <p>{review.review}</p>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        edit={false}
                        size={24}
                        activeColor="#ffd700"
                      />
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestBook;
