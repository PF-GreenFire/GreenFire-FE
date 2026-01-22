import React from 'react';
import { useNavigate } from 'react-router-dom';

const AchievementSection = ({ count, achievements = [] }) => {
  const navigate = useNavigate();

  // 최대 3개까지만 표시
  const displayAchievements = achievements.slice(0, 3);

  return (
    <section className="mypage-section">
      <div className="section-header">
        <h3 className="section-title">
          달성한 업적 <span className="count-badge">+{count}</span>
        </h3>
        <button className="more-btn" onClick={() => navigate('/mypage/achievements')}>
          더보기
        </button>
      </div>
      {achievements.length > 0 ? (
        <div className="achievement-grid">
          {displayAchievements.map((achievement) => (
            <div key={achievement.id} className="achievement-item">
              <div className="achievement-image-wrapper">
                <img
                  src={achievement.image}
                  alt={achievement.name}
                  className="achievement-image"
                />
              </div>
              <span className="achievement-name">{achievement.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-box">
          <p className="empty-text">업적을 달성해보세요!</p>
        </div>
      )}
    </section>
  );
};

export default AchievementSection;
