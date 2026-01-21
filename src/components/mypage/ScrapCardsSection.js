import React from 'react';
import { Row } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';

const ScrapCardsSection = ({ onCardClick }) => {
  const cards = [
    { type: 'places', label: '저장한 장소', image: '/images/scrap-places.png', fallback: 'https://picsum.photos/150/100?random=places' },
    { type: 'challenges', label: '챌린지', image: '/images/scrap-challenges.png', fallback: 'https://picsum.photos/150/100?random=challenges' },
    { type: 'achievements', label: '달성한 업적', image: '/images/scrap-achievements.png', fallback: 'https://picsum.photos/150/100?random=achievements' },
  ];

  return (
    <Row className="scrap-cards-row">
      <div className="scrap-cards-container">
        {cards.map((card) => (
          <div key={card.type} className="scrap-card" onClick={() => onCardClick(card.type)}>
            <img
              src={card.image}
              alt={card.label}
              className="scrap-card-image"
              onError={(e) => {
                e.target.src = card.fallback;
              }}
            />
            <div className="scrap-card-overlay">
              <FaHeart className="scrap-heart" />
              <span className="scrap-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
    </Row>
  );
};

export default ScrapCardsSection;
