import React from 'react';
import { FiHeart } from 'react-icons/fi';
import './ScrapCard.css';

/**
 * 챌린지 스크랩 카드 컴포넌트
 */
const ScrapChallengeCard = ({ item, onLikeToggle }) => {
    const handleLikeClick = (e) => {
        e.stopPropagation();
        if (onLikeToggle) {
            onLikeToggle(item.id, item.liked);
        }
    };

    return (
        <div className="scrap-card">
            <div className="card-image-wrapper">
                <img
                    src={item.image || 'https://via.placeholder.com/300x200'}
                    alt={item.title}
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
                <h3 className="card-name">{item.title}</h3>
                <div className="challenge-info">
                    <span className={`status-badge ${item.status}`}>
                        {item.status}
                    </span>
                    {item.participants && (
                        <span className="participants-count">
                            참여자 {item.participants}명
                        </span>
                    )}
                </div>
                {item.tags && (
                    <div className="card-tags">
                        {item.tags.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScrapChallengeCard;
