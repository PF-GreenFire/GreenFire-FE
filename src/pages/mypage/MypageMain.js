import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import ProfileSection from "../../components/mypage/ProfileSection";
import ScrapbookSection from "../../components/mypage/ScrapbookSection";
import AchievementSection from "../../components/mypage/AchievementSection";
import MypageChallengeSection from "../../components/mypage/MypageChallengeSection";
import EcoMemorySection from "../../components/mypage/EcoMemorySection";
import Loading from "../../components/common/Loading";
import { getMypageAPI } from "../../apis/mypageAPI";
import { getImageUrl } from "../../utils/imageUtils";

const MypageMain = () => {
  const dispatch = useDispatch();
  const {
    user,
    scrapbook,
    achievementSummary,
    challengeSummary,
    echoMemorySummary,
    loading,
    error,
  } = useSelector((state) => state.mypageReducer);

  useEffect(() => {
    dispatch(getMypageAPI());
  }, [dispatch]);

  if (loading) {
    return <Loading message="마이페이지 로딩 중..." />;
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <p className="text-danger">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-secondary">{error}</p>
      </Container>
    );
  }

  return (
    <>
      <ProfileSection user={user} coverImage={user.coverImage ? getImageUrl(user.coverImage) : null} />

      <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
        <ScrapbookSection scrapbook={scrapbook} />
        <AchievementSection
          count={achievementSummary.totalCount}
          achievements={achievementSummary.achievements}
        />
        <MypageChallengeSection
          nickname={user.nickname}
          count={challengeSummary.totalCount}
          challenges={challengeSummary.challenges}
        />
        <EcoMemorySection
          nickname={user.nickname}
          count={echoMemorySummary.totalCount}
          echoMemories={echoMemorySummary.echoMemories}
        />
      </Container>
    </>
  );
};

export default MypageMain;
