import React from 'react';

const BadgesGrid = ({ badges, onBadgeClick }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-5">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-md transition-all duration-200
            ${badge.unlocked ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" : "opacity-60"}`}
          onClick={() => onBadgeClick(badge)}
        >
          <div className="w-[100px] h-[100px] flex items-center justify-center">
            {badge.unlocked ? (
              <img
                src={badge.image}
                alt={badge.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#999" strokeWidth="2" />
                  <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="#999" strokeWidth="2" />
                </svg>
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-gray-800 text-center">{badge.name}</span>
        </div>
      ))}
    </div>
  );
};

export default BadgesGrid;
