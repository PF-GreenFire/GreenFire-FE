import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const NearbyStoreCard = ({ store }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex gap-3 p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => navigate(`/store/${store.storeCode}`)}
    >
      {/* 썸네일 */}
      <div className="flex-shrink-0 w-[80px] h-[80px] rounded-xl overflow-hidden bg-gray-100">
        <img
          src={store.imageUrl || "https://via.placeholder.com/80x80"}
          alt={store.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-gray-900 truncate">
              {store.name}
              {store.category && (
                <span className="ml-1.5 text-[13px] font-normal text-gray-400">
                  {store.category}
                </span>
              )}
            </p>
            <p className="text-[13px] text-gray-500 mt-0.5">{store.address}</p>
          </div>
          <button
            className="flex-shrink-0 ml-2 p-1 bg-transparent border-none text-gray-400 hover:text-red-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <FaRegHeart size={16} />
          </button>
        </div>

        {store.description && (
          <p className="text-[13px] text-gray-600 mt-1 line-clamp-2">
            {store.description}
          </p>
        )}

        {/* 태그 배지 */}
        {store.tags && store.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {store.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-green-lighter text-green-primary text-[11px] font-medium rounded-full border border-green-primary/20"
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

export default NearbyStoreCard;
