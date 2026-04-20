import React from 'react';
import './rewards.css';

const rewards = [
  {
    title: 'World Record',
    award: 'Guinness World Record Holder',
    description: 'Al Zarooni is the first Emirati non-royal awarded a Guinness World Record for his model car collection.',
  },
  {
    title: 'Visionary Award',
    award: 'Expo 2020 Visionary Award',
    description: 'Al Zarooni is the first Emirati non-royal awarded a Guinness World Record for his model car collection.',
  },
  {
    title: 'Visionary Award',
    award: 'Expo 2020 Visionary Award',
    description: 'Al Zarooni is the first Emirati non-royal awarded a Guinness World Record for his model car collection.',
  },
  {
    title: 'Visionary Award',
    award: 'Expo 2020 Visionary Award',
    description: 'Al Zarooni is the first Emirati non-royal awarded a Guinness World Record for his model car collection.',
  },
];

const RewardsSection = () => {
  return (
    <section className="rewards-section">
      <h2>Our Rewards</h2>
      <div className="rewards-list">
        {rewards.map((reward, index) => (
          <div key={index} className="reward-item">
            <div className="reward-left">
              <h3>{reward.title}</h3>
            </div>
            <div className="reward-right">
              <h4>{reward.award}</h4>
              <p>{reward.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RewardsSection;
