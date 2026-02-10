import React from "react";
import ScrapStoreCard from "./ScrapStoreCard";
import ScrapImageCard from "./ScrapImageCard";
import ScrapFriendCard from "./ScrapFriendCard";

const ScrapGrid = ({ scraps, activeTab, followFilter, loading, error }) => {
  const renderCard = (item) => {
    switch (activeTab) {
      case "greenFire":
        return <ScrapStoreCard key={item.id} item={item} />;
      case "challenge":
        return <ScrapImageCard key={item.id} item={item} type="challenge" />;
      case "feed":
        return <ScrapImageCard key={item.id} item={item} type="feed" />;
      case "friend":
        return (
          <ScrapFriendCard
            key={item.id}
            item={item}
            followFilter={followFilter}
          />
        );
      default:
        return <ScrapStoreCard key={item.id} item={item} />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 px-5 text-gray-600">
        <p className="text-base">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-5 text-red-500">
        <p className="text-sm">에러가 발생했습니다: {error}</p>
      </div>
    );
  }

  const gridClassName =
    activeTab === "friend"
      ? "flex flex-col gap-0 pb-20 max-h-[60vh] overflow-y-auto"
      : "grid grid-cols-3 gap-3 pb-20 max-h-[60vh] overflow-y-auto";

  return (
    <div className={gridClassName}>
      {scraps.length > 0 ? (
        scraps.map((item) => renderCard(item))
      ) : (
        <div className="col-span-full text-center py-16 px-5">
          <p className="text-[15px] text-gray-400">
            스크랩한 {activeTab}이(가) 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScrapGrid;
