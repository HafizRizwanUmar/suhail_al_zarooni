import React, { useEffect, useState } from "react";
import axios from "axios";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/articles");
        const filteredArticles = response.data.data.filter(
          (article) => article.category.toLowerCase() === "update"
        );
        setArticles(filteredArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to fetch articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Auto-rotate articles every 5 seconds
  useEffect(() => {
    if (articles.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [articles]);

  // Utility function to strip HTML tags from content
  const stripHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>{error}</p>;

  const currentArticle = articles[currentIndex];
  const nextArticles = [
    articles[(currentIndex + 1) % articles.length],
    articles[(currentIndex + 2) % articles.length],
  ];

  return (
    <div style={styles.container}>
      {currentArticle ? (
        <div style={styles.articleCard}>
          {/* Text Section */}
          <div style={styles.textSection}>
            <h2 style={styles.title}>{currentArticle.title}</h2>
            <p style={styles.content}>
              {stripHTML(currentArticle.content).length > 300
                ? stripHTML(currentArticle.content).substring(0, 300) + "..."
                : stripHTML(currentArticle.content)}
            </p>
            <button style={styles.readMore}>Read More</button>
          </div>

          {/* Image Section */}
          <div style={styles.imageContainer}>
            <img
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              style={styles.image}
            />

            {/* Next Articles Cards */}
            <div style={styles.nextArticlesContainer}>
              {nextArticles.map((nextArticle, index) => (
                <div key={nextArticle._id} style={styles.nextArticleCard}>
                  <img
                    src={nextArticle.imageUrl}
                    alt={nextArticle.title}
                    style={styles.nextArticleImage}
                  />
                  <p style={styles.nextArticleTitle}>{nextArticle.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No articles found in the 'update' category.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: "0 auto",
    fontFamily: "poppins, sans-serif",
    textAlign: "left",
    backgroundColor:"white",
  },
  articleCard: {
    overflow: "hidden",
    position: "relative",
  },
  textSection: {
    padding: "20px",
  },
  title: {
    textAlign: "left",
    fontSize: "2rem",
    marginBottom: "15px",
    color: "#333",
  },
  content: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "15px",
    lineHeight: "1.6",
  },
  readMore: {
    padding: "10px 20px",
    backgroundColor: "#520000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "50vh",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  nextArticlesContainer: {
    position: "absolute",
    top: "40px",
    right: "20px",
    display: "flex",
    gap: "10px",
  },
  nextArticleCard: {
    width: "250px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  nextArticleImage: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
  },
  nextArticleTitle: {
    padding: "10px",
    fontSize: "0.9rem",
    textAlign: "center",
    color: "#333",
  },
};

export default ArticlesPage;
