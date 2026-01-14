import React from 'react';
import { FiHeart } from 'react-icons/fi';
import './ScrapCard.css';

/**
 * 친구 스크랩 카드 컴포넌트
 */
const ScrapFriendCard = ({ item, onLikeToggle }) => {
    const handleLikeClick = (e) => {
        e.stopPropagation();
        if (onLikeToggle) {
            onLikeToggle(item.id, item.liked);
        }
    };

    return (
        <div className="scrap-card friend-card">
            <div className="card-image-wrapper">
                <img
                    src={item.profileImage || 'https://via.placeholder.com/300x200'}
                    alt={item.nickname}
                    className="card-image"
                />
                <button className="like-btn" onClick={handleLikeClick}>
                    <FiHeart
                        fill={item.liked ? '#FF6B6B' : 'none'}
                        color="#FF6B6B"
                        size={20}
                    />
                </button>
            </div>
            <div className="card-content">
                <h3 className="card-name">{item.nickname}</h3>
                {item.bio && (
                    <p className="friend-bio">{item.bio}</p>
                )}
                {item.stats && (
                    <div className="friend-stats">
                        <span>챌린지 {item.stats.challenges}개</span>
                        <span>포스트 {item.stats.posts}개</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScrapFriendCard;
