import { RightCircleOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StatSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardData = [
    {
      img: "/album1.jpg",
      title: "Album of Excellency Visit in Pakistan",
      description:
        "Actor, director, producer, and screenwriter Usman Peerzada was joined by His Excellency Suhail Mohammed Al Zarooni!",
    },
    {
      img: "/album2.jpg",
      title: "Guinness World Record Event",
      description:
        "Celebrating the incredible journey and achievements of Suhail Mohammed Al Zarooni!",
    },
    {
      img: "/album3.jpg",
      title: "Cultural Exchange Program",
      description:
        "Highlighting the strong bonds of friendship and collaboration during Suhail Mohammed Al Zarooni's global tours.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length);
    }, 5000); // Change content every 5 seconds

    return () => clearInterval(interval); // Clean up the interval
  }, [cardData.length]);
  
  const currentCard = cardData[currentIndex];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="stat-section">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="left-section"
      >
        <div className="stat-title">
          <motion.h2 variants={fadeInUp} className="stat-title">Suhail Mohammed Al Zarooni</motion.h2>
          <motion.h2 variants={fadeInUp} className="stat-title">
            <span className="golden">Guinness</span> World{" "}
            <span className="golden">Record Holder</span>
          </motion.h2>
        </div>
        
        <div className="stat-card-wrapper" style={{ position: 'relative', height: 'auto', minHeight: '200px' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="stat-card"
            >
              <div className="card-img">
                <img
                  src={currentCard.img}
                  alt={currentCard.title}
                  className="card-img"
                />
              </div>
              <div className="card-content">
                <h4>{currentCard.title}</h4>
                <p>{currentCard.description}</p>
              </div>
              <RightCircleOutlined className="icon" twoToneColor="#000" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="dot-container">
          {cardData.map((_, index) => (
            <div 
              key={index}
              className={currentIndex === index ? "dot-active dot" : "dot"}
              style={{ transition: 'all 0.3s ease' }}
            />
          ))}
        </div>

        <motion.div variants={staggerContainer} className="stats-row">
          {[
            { num: "1", label: "World Record Holder" },
            { num: "45", label: "National Award Holder" },
            { num: "10k+", label: "Followers On Social Media" }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="statcol">
              <div className="stat-number">{stat.num}</div>
              <div className="stat-label">{stat.label}</div>
              {i < 2 && <div className="vertical-line"></div>}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="right-section"
      >
        <img
          src="/zarooni.png"
          alt="Suhail Mohammed Al Zarooni"
          className="right-img"
        />
      </motion.div>
    </div>
  );
};

export default StatSection;
