import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

const MypageChallengeSection = ({ nickname, count, challenges = [] }) => {
  const navigate = useNavigate();

  // 최대 2개까지만 표시하고 더보기 카드 추가
  const displayChallenges = challenges.slice(0, 2);
  const hasMore = challenges.length > 2;

  return (
    <section className="mypage-section">
      <div className="section-header">
        <h3 className="section-title">
          {nickname}님의 챌린지 <span className="count-badge">+{count}</span>
        </h3>
        <button
          className="more-btn"
          onClick={() => navigate("/mypage/challenges")}
        >
          더보기
        </button>
      </div>
      {challenges.length > 0 ? (
        <div className="challenge-grid">
          {displayChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="challenge-item"
              onClick={() => navigate(`/challenges/${challenge.id}`)}
            >
              <Image
                src={challenge.image}
                alt={challenge.title}
                className="challenge-image"
              />
            </div>
          ))}
          {hasMore && (
            <div
              className="challenge-item more-card"
              onClick={() => navigate("/mypage/challenges")}
            >
              <span className="more-dots">···</span>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-box">
          <p className="empty-text">챌린지를 시작해보세요!</p>
        </div>
      )}
    </section>
  );
};

export default MypageChallengeSection;
