import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/mypage/PageHeader";
import AchievementProfileCard from "../../components/mypage/AchievementProfileCard";
import NewBadgeAlert from "../../components/mypage/NewBadgeAlert";
import BadgesGrid from "../../components/mypage/BadgesGrid";
import BadgeDetailModal from "../../components/mypage/BadgeDetailModal";
import { getMypageAPI, markBadgeViewedAPI } from "../../apis/mypageAPI";

const AchievementMain = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const badgeCardRef = useRef(null);

  const { user: reduxUser, achievementSummary } = useSelector(
    (state) => state.mypageReducer
  );

  // 페이지 진입 시 mypage 데이터가 비어 있으면 fetch
  useEffect(() => {
    if (!achievementSummary || !achievementSummary.achievements?.length) {
      dispatch(getMypageAPI());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = {
    nickname: reduxUser?.nickname || "",
    profileImage: reduxUser?.profileImageCode
      ? `/user/me/profile-image/${reduxUser.profileImageCode}`
      : null,
  };

  const badges = achievementSummary?.achievements || [];

  // 카테고리별 진행률 (unlocked / total)
  const progress = useMemo(() => {
    const groups = badges.reduce((acc, b) => {
      const key = b.category || "기타";
      if (!acc[key]) acc[key] = { name: key, current: 0, total: 0 };
      acc[key].total += 1;
      if (b.unlocked) acc[key].current += 1;
      return acc;
    }, {});
    const categories = Object.values(groups);
    const total = badges.length || 1;
    const unlocked = badges.filter((b) => b.unlocked).length;
    return {
      overall: Math.round((unlocked / total) * 100),
      categories,
    };
  }, [badges]);

  const hasNewBadge = badges.some((b) => b.unlocked && b.isNew && !b.isViewed);

  const handleBadgeClick = (badge) => {
    if (!badge.unlocked) return;
    setSelectedBadge(badge);
    setShowModal(true);

    // NEW 빨간 점 끄기 — 비동기, 실패해도 UX엔 영향 없음
    if (badge.isNew && !badge.isViewed) {
      markBadgeViewedAPI(badge.id).catch(() => {});
      // 다음 mypage 새로고침 시 BE 응답에 isViewed=true 반영됨
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleDownloadBadge = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const calculateProgress = (current, total) => {
    if (!total) return 0;
    return (current / total) * 100;
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

      {showToast && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-black/80 text-white py-3.5 px-6 rounded-3xl text-sm z-[1000] animate-pulse">
          배지를 이미지로 저장했어요.
        </div>
      )}
    </>
  );
};

export default AchievementMain;
