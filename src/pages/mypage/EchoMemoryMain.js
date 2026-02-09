import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EchoMemoryHeader from "../../components/mypage/EchoMemoryHeader";
import ProfileBanner from "../../components/mypage/ProfileBanner";
import ProfileInfoSection from "../../components/mypage/ProfileInfoSection";
import UserDetails from "../../components/mypage/UserDetails";
import ScrapCardsSection from "../../components/mypage/ScrapCardsSection";
import TabNavigation from "../../components/mypage/TabNavigation";
import PhotoGrid from "../../components/mypage/PhotoGrid";
import CoverImageModal from "../../components/mypage/CoverImageModal";

const EchoMemoryMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  // Redux에서 사용자 데이터 조회
  const { user: reduxUser } = useSelector((state) => state.mypageReducer);

  // 사용자 데이터 (Redux 데이터 우선, 폴백으로 기본값)
  const user = {
    nickname: reduxUser.nickname || "김초록",
    username: "saladybest12",
    profileImage: reduxUser.profileImage || null,
    level: 8,
    bio: "자기소개 영역 안녕하세요 김초록입니다 같이 환경 보호 해요~ 봉사활동 많이 다녀요 관심있으시면 우체통 보내주세요",
    tags: ["관심주제태그나염", "비건식", "봉사활동"],
    stats: {
      posts: 9,
      followers: 10,
      following: 13,
    },
  };

  // 임시 게시물 데이터
  const posts = [
    { id: 1, imageUrl: "https://picsum.photos/200?random=1" },
    { id: 2, imageUrl: "https://picsum.photos/200?random=2" },
    { id: 3, imageUrl: "https://picsum.photos/200?random=3" },
    { id: 4, imageUrl: "https://picsum.photos/200?random=4" },
    { id: 5, imageUrl: "https://picsum.photos/200?random=5" },
    { id: 6, imageUrl: "https://picsum.photos/200?random=6" },
    { id: 7, imageUrl: "https://picsum.photos/200?random=7" },
    { id: 8, imageUrl: "https://picsum.photos/200?random=8" },
    { id: 9, imageUrl: "https://picsum.photos/200?random=9" },
  ];

  // 좋아요한 게시물 데이터
  const likedPosts = [
    { id: 101, imageUrl: "https://picsum.photos/200?random=101" },
    { id: 102, imageUrl: "https://picsum.photos/200?random=102" },
    { id: 103, imageUrl: "https://picsum.photos/200?random=103" },
  ];

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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

  const handleCoverImageSave = (image) => {
    setCoverImage(image);
    // TODO: API 호출하여 서버에 저장
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
        <PhotoGrid posts={activeTab === "posts" ? posts : likedPosts} />
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
