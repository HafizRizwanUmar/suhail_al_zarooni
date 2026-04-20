import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ArticlesCarousel.css'; // Add necessary styles for the carousel

const ArticlesCarousel = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('foundation'); // Default category
  const categories = ['foundation', 'events', 'media', 'museum', 'collection'];

  useEffect(() => {
    // Fetch articles from the backend
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/articles');
        // Validate response data
        const data = Array.isArray(response.data) ? response.data : [];
        setArticles(data);
        setFilteredArticles(data.filter(article => article.category === currentCategory));
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]); // Fallback to empty array on error
        setFilteredArticles([]);
      }
    };

    fetchArticles();
  }, [currentCategory]); // Updated dependency

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    if (Array.isArray(articles)) {
      const filtered = articles.filter((article) => article.category === category);
      setFilteredArticles(filtered);
    } else {
      console.error('Articles is not an array');
    }
  };

  return (
    <div className="articles-section">
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${category === currentCategory ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {`Al Zarooni ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          </button>
        ))}
      </div>
      <div className="carousel-container">
        {filteredArticles.slice(0, 6).map((article) => (
          <div className="article-card" key={article._id}>
            <img
              src={`http://localhost:5000/uploads/${article.image}`}
              alt={article.title}
              className="article-image"
            />
            <h3 className="article-title">{article.title}</h3>
            <p className="article-content">{article.content.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesCarousel;
