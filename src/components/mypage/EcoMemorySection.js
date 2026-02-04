import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

const EcoMemorySection = ({ nickname, count, echoMemories = [] }) => {
  const navigate = useNavigate();

  const displayMemories = echoMemories.slice(0, 5);
  const hasMore = echoMemories.length > 5;

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800 m-0">
          {nickname}님의 에코메모리{" "}
          <span className="text-sm font-normal text-gray-500">+{count}</span>
        </h3>
        <button
          className="bg-transparent border-none text-gray-500 text-sm cursor-pointer p-0 hover:text-green-primary"
          onClick={() => navigate("/mypage/eco-memories")}
        >
          더보기
        </button>
      </div>
      {echoMemories.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {displayMemories.map((memory) => (
            <div
              key={memory.id}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer"
              onClick={() => navigate(`/feed/${memory.id}`)}
            >
              <Image
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
        <div className="bg-gray-100 rounded-xl py-10 px-5 flex items-center justify-center">
          <p className="text-gray-500 text-sm m-0">
            에코메모리를 시작해보세요!
          </p>
        </div>
      )}
    </section>
  );
};

export default EcoMemorySection;
