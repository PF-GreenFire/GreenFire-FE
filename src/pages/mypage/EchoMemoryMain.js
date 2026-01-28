import { Container } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EchoMemoryHeader from "../../components/mypage/EchoMemoryHeader";
import ProfileBanner from "../../components/mypage/ProfileBanner";
import ProfileInfoSection from "../../components/mypage/ProfileInfoSection";
import UserDetails from "../../components/mypage/UserDetails";
import ScrapCardsSection from "../../components/mypage/ScrapCardsSection";
import TabNavigation from "../../components/mypage/TabNavigation";
import PhotoGrid from "../../components/mypage/PhotoGrid";

const EchoMemoryMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts"); // posts, likes

  // 임시 사용자 데이터
  const user = {
    nickname: "김초록",
    username: "saladybest12",
    profileImage: null,
    level: 8,
    bio: "자기소개 영역 안녕하세요 김초록입니다 같이 환경 보호 해요~ 봉사활동 많이 다녀요 관심있으시면 우체통 보내주세요",
    tags: ["관심주제그나염", "비건식", "봉사활동"],
    stats: {
      posts: 9,
      followers: 10,
      following: 13,
    },
  };

  // 임시 게시물 데이터 (이미지 그리드용)
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
    if (type === "places") {
      navigate("/mypage/scrapbook");
    } else if (type === "challenges") {
      navigate("/mypage/challenges");
    } else if (type === "achievements") {
      navigate("/mypage/achievements");
    }
  };

  return (
    <>
      <EchoMemoryHeader username={user.username} onGoBack={handleGoBack} />
      <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
        <ProfileBanner />
        <ProfileInfoSection user={user} />
        <UserDetails user={user} />
        <ScrapCardsSection onCardClick={handleCardClick} />
        <TabNavigation activeTab={activeTab} onTabClick={handleTabClick} />
        <PhotoGrid posts={posts} />
      </Container>
    </>
  );
};

export default EchoMemoryMain;
