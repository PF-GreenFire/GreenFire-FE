import React from "react";
import { FaHeart } from "react-icons/fa";

const ScrapCardsSection = ({ onCardClick }) => {
  const cards = [
    {
      type: "places",
      label: "저장한 장소",
      image: "/images/scrap-places.png",
      fallback: "https://picsum.photos/150/100?random=places",
    },
    {
      type: "challenges",
      label: "챌린지",
      image: "/images/scrap-challenges.png",
      fallback: "https://picsum.photos/150/100?random=challenges",
    },
    {
      type: "achievements",
      label: "달성한 업적",
      image: "/images/scrap-achievements.png",
      fallback: "https://picsum.photos/150/100?random=achievements",
    },
  ];

  return (
    <div className="flex gap-2 py-3 overflow-x-auto scrollbar-none">
      {cards.map((card) => (
        <div
          key={card.type}
          className="relative min-w-[120px] h-[80px] rounded-xl overflow-hidden cursor-pointer flex-shrink-0 transition-transform hover:scale-[1.02]"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 py-2 px-2.5 flex items-center gap-1">
            <FaHeart className="text-white text-[10px]" />
            <span className="text-white text-[11px] font-medium">
              {card.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrapCardsSection;
