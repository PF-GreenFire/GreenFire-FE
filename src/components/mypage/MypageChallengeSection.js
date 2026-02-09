import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";

const MypageChallengeSection = ({ nickname, count, challenges = [] }) => {
  const navigate = useNavigate();

  const displayChallenges = challenges.slice(0, 2);
  const hasMore = challenges.length > 2;

  return (
    <section className="mb-6">
      <SectionHeader
        title={`${nickname}님의 챌린지`}
        count={count}
        navigateTo="/mypage/challenges"
      />
      {challenges.length > 0 ? (
        <div className="flex gap-3">
          {displayChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer"
              onClick={() => navigate(`/challenges/${challenge.id}`)}
            >
              <img
                src={challenge.image}
                alt={challenge.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {hasMore && (
            <div
              className="flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center border border-gray-200"
              onClick={() => navigate("/mypage/challenges")}
            >
              <span className="text-2xl text-gray-500 font-bold">···</span>
            </div>
          )}
        </div>
      ) : (
        <EmptyState message="챌린지를 시작해보세요!" />
      )}
    </section>
  );
};

export default MypageChallengeSection;
