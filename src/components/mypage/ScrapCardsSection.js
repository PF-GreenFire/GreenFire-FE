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
    <Row className="m-0 p-0">
      <div className="flex gap-3 p-4 overflow-x-auto scrollbar-none">
        {cards.map((card) => (
          <div
            key={card.type}
            className="relative min-w-[140px] h-[90px] rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
            onClick={() => onCardClick(card.type)}
          >
            <img
              src={card.image}
              alt={card.label}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = card.fallback;
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-gradient-to-t from-black/60 to-transparent flex items-center gap-1.5">
              <FaHeart className="text-white text-xs" />
              <span className="text-white text-xs font-medium">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
    </Row>
  );
};

export default ScrapCardsSection;
