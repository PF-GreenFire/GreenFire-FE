import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosSearch, IoMdMore } from 'react-icons/io';
import { IoSettingsOutline, IoMailOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import './EchoMemoryMain.css';

const EchoMemoryMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts'); // posts, likes

  // 임시 사용자 데이터
  const user = {
    nickname: '김초록',
    username: 'saladybest12',
    profileImage: null,
    level: 8,
    bio: '자기소개 영역 안녕하세요 김초록입니다 같이 환경 보호 해요~ 봉사활동 많이 다녀요 관심있으시면 우체통 보내주세요',
    tags: ['관심주제그나염', '비건식', '봉사활동'],
    stats: {
      posts: 9,
      followers: 10,
      following: 13,
    },
  };

  // 임시 게시물 데이터 (이미지 그리드용)
  const posts = [
    { id: 1, imageUrl: 'https://picsum.photos/200?random=1' },
    { id: 2, imageUrl: 'https://picsum.photos/200?random=2' },
    { id: 3, imageUrl: 'https://picsum.photos/200?random=3' },
    { id: 4, imageUrl: 'https://picsum.photos/200?random=4' },
    { id: 5, imageUrl: 'https://picsum.photos/200?random=5' },
    { id: 6, imageUrl: 'https://picsum.photos/200?random=6' },
    { id: 7, imageUrl: 'https://picsum.photos/200?random=7' },
    { id: 8, imageUrl: 'https://picsum.photos/200?random=8' },
    { id: 9, imageUrl: 'https://picsum.photos/200?random=9' },
  ];

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigate(-1);
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (type) => {
    if (type === 'places') {
      navigate('/mypage/scrapbook');
    } else if (type === 'challenges') {
      navigate('/mypage/challenges');
    } else if (type === 'achievements') {
      navigate('/mypage/achievements');
    }
  };

  return (
    <>
      {/* 헤더 */}
      <Row className="echo-header-row">
        <div className="echo-header">
          <IoIosArrowBack className="back-icon" onClick={handleGoBack} />
          <h1 className="header-title">{user.username}</h1>
          <div className="header-right">
            <IoIosSearch className="header-icon" />
            <IoMdMore className="header-icon" />
          </div>
        </div>
      </Row>

      {/* 프로필 배너 */}
      <Row className="profile-banner-row">
        <div className="profile-banner">
          <img
            src="/images/profile-banner.png"
            alt="프로필 배너"
            className="banner-image"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/600/200?random=banner';
            }}
          />
        </div>
      </Row>

      {/* 프로필 정보 섹션 */}
      <Row className="profile-info-row">
        <div className="profile-info-section">
          {/* 프로필 이미지 */}
          <div className="profile-avatar-wrapper">
            {user.profileImage ? (
              <img src={user.profileImage} alt="프로필" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                <img
                  src="/images/default-profile.png"
                  alt="기본 프로필"
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="avatar-emoji">👤</span>';
                  }}
                />
              </div>
            )}
          </div>

          {/* 통계 및 버튼 */}
          <div className="profile-stats-area">
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{user.stats.posts}</span>
                <span className="stat-label">게시물</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.stats.followers}</span>
                <span className="stat-label">팔로워</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.stats.following}</span>
                <span className="stat-label">팔로잉</span>
              </div>
            </div>
            <div className="action-buttons">
              <button className="action-btn">
                <IoSettingsOutline /> 설정
              </button>
              <button className="action-btn">
                <IoMailOutline /> 우체통
              </button>
            </div>
          </div>
        </div>
      </Row>

      {/* 사용자 정보 영역 */}
      <Row className="user-details-row">
        <div className="user-details">
          <div className="user-name-area">
            <span className="level-badge">LEVEL {user.level}</span>
            <h2 className="user-nickname">{user.nickname}</h2>
            <p className="user-username">{user.username}</p>
          </div>
          <div className="user-info-area">
            <div className="user-tags">
              {user.tags.map((tag, index) => (
                <span key={index} className="user-tag">{tag}</span>
              ))}
            </div>
            <p className="user-bio">{user.bio}</p>
          </div>
        </div>
      </Row>

      {/* 스크랩 카드 섹션 */}
      <Row className="scrap-cards-row">
        <div className="scrap-cards-container">
          <div className="scrap-card" onClick={() => handleCardClick('places')}>
            <img
              src="/images/scrap-places.png"
              alt="저장한 장소"
              className="scrap-card-image"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/150/100?random=places';
              }}
            />
            <div className="scrap-card-overlay">
              <FaHeart className="scrap-heart" />
              <span className="scrap-label">저장한 장소</span>
            </div>
          </div>
          <div className="scrap-card" onClick={() => handleCardClick('challenges')}>
            <img
              src="/images/scrap-challenges.png"
              alt="챌린지"
              className="scrap-card-image"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/150/100?random=challenges';
              }}
            />
            <div className="scrap-card-overlay">
              <FaHeart className="scrap-heart" />
              <span className="scrap-label">챌린지</span>
            </div>
          </div>
          <div className="scrap-card" onClick={() => handleCardClick('achievements')}>
            <img
              src="/images/scrap-achievements.png"
              alt="달성한 업적"
              className="scrap-card-image"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/150/100?random=achievements';
              }}
            />
            <div className="scrap-card-overlay">
              <FaHeart className="scrap-heart" />
              <span className="scrap-label">달성한 업적</span>
            </div>
          </div>
        </div>
      </Row>

      {/* 탭 네비게이션 */}
      <Row className="tab-nav-row">
        <div className="tab-nav">
          <button
            className={`tab-nav-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => handleTabClick('posts')}
          >
            게시물
          </button>
          <button
            className={`tab-nav-item ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => handleTabClick('likes')}
          >
            좋아요
          </button>
        </div>
      </Row>

      <Container className="photo-grid-container">
        {/* 포토 그리드 */}
        <Row className="photo-grid">
          {posts.map((post) => (
            <Col xs={4} key={post.id} className="photo-col">
              <div className="photo-item">
                <img
                  src={post.imageUrl}
                  alt={`게시물 ${post.id}`}
                  className="photo-image"
                />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default EchoMemoryMain;
