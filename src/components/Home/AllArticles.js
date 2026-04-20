import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "../../styles/Carousel.css";
import "../../styles/ArticlesCarousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AllArticles = ({ selectedCategory }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: articles.length > 4,
    lazyLoad: "ondemand",
    centerMode: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const categoryMap = {
    "Al Zarooni Foundation": "foundation",
    "Al Zarooni Events": "event",
    "Al Zarooni Media": "media",
    "Al Zarooni Museum": "museum",
    "Al Zarooni Collection": "collection",
    "Al Zarooni Meetup": "meetup",
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/articles");
        const fetchedArticles = response.data.data;
        setArticles(fetchedArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All Articles") {
      setFilteredArticles(articles);
    } else {
      const dbValue = categoryMap[selectedCategory];
      const filtered = articles.filter(
        (article) => article.category && article.category.toLowerCase() === dbValue
      );
      setFilteredArticles(filtered);
    }
  }, [selectedCategory, articles]);

  if (loading) {
    return <div className="text-center mt-5">Loading articles...</div>;
  }

  return (
    <div className="article-section">
      <div className="carousel-container" style={{ padding: '0 40px' }}>
        {filteredArticles.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: '#666' }}>
            No articles available for this category.
          </div>
        ) : (
          <Slider {...settings}>
            {filteredArticles.map((article) => (
              <div key={article._id} className="carousel-item" style={{ padding: '0 10px' }}>
                <div 
                  className="article-card" 
                  onClick={() => navigate(`/article/${article.slug || article._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="article-card-image"
                  />
                  <div className="article-card-title">{article.title}</div>
                  <div className="article-card-excerpt">
                    {article.content 
                      ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'
                      : article.description || "No description available."
                    }
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default AllArticles;
