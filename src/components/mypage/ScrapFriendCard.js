import React from "react";
import "./ScrapCard.css";

/**
 * 친구 스크랩 카드 컴포넌트 - 가로형 레이아웃
 */
const ScrapFriendCard = ({ item, onLikeToggle }) => {
  const handleMessageClick = (e) => {
    e.stopPropagation();
    // 우체통(메시지) 기능
  };

  return (
    <div className="friend-card-horizontal">
      <div className="friend-profile-image">
        <img
          src={item.profileImage || "https://via.placeholder.com/80x80"}
          alt={item.nickname}
        />
      </div>
      <div className="friend-info">
        <h3 className="friend-nickname">{item.nickname}</h3>
        <p className="friend-id">{item.userId || item.email}</p>
        {item.bio && <p className="friend-bio-text">{item.bio}</p>}
      </div>
      <button className="friend-message-btn" onClick={handleMessageClick}>
        우체통
      </button>
    </div>
  );
};

export default ScrapFriendCard;
