import { Container } from "react-bootstrap";
import ProfileSection from "../../components/mypage/ProfileSection";
import ScrapbookSection from "../../components/mypage/ScrapbookSection";
import AchievementSection from "../../components/mypage/AchievementSection";
import MypageChallengeSection from "../../components/mypage/MypageChallengeSection";
import EcoMemorySection from "../../components/mypage/EcoMemorySection";

const MypageMain = () => {
  // 임시 사용자 데이터 (추후 Redux에서 가져올 수 있음)
  const user = {
    nickname: "메밀면",
    profileImage: null, // 프로필 이미지 URL
  };

  // 임시 스크랩북 데이터
  const scrapbook = {
    greenFire: 101,
    challenge: 99,
    feed: 150,
    friends: 375,
  };

  // 임시 통계 데이터
  const stats = {
    achievements: 20,
    challenges: 99,
    ecoMemories: 150,
  };

  // 임시 업적 데이터
  const achievements = [
    { id: 1, name: "초록빛 식탁", image: "/store_ex1.png" },
    {
      id: 2,
      name: "토끼 절대 지켜",
      image: "/store_ex1.png",
    },
    {
      id: 3,
      name: "여기도 가볼까",
      image: "/store_ex1.png",
    },
  ];

  // 임시 챌린지 데이터
  const challenges = [
    {
      id: 1,
      title: "HEJ, PLOGGING",
      image: "/store_ex1.png",
    },
    {
      id: 2,
      title: "플라스틱 없는 삶",
      image: "/store_ex1.png",
    },
    {
      id: 3,
      title: "제로웨이스트",
      image: "/store_ex1.png",
    },
  ];

  // 임시 에코메모리 데이터
  const memories = [
    {
      id: 1,
      title: "에코메모리 1",
      image: "/store_ex1.png",
    },
    {
      id: 2,
      title: "에코메모리 2",
      image: "/store_ex1.png",
    },
    {
      id: 3,
      title: "에코메모리 3",
      image: "/store_ex1.png",
    },
    {
      id: 4,
      title: "에코메모리 4",
      image: "/store_ex1.png",
    },
    {
      id: 5,
      title: "에코메모리 5",
      image: "/store_ex1.png",
    },
    {
      id: 6,
      title: "에코메모리 6",
      image: "/store_ex1.png",
    },
  ];

  return (
    <>
      <ProfileSection user={user} />

      <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
        <ScrapbookSection scrapbook={scrapbook} />
        <AchievementSection
          count={stats.achievements}
          achievements={achievements}
        />
        <MypageChallengeSection
          nickname={user.nickname}
          count={stats.challenges}
          challenges={challenges}
        />
        <EcoMemorySection
          nickname={user.nickname}
          count={stats.ecoMemories}
          memories={memories}
        />
      </Container>
    </>
  );
};

export default MypageMain;
