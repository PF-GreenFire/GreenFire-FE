import { useNavigate } from "react-router-dom";
const MypageChallengeSection = ({ nickname, count, challenges = [] }) => {
  const navigate = useNavigate();

  const displayChallenges = challenges.slice(0, 2);
  const hasMore = challenges.length > 2;

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800 m-0">
          {nickname}님의 챌린지 <span className="text-sm font-normal text-gray-500">+{count}</span>
        </h3>
        <button
          className="bg-transparent border-none text-gray-500 text-sm cursor-pointer p-0 hover:text-green-primary"
          onClick={() => navigate("/mypage/challenges")}
        >
          더보기
        </button>
      </div>
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
        <div className="bg-gray-100 rounded-xl py-10 px-5 flex items-center justify-center">
          <p className="text-gray-500 text-sm m-0">챌린지를 시작해보세요!</p>
        </div>
      )}
    </section>
  );
};

export default MypageChallengeSection;
