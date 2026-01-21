import React from 'react';

const AchievementProfileCard = ({ user, progress, calculateProgress }) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" />
          ) : (
            <span>👤</span>
          )}
        </div>
        <h2 className="profile-name">{user.nickname} 님</h2>
      </div>

      {/* 전체 진행률 */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">배지 달성률</span>
          <span className="progress-percentage">{progress.overall}%</span>
        </div>
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress.overall}%` }}
          />
        </div>
      </div>

      {/* 카테고리별 진행률 */}
      <div className="category-progress">
        {progress.categories.map((category, index) => (
          <div key={index} className="category-item">
            <span className="category-name">{category.name}</span>
            <span className="category-count">
              {category.current}/{category.total}
            </span>
            <div className="category-bar-wrapper">
              <div
                className="category-bar-fill"
                style={{
                  width: `${calculateProgress(category.current, category.total)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementProfileCard;
