import { Container } from "react-bootstrap";
import ProfileSection from "../../components/mypage/ProfileSection";
import ScrapbookSection from "../../components/mypage/ScrapbookSection";
import AchievementSection from "../../components/mypage/AchievementSection";
import MypageChallengeSection from "../../components/mypage/MypageChallengeSection";
import EcoMemorySection from "../../components/mypage/EcoMemorySection";
import "./MypageMain.css";

const MypageMain = () => {
  // 임시 사용자 데이터 (추후 Redux에서 가져올 수 있음)
  const user = {
    nickname: "아기초록불",
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
    <>
      <ProfileSection user={user} />

      <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
        <ScrapbookSection scrapbook={scrapbook} />
        <AchievementSection count={stats.achievements} />
        <MypageChallengeSection
          nickname={user.nickname}
          count={stats.challenges}
        />
        <EcoMemorySection nickname={user.nickname} count={stats.ecoMemories} />
      </Container>
    </>
  );
};

export default MypageMain;
