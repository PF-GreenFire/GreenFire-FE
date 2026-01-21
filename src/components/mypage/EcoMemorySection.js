import React from 'react';
import { useNavigate } from 'react-router-dom';

const EcoMemorySection = ({ nickname, count }) => {
  const navigate = useNavigate();

  return (
    <section className="mypage-section">
      <div className="section-header">
        <h3 className="section-title">
          {nickname}님의 에코메모리 <span className="count-badge">+{count}</span>
        </h3>
        <button className="more-btn" onClick={() => navigate('/mypage/eco-memories')}>
          더보기
        </button>
      </div>
      <div className="empty-box">
        <p className="empty-text">에코메모리를 시작해보세요!</p>
      </div>
    </section>
  );
};

export default EcoMemorySection;
