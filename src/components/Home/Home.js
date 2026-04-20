import React, { useState } from "react";
import Navbar from "./NavBar";
import AllArticles from "./AllArticles";
import StatSection from "./stats";
import Footer from "./Footer";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/Hero-sec.css";
import TopContributors from "../Contributors/TopContributors";
import SubscriptionModal from "../Shared/SubscriptionModal";

function Home() {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    document.title = "Home | Suhail Al Zarooni Official Portal";
    
    // Show modal after 5 seconds to new users
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('hasSeenLegacyModal');
      if (!hasSeen) {
        setIsModalOpen(true);
        localStorage.setItem('hasSeenLegacyModal', 'true');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    "All Articles",
    "Al Zarooni Foundation",
    "Al Zarooni Events",
    "Al Zarooni Media",
    "Al Zarooni Museum",
    "Al Zarooni Collection",
    "Al Zarooni Meetup",
  ];

  const logoData = [
    { src: "/Al zarooi Foundationn.png", alt: "Foundation" },
    { src: "/Al zaroni events.png", alt: "Events" },
    { src: "/Suhail AL Zarooni Media.png", alt: "Media" },
    { src: "/Al Zarooni Museum small.png", alt: "Museum" },
    { src: "/Suhail AL Zarooni Collection.png", alt: "Collection" },
  ];

  const socialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar />

      {/* Video Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="video-container"
      >
        <video className="intro-video" autoPlay muted loop>
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* Logo Section */}
      <div className="logo-section">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="logo-section-title"
        >
          Explore Al Zarooni's World
        </motion.h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="logo-carousel-container"
        >
          <div className="logo-track">
            {[...logoData, ...logoData].map((logo, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="logo-card"
              >
                <img src={logo.src} alt={logo.alt} className="logo-card-img" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="category-filter-section"
      >
        <div className="category-buttons-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <AllArticles selectedCategory={activeCategory} />
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="description-section"
      >
        <p className="description-text">
          Suhail Mohammed Al Zarooni, first ever Emirati after the Royal family of United Arab Emirates (UAE) to be Awarded with a Guinness World Record Holder's Certificate Twice.
        </p>
      </motion.div>


      <StatSection />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="section-container"
      >
        <motion.div variants={fadeInUp} className="Left-card">
          <div className="card">
            <p className="card-text">
              Mr. Kashif Anwar, the President of the Lahore Chamber of Commerce & Industry.
            </p>
          </div>
          <img src="/album2.jpg" alt="Visit" className="card-image" />
        </motion.div>
        
        <motion.div variants={fadeInUp} className="Middle-card">
          <img src="/album1.jpg" alt="Suhail Al Zarooni" className="middle" />
        </motion.div>
        
        <motion.div variants={fadeInUp} className="right-card">
          <img src="/album3.jpg" alt="Meeting" className="card-image" />
          <div className="cardr">
            <p className="card-text">
              Mr. Kashif Anwar, the President of the Lahore Chamber of Commerce & Industry.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="description-section"
      >
        <p className="description-text">
          "Dedication to excellence is the bridge between goals and achievement."
        </p>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="Card-Section"
      >
        <div className="serv">
          <ul>
            {[1, 2, 1, 2, 1].map((num, i) => (
              <motion.li key={i} variants={fadeInUp}>
                <img src={`/${num}.png`} alt={`Person ${i}`} />
                {num === 2 && <div className="card-title">His Excellency in Pakistan</div>}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="serv">
          <ul>
            {[1, 2, 1, 2, 1].map((num, i) => (
              <motion.li key={i} variants={fadeInUp}>
                <img src={`/${num}.png`} alt={`Person ${i}`} />
                {num === 2 && <div className="card-title">His Excellency in Pakistan</div>}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      <TopContributors />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="carousel-img-section"
      >
        <h2 className="media-title">Zarooni's Social Media</h2>
        <div className="social-slider-container">
          <Slider {...socialSettings}>
            {[
              "/album1.jpg",
              "/album2.jpg",
              "/album3.jpg",
              "/album2.jpg",
              "/album1.jpg",
              "/album2.jpg",
              "/album3.jpg",
              "/album2.jpg",
            ].map((image, index) => (
              <div key={index} className="social-slide">
                <div className="social-card">
                  <img
                    src={image}
                    alt={`Social ${index + 1}`}
                    className="social-card-img"
                  />
                  <div className="social-overlay">
                    <span className="social-view-btn">View Post</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="subscribe-section"
      >
        <button onClick={() => setIsModalOpen(true)} className="subscribe-buttons">SUBSCRIBE</button>
        <p className="subscribe-text">Subscribe Newsletter to stay updated</p>
      </motion.div>
      <Footer />

      <SubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default Home;
