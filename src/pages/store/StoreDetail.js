import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  FiClock,
  FiPhone,
  FiGlobe,
  FiChevronLeft,
  FiCoffee,
  FiCopy,
  FiNavigation,
} from "react-icons/fi";
import { getStoreDetailAPI, toggleStoreLikeAPI } from "../../apis/storeAPI";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../utils/imageUtils";
import CATEGORY_EMOJI from "../../constants/categoryConstants";

const LOCATION_STORAGE_KEY = "lastKnownLocation";

const StoreDetail = () => {
  const { storeCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const { storeDetail, storeDetailError } = useSelector(
    (state) => state.storeReducer,
  );
  const [activeTab, setActiveTab] = useState("posts");
  const [copied, setCopied] = useState(false);

  const fullAddress = storeDetail
    ? `${storeDetail.address || ""}${storeDetail.detailAddress ? ` ${storeDetail.detailAddress}` : ""}`
    : "";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("주소를 복사할 수 없습니다.");
    }
  };

  const handleDirections = () => {
    let url;
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const myLoc = JSON.parse(saved);
        url = `https://map.kakao.com/link/from/내 위치,${myLoc.lat},${myLoc.lng}/to/${encodeURIComponent(storeDetail.storeName)},${storeDetail.latitude},${storeDetail.longitude}`;
      }
    } catch {}
    if (!url) {
      url = `https://map.kakao.com/link/to/${encodeURIComponent(storeDetail.storeName)},${storeDetail.latitude},${storeDetail.longitude}`;
    }
    window.open(url, "_blank");
  };

  useEffect(() => {
    dispatch(getStoreDetailAPI(storeCode));
  }, [dispatch, storeCode]);

  if (storeDetailError) {
    return (
      <div className="text-center py-16 px-5 text-gray-400">
        <div className="text-5xl mb-4">😢</div>
        <p className="text-sm mb-4">가게 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => dispatch(getStoreDetailAPI(storeCode))}
          className="bg-green-700 text-white border-none rounded-full py-2 px-6 text-sm font-semibold hover:bg-green-800 transition-colors cursor-pointer"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!storeDetail) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-[50px]">
      {/* 배너 이미지 */}
      <div className="relative h-[200px] bg-gray-200">
        {storeDetail.images.length > 0 ? (
          <img
            src={getImageUrl(
              `location/store-image/${storeDetail.images?.[0]?.imageCode}`,
            )}
            alt={storeDetail.storeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-5xl">
            🏪
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer"
        >
          <FiChevronLeft size={20} />
        </button>
      </div>

      {/* 가게 정보 */}
      <div className="py-5 px-4">
        {/* 이름 + 카테고리 + 좋아요 */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold m-0">
              {storeDetail.storeName}
              {storeDetail.storeCategoryName && (
                <span className="ml-2 text-[13px] font-normal text-gray-500">
                  {CATEGORY_EMOJI[String(storeDetail.storeCategoryCode)]}{" "}
                  {storeDetail.storeCategoryName}
                </span>
              )}
            </h2>
            <p className="text-[13px] text-gray-500 mt-1">
              {storeDetail.address}
              {storeDetail.detailAddress && ` ${storeDetail.detailAddress}`}
            </p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  alert("로그인이 필요합니다.");
                  return;
                }
                dispatch(toggleStoreLikeAPI(storeCode, storeDetail.liked));
              }}
              className="bg-transparent border-none p-0 cursor-pointer"
            >
              {storeDetail.liked ? (
                <FaHeart size={20} className="text-red-500" />
              ) : (
                <FaRegHeart size={20} className="text-red-500" />
              )}
            </button>
            <span className="text-xs text-gray-500 mt-0.5">
              {storeDetail.likeCount || 0}
            </span>
          </div>
        </div>

        {/* 설명 */}
        {storeDetail.description && (
          <p className="text-sm text-gray-600 my-4 leading-relaxed">
            {storeDetail.description}
          </p>
        )}

        {/* 영업시간, 브레이크타임, 전화, 웹사이트 */}
        <div className="flex flex-col gap-2.5 my-4">
          {storeDetail.storeBusinessHours && (
            <div className="flex items-center gap-2">
              <FiClock size={16} className="text-gray-500 shrink-0" />
              <span className="text-sm text-gray-600">
                {storeDetail.storeBusinessHours}
              </span>
            </div>
          )}
          {storeDetail.storeBreaktimeHours && (
            <div className="flex items-center gap-2">
              <FiCoffee size={16} className="text-gray-500 shrink-0" />
              <span className="text-sm text-gray-600">
                브레이크타임 {storeDetail.storeBreaktimeHours}
              </span>
            </div>
          )}
          {storeDetail.storePhone && (
            <div className="flex items-center gap-2">
              <FiPhone size={16} className="text-gray-500 shrink-0" />
              <span className="text-sm text-gray-600">
                {storeDetail.storePhone}
              </span>
            </div>
          )}
          {storeDetail.storeLink && (
            <div className="flex items-center gap-2">
              <FiGlobe size={16} className="text-gray-500 shrink-0" />
              <span className="text-sm text-blue-500">
                {storeDetail.storeLink}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* 탭 영역 */}
      <div className="pb-[84px]">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 text-sm cursor-pointer bg-transparent border-none border-b-2 ${
              activeTab === "posts"
                ? "font-semibold text-green-800 border-green-800"
                : "font-normal text-gray-500 border-transparent"
            }`}
          >
            게시물
          </button>
          <button
            onClick={() => setActiveTab("place")}
            className={`flex-1 py-3 text-sm cursor-pointer bg-transparent border-none border-b-2 ${
              activeTab === "place"
                ? "font-semibold text-green-800 border-green-800"
                : "font-normal text-gray-500 border-transparent"
            }`}
          >
            장소
          </button>
        </div>

        {/* 게시물 탭 - 3열 이미지 그리드 */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-0.5 p-0.5 max-h-[380px] overflow-y-auto border-t border-gray-200">
            {storeDetail.posts && storeDetail.posts.length > 0 ? (
              storeDetail.posts.map((post) => (
                <div
                  key={post.postId}
                  className="aspect-square bg-gray-200 overflow-hidden border border-gray-200"
                >
                  {post.imageCode ? (
                    <img
                      src={getImageUrl(`post/image/${post.imageCode}`)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      📷
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-gray-400 text-sm text-center">
                게시물이 없습니다.
              </div>
            )}
          </div>
        )}

        {/* 장소 탭 - 지도 + 주소 + 액션 버튼 */}
        {activeTab === "place" &&
          storeDetail.latitude &&
          storeDetail.longitude && (
            <div className="p-4">
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <Map
                  center={{
                    lat: storeDetail.latitude,
                    lng: storeDetail.longitude,
                  }}
                  style={{ width: "100%", height: "200px" }}
                  level={4}
                >
                  <MapMarker
                    position={{
                      lat: storeDetail.latitude,
                      lng: storeDetail.longitude,
                    }}
                    title={storeDetail.storeName}
                  />
                </Map>
              </div>

              <p className="text-sm text-gray-600 mt-4 px-1">{fullAddress}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCopyAddress}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <FiCopy size={15} />
                  {copied ? "복사완료" : "주소 복사"}
                </button>
                <button
                  onClick={handleDirections}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-green-700 bg-green-700 text-sm text-white hover:bg-green-800 transition-colors cursor-pointer"
                >
                  <FiNavigation size={15} />
                  길찾기
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default StoreDetail;
