import React, { useState } from 'react';
import Navbar from '../Home/NavBar';
import '../../styles/Hero-sec.css';
import RewardsSection from './rewards';
import PalaceSection from './palace';
import StatSection from '../About/Stats';
import Footer from '../Home/Footer';
import AllArticles from '../Home/AllArticles'; 
import "../../styles/Home.css";

function About() {
  const logos = [
    { id: 1, image: "/logo1.png", detail: "Suhail Mohd Al Zarooni is a Guinness World Record holder, An Emirati Collector, An Author & Businessman from Dubai, United Arab Emirates. He had born November 16, 1968. He is the son of Mohammad Abdul Karim Al Zarooni." },
    { id: 2, image: "/logo2.png", detail: "Suhail Mohd Al Zarooni is a Guinness World Record holder, An Emirati Collector, An Author & Businessman from Dubai, United Arab Emirates. He had born November 16, 1968. He is the son of Mohammad Abdul Karim Al Zarooni." },
    { id: 3, image: "/logo3.png", detail: "Suhail Mohd Al Zarooni is a Guinness World Record holder, An Emirati Collector, An Author & Businessman from Dubai, United Arab Emirates. He had born November 16, 1968. He is the son of Mohammad Abdul Karim Al Zarooni." },
    { id: 4, image: "/logo4.png", detail: "Suhail Mohd Al Zarooni is a Guinness World Record holder, An Emirati Collector, An Author & Businessman from Dubai, United Arab Emirates. He had born November 16, 1968. He is the son of Mohammad Abdul Karim Al Zarooni." },
    { id: 5, image: "/logo5.png", detail: "Suhail Mohd Al Zarooni is a Guinness World Record holder, An Emirati Collector, An Author & Businessman from Dubai, United Arab Emirates. He had born November 16, 1968. He is the son of Mohammad Abdul Karim Al Zarooni." },
  ];

  const categories = [
    "All Articles",
    "Al Zarooni Foundation",
    "Al Zarooni Events",
    "Al Zarooni Media",
    "Al Zarooni Museum",
    "Al Zarooni Collection",
    "Al Zarooni Meetup",
  ];

  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + logos.length) % logos.length);
  };

  return (
    <div className="about-page">
      <Navbar />

      <div className="heroSec">
        <div className="badge">Visionary & Record Holder</div>
        <div className="detail">
          Suhail Mohammed Al Zarooni, first ever Emirati after the Royal family of United Arab Emirates (UAE) to be Awarded with a Guinness World Record Holder's Certificate Twice.
        </div>

        <div className="hero-logo-section">
          <div className="logo-desc-sec">
            <div className="logo-detail">
              {logos[currentIndex].detail}
            </div>

            <div className="logos">
              <button className="nav-button" onClick={handlePrev}>
                &#8592;
              </button>
              <div className="logo-carousel">
                {logos
                  .slice(currentIndex, currentIndex + 3)
                  .concat(
                    currentIndex + 3 > logos.length
                      ? logos.slice(0, (currentIndex + 3) % logos.length)
                      : []
                  )
                  .map((logo) => (
                    <div key={logo.id} className="logo-item">
                      <img src={logo.image} alt={logo.detail} />
                    </div>
                  ))}
              </div>
              <button className="nav-button" onClick={handleNext}>
                &#8594;
              </button>
            </div>
          </div>

          <div className="Zarooni-img">
            <img src="/profile.png" alt="Suhail Mohammed Al Zarooni" />
          </div>
        </div>
      </div>


      <StatSection />
      
      <div className="category-filter-section">
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
      </div>

      <AllArticles selectedCategory={activeCategory}></AllArticles>
      <RewardsSection />
      <PalaceSection />

      <div className="subscribe-section" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#000c40', color: '#fff' }}>
        <button className="subscribe-buttons" style={{ backgroundColor: '#fff', color: '#000c40', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>SUBSCRIBE</button>
        <p className="subscribe-text" style={{ marginTop: '15px', fontSize: '14px', opacity: 0.8 }}>Subscribe Newsletter to stay updated</p>
      </div>

      <Footer />
    </div>
  );
}

export default About;
