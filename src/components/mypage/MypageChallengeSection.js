import React from 'react';
import { useNavigate } from 'react-router-dom';

const MypageChallengeSection = ({ nickname, count }) => {
  const navigate = useNavigate();

  return (
    <section className="mypage-section">
      <div className="section-header">
        <h3 className="section-title">
          {nickname}님의 챌린지 <span className="count-badge">+{count}</span>
        </h3>
        <button className="more-btn" onClick={() => navigate('/mypage/challenges')}>
          더보기
        </button>
      </div>
      <div className="empty-box">
        <p className="empty-text">챌린지를 시작해보세요!</p>
      </div>
    </section>
  );
};

export default MypageChallengeSection;
