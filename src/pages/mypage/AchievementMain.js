import React, { useState, useRef } from "react";
import { Container, Row, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from 'react-icons/io';
import "./AchievementMain.css";

const AchievementMain = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const badgeCardRef = useRef(null);

  // 임시 사용자 데이터
  const user = {
    nickname: "메밀먼",
    profileImage: null,
  };

  // 배지 진행률 데이터
  const progress = {
    overall: 85,
    categories: [
      { name: "스페셜", current: 4, total: 6 },
      { name: "식단 배지", current: 6, total: 7 },
      { name: "초록불 배지", current: 1, total: 5 },
    ],
  };

  // 임시 배지 데이터
  const badges = [
    {
      id: 1,
      name: "초록빛 식탁",
      category: "식단",
      description: "식단 100개를 등록했어요",
      image: "/images/badges/natural-product.png",
      unlocked: true,
      unlockedDate: "2024.09.28",
    },
    {
      id: 2,
      name: "토끼 절대 지켜",
      category: "식단",
      description: "토끼를 절대 지켰어요",
      image: "/images/badges/locked.png",
      unlocked: false,
    },
    {
      id: 3,
      name: "여기도 가볼까",
      category: "초록불",
      description: "여러 초록불 매장을 방문했어요",
      image: "/images/badges/organic.png",
      unlocked: true,
      unlockedDate: "2024.09.15",
    },
    {
      id: 4,
      name: "내 안의 초록불꽃",
      category: "초록불",
      description: "초록불 활동을 활발히 했어요",
      image: "/images/badges/organic-tomato.png",
      unlocked: true,
      unlockedDate: "2024.08.20",
    },
    {
      id: 5,
      name: "초록불 마스터",
      category: "스페셜",
      description: "초록불 마스터가 되었어요",
      image: "/images/badges/locked.png",
      unlocked: false,
    },
    {
      id: 6,
      name: "여기 가보세요",
      category: "초록불",
      description: "친구에게 매장을 추천했어요",
      image: "/images/badges/locked.png",
      unlocked: false,
    },
  ];

  // 새 배지 알림 여부 (임시 데이터)
  const [hasNewBadge] = useState(true);

  const handleBadgeClick = (badge) => {
    if (badge.unlocked) {
      setSelectedBadge(badge);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDownloadBadge = () => {
    if (!badgeCardRef.current) return;

    // HTML to Canvas 변환을 위한 간단한 구현
    // 실제로는 html2canvas 라이브러리를 사용하는 것이 좋습니다
    // npm install html2canvas 후 import html2canvas from 'html2canvas';

    // 임시로 토스트만 표시
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);

    // 실제 구현 예시:
    // html2canvas(badgeCardRef.current).then(canvas => {
    //   const link = document.createElement('a');
    //   link.download = `${selectedBadge.name}_badge.png`;
    //   link.href = canvas.toDataURL();
    //   link.click();
    //   setShowToast(true);
    //   setTimeout(() => setShowToast(false), 2000);
    // });
  };

  const calculateProgress = (current, total) => {
    return (current / total) * 100;
  };

  return (
    <>
      {/* 헤더 */}
      <Row className="achievement-header-row">
        <div className="achievement-header">
          <IoIosArrowBack className="back-icon" onClick={() => navigate(-1)} />
          <h1 className="achievement-title">달성한 업적</h1>
        </div>
      </Row>

      <Container className="text-center justify-content-center">
        {/* 프로필 카드 */}
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

        {/* 새 배지 알림 카드 */}
        {hasNewBadge && (
          <div className="new-badge-alert">
            <div className="alert-content">
              <div className="alert-text">
                <span className="alert-title">축하해요</span>
                <span className="alert-message">새로운 배지가 생겼어요!</span>
              </div>
              <div className="alert-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path
                    d="M40 10L45 25L50 15L52 30L60 20L58 35L70 30L65 42L75 40L68 50L80 52L70 58L75 65L62 63L65 72L52 68L50 78L45 68L40 75L35 68L30 78L28 68L15 72L18 63L5 65L10 58L0 52L12 50L5 42L20 30L12 35L20 20L28 30L30 15L35 25L40 10Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </svg>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  style={{ marginLeft: "-20px" }}
                >
                  <circle
                    cx="30"
                    cy="30"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M25 30L28 33L35 26"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M20 15Q25 18 30 15Q35 18 40 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M18 35C18 35 20 38 22 36"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M38 35C38 35 40 38 42 36"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* 배지 그리드 */}
        <div className="badges-grid">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-item ${badge.unlocked ? "unlocked" : "locked"}`}
              onClick={() => handleBadgeClick(badge)}
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
      </Container>

      {/* 배지 상세 모달 */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="badge-modal"
      >
        <div className="modal-overlay">
          <div className="modal-actions">
            <button className="modal-action-btn" onClick={handleDownloadBadge}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15V3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="modal-action-btn" onClick={handleCloseModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {selectedBadge && (
            <div className="badge-detail-card" ref={badgeCardRef}>
              <div className="badge-card-date">
                {selectedBadge.unlockedDate}
              </div>
              <div className="badge-card-image">
                <img src={selectedBadge.image} alt={selectedBadge.name} />
              </div>
              <div className="badge-card-category">
                {selectedBadge.category}
              </div>
              <h3 className="badge-card-title">{selectedBadge.name}</h3>
              <p className="badge-card-description">
                {selectedBadge.description}
              </p>
              <div className="badge-card-footer">
                <span className="badge-card-username">{user.nickname}</span>
              </div>
              <p className="badge-card-message">
                전체 사용자의 6%만이 가지고 있는 배지예요.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="toast-message">배지를 이미지로 저장했어요.</div>
      )}
    </>
  );
};

export default AchievementMain;
