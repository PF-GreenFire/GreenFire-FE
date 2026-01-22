import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

const EcoMemorySection = ({ nickname, count, memories = [] }) => {
  const navigate = useNavigate();

  // 최대 5개까지만 표시하고 더보기 카드 추가
  const displayMemories = memories.slice(0, 5);
  const hasMore = memories.length > 5;

  return (
    <section className="mypage-section">
      <div className="section-header">
        <h3 className="section-title">
          {nickname}님의 에코메모리{" "}
          <span className="count-badge">+{count}</span>
        </h3>
        <button
          className="more-btn"
          onClick={() => navigate("/mypage/eco-memories")}
        >
          더보기
        </button>
      </div>
      {memories.length > 0 ? (
        <div className="eco-memory-grid">
          {displayMemories.map((memory) => (
            <div
              key={memory.id}
              className="eco-memory-item"
              onClick={() => navigate(`/feed/${memory.id}`)}
            >
              <Image
                src={memory.image}
                alt={memory.title || "에코메모리"}
                className="eco-memory-image"
              />
            </div>
          ))}
          {hasMore && (
            <div
              className="eco-memory-item more-card"
              onClick={() => navigate("/mypage/eco-memories")}
            >
              <span className="more-dots">···</span>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-box">
          <p className="empty-text">에코메모리를 시작해보세요!</p>
        </div>
      )}
    </section>
  );
};

export default EcoMemorySection;
