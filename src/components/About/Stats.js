import React from 'react';
import './stats.css'; // External CSS for styling

const StatsSection = () => {
  const stats = [
    { value: "45+", label: "Awards" },
    { value: "300k+", label: "Followers" },
    { value: "5+", label: "Foundations" },
    { value: "10+", label: "Companies" },
  ];

  return (
    <div className="stats-section">
      {stats.map((stat, index) => (
        <div className="stat-item" key={index}>
          <h2 className="stat-value">{stat.value}</h2>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
