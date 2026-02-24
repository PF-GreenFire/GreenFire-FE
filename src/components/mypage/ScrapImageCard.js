import React from "react";
import { getImageUrl } from "../../utils/imageUtils";

const ScrapImageCard = ({ item, type = "challenge" }) => {
  const displayText = type === "feed" ? item.author : item.challengeTitle;

  return (
    <div className="text-center cursor-pointer group">
      <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={getImageUrl(item.thumbnailUrl) || getImageUrl(item.image)}
          alt={displayText}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <p className="mt-2 mb-0 text-[13px] text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
        {displayText}
      </p>
    </div>
  );
};

export default ScrapImageCard;
