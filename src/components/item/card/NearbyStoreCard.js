import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { getImageUrl } from "../../../utils/imageUtils";
import { toggleStoreLikeAPI } from "../../../apis/storeAPI";
import { useAuth } from "../../../hooks/useAuth";

const NearbyStoreCard = ({ store }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();

  return (
    <div
      className="flex gap-3 p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => navigate(`/store/${store.storeCode}`)}
    >
      {/* 썸네일 */}
      <div className="flex-shrink-0 w-[80px] h-[80px] rounded-xl overflow-hidden bg-gray-100">
        {store.imageCode && (
          <img
            src={getImageUrl(`location/store-image/${store.imageCode}`)}
            alt={store.storeName}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-gray-900 truncate">
              {store.storeName}
              {store.storeCategory && (
                <span className="ml-1.5 text-[13px] font-normal text-gray-400">
                  {store.storeCategory}
                </span>
              )}
            </p>
            <p className="text-[13px] text-gray-500 mt-0.5">{store.address}</p>
          </div>
          <button
            className="flex-shrink-0 ml-2 p-1 bg-transparent border-none cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // if (!isLoggedIn) {
              //   alert("로그인이 필요합니다.");
              //   return;
              // }
              dispatch(toggleStoreLikeAPI(store.storeCode, store.liked));
            }}
          >
            {store.liked ? (
              <FaHeart size={16} className="text-red-500" />
            ) : (
              <FaRegHeart size={16} className="text-gray-400" />
            )}
          </button>
        </div>

        {store.description && (
          <p className="text-[13px] text-gray-600 mt-1 line-clamp-2">
            {store.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default NearbyStoreCard;
