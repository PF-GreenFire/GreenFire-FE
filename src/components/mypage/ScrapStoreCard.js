import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ScrapStoreCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(`/store/${item.storeCode || item.id}`)}
    >
      <img
        src={item.image || "https://via.placeholder.com/300x200"}
        alt={item.name}
        className="w-full h-[120px] object-cover"
      />

      <div className="p-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-xs mb-1">{item.location}</p>
            <h3 className="text-base font-semibold text-green-primary mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.name}
            </h3>
          </div>
          <button className="p-0 border-none bg-transparent flex-shrink-0">
            <FaRegHeart className="text-red-500" />
          </button>
        </div>
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-500 text-[10px] py-1 px-2 rounded-xl"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapStoreCard;
