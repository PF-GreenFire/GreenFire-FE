import React from 'react';
import { FiHeart } from 'react-icons/fi';
import './ScrapCard.css';

/**
 * 초록불(가게) 스크랩 카드 컴포넌트
 */
const ScrapStoreCard = ({ item, onLikeToggle }) => {
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
                    alt={item.name}
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
                <p className="card-location">{item.location}</p>
                <h3 className="card-name">{item.name}</h3>
                <div className="card-tags">
                    {item.tags && item.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrapStoreCard;
