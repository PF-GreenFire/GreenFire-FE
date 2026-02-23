import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getMypageAPI,
  updateCoverImageAPI,
  getEchoPostsAPI,
  getEchoLikedPostsAPI,
} from "../../apis/mypageAPI";
import { getImageUrl } from "../../utils/imageUtils";
import EchoMemoryHeader from "../../components/mypage/EchoMemoryHeader";
import ProfileBanner from "../../components/mypage/ProfileBanner";
import ProfileInfoSection from "../../components/mypage/ProfileInfoSection";
import UserDetails from "../../components/mypage/UserDetails";
import ScrapCardsSection from "../../components/mypage/ScrapCardsSection";
import TabNavigation from "../../components/mypage/TabNavigation";
import PhotoGrid from "../../components/mypage/PhotoGrid";
import CoverImageModal from "../../components/mypage/CoverImageModal";
import Loading from "../../components/common/Loading";

const EchoMemoryMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("posts");
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  // Redux에서 사용자 데이터 조회
  const {
    user: reduxUser,
    echoMemorySummary,
    echoMemoryPosts,
    echoMemoryLikedPosts,
    loading,
  } = useSelector((state) => state.mypageReducer);

  useEffect(() => {
    dispatch(getMypageAPI());
  }, [dispatch]);

  // coverImage를 Redux에서 초기화
  useEffect(() => {
    if (reduxUser.imageCode) {
      setCoverImage(getImageUrl(`user/me/cover-image/${reduxUser.imageCode}`));
    }
  }, [reduxUser.userCode]);

  // 사용자 데이터 (Redux 데이터 우선, 폴백으로 기본값)
  const user = {
    nickname: reduxUser.nickname || "김초록",
    userCode: reduxUser.userCode || null,
    username: reduxUser.name || "김초록",
    profileImage: reduxUser.profileImage || null,
    level: 8,
    bio: "자기소개 영역 안녕하세요 김초록입니다 같이 환경 보호 해요~ 봉사활동 많이 다녀요 관심있으시면 우체통 보내주세요",
    tags: ["관심주제태그나염", "비건식", "봉사활동"],
    stats: {
      posts: echoMemorySummary.postCount || 0,
      followers: echoMemorySummary.followers || 0,
      following: echoMemorySummary.followings || 0,
    },
  };

  // 게시물 무한 스크롤 핸들러
  const handleLoadMorePosts = useCallback(() => {
    if (echoMemoryPosts.hasMore) {
      dispatch(getEchoPostsAPI(echoMemoryPosts.page + 1));
    }
  }, [dispatch, echoMemoryPosts.page, echoMemoryPosts.hasMore]);

  // 좋아요 게시물 무한 스크롤 핸들러
  const handleLoadMoreLikedPosts = useCallback(() => {
    if (echoMemoryLikedPosts.hasMore) {
      dispatch(getEchoLikedPostsAPI(echoMemoryLikedPosts.page + 1));
    }
  }, [dispatch, echoMemoryLikedPosts.page, echoMemoryLikedPosts.hasMore]);

  if (loading) {
    return <Loading message="로딩 중..." />;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // 좋아요 탭 첫 클릭 시 API 호출
    if (tab === "likes" && echoMemoryLikedPosts.posts.length === 0) {
      dispatch(getEchoLikedPostsAPI(0));
    }
  };

  const handleCardClick = (type) => {
    if (type === "places") {
      navigate("/mypage/scrapbook");
    } else if (type === "challenges") {
      navigate("/mypage/challenges");
    } else if (type === "achievements") {
      navigate("/mypage/achievements");
    }
  };

  const handleSettingsClick = () => {
    setShowCoverModal(true);
  };

  const handleCoverImageSave = async (image) => {
    setCoverImage(image); // 즉시 미리보기 (base64)
    const result = await dispatch(updateCoverImageAPI(image));
    if (result?.success && result.imagePath) {
      setCoverImage(getImageUrl(result.imagePath)); // 서버 URL로 교체
    } else if (!result?.success) {
      alert("커버 이미지 저장에 실패했습니다.");
      setCoverImage(null);
    }
  };

  return (
    <>
      <EchoMemoryHeader username={user.username} onGoBack={handleGoBack} />

      <div className="mb-[120px]">
        <ProfileBanner coverImage={coverImage} />
        <div className="px-4">
          <ProfileInfoSection
            user={user}
            onSettingsClick={handleSettingsClick}
          />
          <UserDetails user={user} />
          <ScrapCardsSection onCardClick={handleCardClick} />
        </div>
        <TabNavigation activeTab={activeTab} onTabClick={handleTabClick} />
        <PhotoGrid
          posts={
            activeTab === "posts"
              ? echoMemoryPosts.posts
              : echoMemoryLikedPosts.posts
          }
          hasMore={
            activeTab === "posts"
              ? echoMemoryPosts.hasMore
              : echoMemoryLikedPosts.hasMore
          }
          onLoadMore={
            activeTab === "posts"
              ? handleLoadMorePosts
              : handleLoadMoreLikedPosts
          }
        />
      </div>

      {/* 커버 이미지 변경 모달 */}
      <CoverImageModal
        show={showCoverModal}
        onHide={() => setShowCoverModal(false)}
        currentImage={coverImage}
        onSave={handleCoverImageSave}
      />
    </>
  );
};

export default EchoMemoryMain;
