import React from 'react';
import { useNavigate } from 'react-router-dom';

const ScrapbookSection = ({ scrapbook }) => {
  const navigate = useNavigate();

  return (
    <section className="mypage-section">
      <div className="section-header">
        <h3 className="section-title">나의 스크랩북</h3>
        <button className="more-btn" onClick={() => navigate('/mypage/scrapbook')}>
          더보기
        </button>
      </div>
      <div className="scrapbook-box">
        <div className="scrapbook-item">
          <span className="scrapbook-count">{scrapbook.greenFire}</span>
          <span className="scrapbook-label">초록불</span>
        </div>
        <div className="scrapbook-divider" />
        <div className="scrapbook-item">
          <span className="scrapbook-count">{scrapbook.challenge}</span>
          <span className="scrapbook-label">챌린지</span>
        </div>
        <div className="scrapbook-divider" />
        <div className="scrapbook-item">
          <span className="scrapbook-count">{scrapbook.feed}</span>
          <span className="scrapbook-label">피드</span>
        </div>
        <div className="scrapbook-divider" />
        <div className="scrapbook-item">
          <span className="scrapbook-count">{scrapbook.friends}</span>
          <span className="scrapbook-label">친구</span>
        </div>
      </div>
    </section>
  );
};

export default ScrapbookSection;
