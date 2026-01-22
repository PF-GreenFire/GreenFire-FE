import React from "react";
import "./ScrapCard.css";

/**
 * 챌린지/피드 공통 스크랩 카드 컴포넌트
 * - 이미지 + 하단 텍스트로 구성
 * - type: 'challenge' | 'feed'
 */
const ScrapImageCard = ({ item, type = "challenge" }) => {
  // 표시할 텍스트 결정
  const displayText = type === "feed" ? item.author : item.title;

  return (
    <div className="scrap-image-card">
      <div className="scrap-image-wrapper">
        <img
          src={item.image || "https://via.placeholder.com/300x300"}
          alt={displayText}
          className="scrap-image"
        />
      </div>
      <p className="scrap-image-label">{displayText}</p>
    </div>
  );
};

export default ScrapImageCard;
