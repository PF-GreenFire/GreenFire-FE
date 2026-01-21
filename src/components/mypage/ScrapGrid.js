import React from 'react';
import ScrapStoreCard from '../item/card/ScrapStoreCard';
import ScrapChallengeCard from '../item/card/ScrapChallengeCard';
import ScrapFeedCard from '../item/card/ScrapFeedCard';
import ScrapFriendCard from '../item/card/ScrapFriendCard';

const ScrapGrid = ({ scraps, currentCategory, loading, error, onLikeToggle }) => {
  // 카테고리별 카드 렌더링
  const renderCard = (item) => {
    const props = {
      item,
      onLikeToggle: onLikeToggle
    };

    switch (currentCategory) {
      case '초록불':
        return <ScrapStoreCard key={item.id} {...props} />;
      case '챌린지':
        return <ScrapChallengeCard key={item.id} {...props} />;
      case '피드':
        return <ScrapFeedCard key={item.id} {...props} />;
      case '친구':
        return <ScrapFriendCard key={item.id} {...props} />;
      default:
        return <ScrapStoreCard key={item.id} {...props} />;
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

  return (
    <div className="scrap-grid">
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
