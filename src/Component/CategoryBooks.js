import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CategoryBooks.css';

const CategoryBooks = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/genre/category/${category}`)
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the books!', error);
        setError('Failed to load books.');
      });
  }, [category]);

  const handleBookClick = (bookId) => {
    navigate(`/genre/${category}/book/${bookId}`);
  };

  return (
    <>
    <div className="prof-headerr">
        <button onClick={() => navigate('/genre')} className="prof-back-button">Back</button>
        <div className="prof-logo-title-container">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/019/900/152/small/old-book-watercolor-illustration-png.png"
            alt="Logo"
            className="prof-logoo"
          />
          <h1 className="prof-titlee">NovelNook</h1>
        </div>
      </div>
    <div className="category-books-container">
      <h2>{category} Books</h2>
      {error && <p>{error}</p>}
      {books.length > 0 ? (
        <div className="books-grid">
          {books.map((book) => (
            <div 
              className="book-card" 
              key={book.bookno} 
              onClick={() => handleBookClick(book.bookno)} 
            >
              <img src={book.img} alt={book.title} className="book-image" />
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.author}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available in this category.</p>
      )}
    </div>
    </>
  );
};

export default CategoryBooks;