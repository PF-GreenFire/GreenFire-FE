import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MypageMain.css';

const MypageMain = () => {
  const navigate = useNavigate();

  // 임시 사용자 데이터 (추후 Redux에서 가져올 수 있음)
  const user = {
    nickname: '아기초록불',
    profileImage: null, // 프로필 이미지 URL
  };

  // 임시 스크랩북 데이터
  const scrapbook = {
    greenFire: 0,
    challenge: 0,
    feed: 0,
    friends: 0,
  };

  // 임시 통계 데이터
  const stats = {
    achievements: 0,
    challenges: 99,
    ecoMemories: 0,
  };

  return (
    <div className="mypage-container">
      {/* 상단 초록색 배경 헤더 */}
      <div className="mypage-header">
        <svg
          className="header-wave"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L400,0 L400,60 Q350,100 300,70 Q250,40 200,60 Q150,80 100,50 Q50,20 0,60 Z"
            fill="#4A7C59"
          />
        </svg>
      </div>

      {/* 프로필 섹션 */}
      <div className="profile-section">
        <div className="profile-image-wrapper">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">
              <img
                src="/images/default-profile.png"
                alt="기본 프로필"
                className="profile-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span>🐱</span>';
                }}
              />
            </div>
          )}
        </div>
        <h2 className="profile-nickname">{user.nickname}</h2>
        <Button
          variant="success"
          className="edit-profile-btn"
          onClick={() => navigate('/mypage/edit')}
        >
          내 정보 수정
        </Button>
      </div>

      <Container className="mypage-content">
        {/* 나의 스크랩북 */}
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

        {/* 달성한 업적 */}
        <section className="mypage-section">
          <div className="section-header">
            <h3 className="section-title">
              달성한 업적 <span className="count-badge">+{stats.achievements}</span>
            </h3>
            <button className="more-btn" onClick={() => navigate('/mypage/achievements')}>
              더보기
            </button>
          </div>
          <div className="empty-box">
            <p className="empty-text">업적을 달성해보세요!</p>
          </div>
        </section>

        {/* 나의 챌린지 */}
        <section className="mypage-section">
          <div className="section-header">
            <h3 className="section-title">
              {user.nickname}님의 챌린지 <span className="count-badge">+{stats.challenges}</span>
            </h3>
            <button className="more-btn" onClick={() => navigate('/mypage/challenges')}>
              더보기
            </button>
          </div>
          <div className="empty-box">
            <p className="empty-text">챌린지를 시작해보세요!</p>
          </div>
        </section>

        {/* 에코메모리 */}
        <section className="mypage-section">
          <div className="section-header">
            <h3 className="section-title">
              {user.nickname}님의 에코메모리 <span className="count-badge">+{stats.ecoMemories}</span>
            </h3>
            <button className="more-btn" onClick={() => navigate('/mypage/eco-memories')}>
              더보기
            </button>
          </div>
          <div className="empty-box">
            <p className="empty-text">에코메모리를 시작해보세요!</p>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default MypageMain;