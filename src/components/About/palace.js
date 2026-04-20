import React from 'react';
import './palace.css';

const PalaceSection = () => {
  return (
    <section className="palace-section">
      <div className="palace-text-container">
        <h2>Take a look to</h2>
        <h2>Our Palace</h2>
        <p>
          Read more about us: Our Vision, Mission, success, and many more you’ll love.
        </p>
      </div>
      <div className="palace-video-container">
        <video
          className="palace-video"
          src="/video.mp4"
          autoPlay
          loop
          muted
        />
      </div>
    </section>
  );
};

export default PalaceSection;
