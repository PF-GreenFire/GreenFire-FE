import React from 'react';
import { useNavigate } from 'react-router-dom';

const AchievementSection = ({ count }) => {
  const navigate = useNavigate();

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
      <div className="empty-box">
        <p className="empty-text">업적을 달성해보세요!</p>
      </div>
    </section>
  );
};

export default AchievementSection;
