import React from 'react';

const BadgesGrid = ({ badges, onBadgeClick }) => {
  return (
    <div className="badges-grid">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`badge-item ${badge.unlocked ? "unlocked" : "locked"}`}
          onClick={() => onBadgeClick(badge)}
        >
          <div className="badge-image-wrapper">
            {badge.unlocked ? (
              <img
                src={badge.image}
                alt={badge.name}
                className="badge-image"
              />
            ) : (
              <div className="badge-locked">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="#999"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
                    stroke="#999"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}
          </div>
          <span className="badge-name">{badge.name}</span>
        </div>
      ))}
    </div>
  );
};

export default BadgesGrid;
