import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/mypage/PageHeader";
import AchievementProfileCard from "../../components/mypage/AchievementProfileCard";
import NewBadgeAlert from "../../components/mypage/NewBadgeAlert";
import BadgesGrid from "../../components/mypage/BadgesGrid";
import BadgeDetailModal from "../../components/mypage/BadgeDetailModal";

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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <PageHeader title="달성한 업적" />

      <Container
        className="text-center justify-content-center"
        style={{ marginBottom: "120px" }}
      >
        <AchievementProfileCard
          user={user}
          progress={progress}
          calculateProgress={calculateProgress}
        />

        {hasNewBadge && <NewBadgeAlert />}

        <BadgesGrid badges={badges} onBadgeClick={handleBadgeClick} />
      </Container>

      <BadgeDetailModal
        show={showModal}
        onClose={handleCloseModal}
        badge={selectedBadge}
        username={user.nickname}
        onDownload={handleDownloadBadge}
        badgeCardRef={badgeCardRef}
      />

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-black/80 text-white py-3.5 px-6 rounded-3xl text-sm z-[1000] animate-pulse">
          배지를 이미지로 저장했어요.
        </div>
      )}
    </>
  );
};

export default AchievementMain;
