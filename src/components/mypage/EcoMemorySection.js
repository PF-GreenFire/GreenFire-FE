import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";

const EcoMemorySection = ({ nickname, count, echoMemories = [] }) => {
  const navigate = useNavigate();

  const displayMemories = echoMemories.slice(0, 5);
  const hasMore = echoMemories.length > 5;

  return (
    <section className="mb-6">
      <SectionHeader
        title={`${nickname}님의 에코메모리`}
        count={count}
        navigateTo="/mypage/eco-memories"
      />
      {echoMemories.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {displayMemories.map((memory) => (
            <div
              key={memory.id}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer"
              onClick={() => navigate(`/feed/${memory.id}`)}
            >
              <img
                src={memory.image}
                alt={memory.title || "에코메모리"}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {hasMore && (
            <div
              className="aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center border border-gray-200"
              onClick={() => navigate("/mypage/eco-memories")}
            >
              <span className="text-2xl text-gray-500 font-bold">···</span>
            </div>
          )}
        </div>
      ) : (
        <EmptyState message="에코메모리를 시작해보세요!" />
      )}
    </section>
  );
};

export default EcoMemorySection;
