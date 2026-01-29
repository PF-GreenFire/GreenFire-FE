import React, { useState, useRef, useEffect } from "react";
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
  const [badges, setBadges] = useState([
    {
      id: 1,
      name: "초록빛 식탁",
      category: "식단",
      description: "식단 100개를 등록했어요",
      image: "/images/badges/natural-product.png",
      unlocked: true,
      unlockedDate: "2024.09.28",
      isNew: true,
      isViewed: false,
    },
    {
      id: 2,
      name: "토끼 절대 지켜",
      category: "식단",
      description: "토끼를 절대 지켰어요",
      image: "/images/badges/locked.png",
      unlocked: false,
      isNew: false,
      isViewed: true,
    },
    {
      id: 3,
      name: "여기도 가볼까",
      category: "초록불",
      description: "여러 초록불 매장을 방문했어요",
      image: "/images/badges/organic.png",
      unlocked: true,
      unlockedDate: "2024.09.15",
      isNew: true,
      isViewed: false,
    },
    {
      id: 4,
      name: "내 안의 초록불꽃",
      category: "초록불",
      description: "초록불 활동을 활발히 했어요",
      image: "/images/badges/organic-tomato.png",
      unlocked: true,
      unlockedDate: "2024.08.20",
      isNew: false,
      isViewed: true,
    },
    {
      id: 5,
      name: "초록불 마스터",
      category: "스페셜",
      description: "초록불 마스터가 되었어요",
      image: "/images/badges/locked.png",
      unlocked: false,
      isNew: false,
      isViewed: true,
    },
    {
      id: 6,
      name: "여기 가보세요",
      category: "초록불",
      description: "친구에게 매장을 추천했어요",
      image: "/images/badges/locked.png",
      unlocked: false,
      isNew: false,
      isViewed: true,
    },
  ]);

  // 새 배지가 있는지 확인 (unlocked이면서 isViewed가 false인 배지)
  const hasNewBadge = badges.some(
    (badge) => badge.unlocked && badge.isNew && !badge.isViewed
  );

  const handleBadgeClick = (badge) => {
    if (badge.unlocked) {
      // 새 배지 클릭 시 isViewed를 true로 변경
      if (badge.isNew && !badge.isViewed) {
        setBadges((prevBadges) =>
          prevBadges.map((b) =>
            b.id === badge.id ? { ...b, isViewed: true } : b
          )
        );
        // TODO: API 호출하여 서버에 isViewed 상태 업데이트
      }
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

      <div className="px-4 mb-[120px]">
        <AchievementProfileCard
          user={user}
          progress={progress}
          calculateProgress={calculateProgress}
        />

        {hasNewBadge && <NewBadgeAlert />}

        <BadgesGrid badges={badges} onBadgeClick={handleBadgeClick} />
      </div>

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
