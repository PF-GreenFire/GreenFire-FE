import React from "react";
import ScrapStoreCard from "./ScrapStoreCard";
import ScrapImageCard from "./ScrapImageCard";
import ScrapFriendCard from "./ScrapFriendCard";

const ScrapGrid = ({ scraps, currentCategory, loading, error }) => {
  // 카테고리별 카드 렌더링
  const renderCard = (item) => {
    switch (currentCategory) {
      case "초록불":
        return <ScrapStoreCard key={item.id} item={item} />;
      case "챌린지":
        return <ScrapImageCard key={item.id} item={item} type="challenge" />;
      case "피드":
        return <ScrapImageCard key={item.id} item={item} type="feed" />;
      case "친구":
        return <ScrapFriendCard key={item.id} item={item} />;
      default:
        return <ScrapStoreCard key={item.id} item={item} />;
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="loading-container">
        <p>로딩 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="error-container">
        <p>에러가 발생했습니다: {error}</p>
      </div>
    );
  }

  // 카테고리별 그리드 클래스 결정
  const getGridClassName = () => {
    if (currentCategory === "친구") {
      return "scrap-grid scrap-grid-friend";
    }
    return "scrap-grid scrap-grid-3col";
  };

  return (
    <div className={getGridClassName()}>
      {scraps.length > 0 ? (
        scraps.map((item) => renderCard(item))
      ) : (
        <div className="empty-state">
          <p>스크랩한 {currentCategory}이(가) 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ScrapGrid;
