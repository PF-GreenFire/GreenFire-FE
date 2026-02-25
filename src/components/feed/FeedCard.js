import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RiLeafFill, RiLeafLine } from "react-icons/ri";
import { FaRegComment } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { toggleLikeAPI, toggleFollowInFeedAPI } from "../../apis/feedAPI";
import { getImageUrl } from "../../utils/imageUtils";
import { shareFeedPost } from "../../utils/shareUtils";
import { useAuth } from "../../hooks/useAuth";
import Toast from "../common/Toast";

const FeedCard = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useAuth();
  const [showToast, setShowToast] = useState(false);

  // Image swipe state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const swipeDirectionRef = useRef(null); // 'horizontal' | 'vertical' | null

  // Double-tap like state
  const [showLeafAnimation, setShowLeafAnimation] = useState(false);
  const lastTapRef = useRef(0);

  const images = post.images || [];
  const imageCount = images.length;
  const isOwner = user?.userCode === post.userCode;

  // Native touchmove listener for preventing scroll during horizontal swipe
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container || imageCount <= 1) return;

    const handleNativeTouchMove = (e) => {
      if (swipeDirectionRef.current === "horizontal") {
        e.preventDefault();
      }
    };

    container.addEventListener("touchmove", handleNativeTouchMove, { passive: false });
    return () => {
      container.removeEventListener("touchmove", handleNativeTouchMove);
    };
  }, [imageCount]);

  const handleTouchStart = (e) => {
    if (imageCount <= 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    swipeDirectionRef.current = null;
    setIsSwiping(false);
  };

  const handleTouchMove = (e) => {
    if (imageCount <= 1) return;
    const diffX = e.touches[0].clientX - touchStartRef.current.x;
    const diffY = e.touches[0].clientY - touchStartRef.current.y;

    // Determine swipe direction on first significant movement
    if (!swipeDirectionRef.current) {
      if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
        swipeDirectionRef.current = Math.abs(diffX) > Math.abs(diffY) ? "horizontal" : "vertical";
      }
    }

    if (swipeDirectionRef.current === "horizontal") {
      setIsSwiping(true);
      setSwipeOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (imageCount <= 1 || swipeDirectionRef.current !== "horizontal") {
      swipeDirectionRef.current = null;
      return;
    }

    const threshold = 50;
    if (swipeOffset < -threshold && currentImageIndex < imageCount - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else if (swipeOffset > threshold && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }

    setSwipeOffset(0);
    swipeDirectionRef.current = null;
    // Delay resetting isSwiping to prevent card click
    setTimeout(() => setIsSwiping(false), 50);
  };

  const handleDoubleTap = (e) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      if (isLoggedIn && !post.liked) {
        dispatch(toggleLikeAPI(post.postCode));
      }
      setShowLeafAnimation(true);
      setTimeout(() => setShowLeafAnimation(false), 800);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    dispatch(toggleLikeAPI(post.postCode));
  };

  const handleFollowClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    dispatch(toggleFollowInFeedAPI(post.userCode, post.isFollowing));
  };

  const handleShareClick = async (e) => {
    e.stopPropagation();
    const copied = await shareFeedPost(post);
    if (copied) setShowToast(true);
  };

  const handleCardClick = () => {
    if (isSwiping) return;
    navigate(`/feed/${post.postCode}`);
  };

  const handleCloseToast = useCallback(() => setShowToast(false), []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return d.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-card mb-3 overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
        onClick={handleCardClick}
      >
        {/* 추천 배너 (팔로우하지 않는 추천 게시물) */}
        {post.featured && !post.isFollowing && !isOwner && (
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50/80">
            <RiLeafFill size={11} className="text-emerald-400" />
            <span className="text-[11px] text-emerald-600 font-medium">
              초록불 추천
            </span>
          </div>
        )}

        {/* 헤더: 아바타 + 닉네임 + 팔로우버튼 */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <img
              src={getImageUrl(post.profileImage) || "/default-profile.png"}
              alt={post.nickname}
              className="w-9 h-9 rounded-full object-cover bg-gray-100"
            />
            <span className="text-sm font-semibold text-gray-800">
              {post.nickname}
            </span>
            {isLoggedIn && !isOwner && (
              <button
                onClick={handleFollowClick}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border cursor-pointer transition-all ${
                  post.isFollowing
                    ? "bg-white text-gray-500 border-gray-300"
                    : "bg-white text-admin-green border-admin-green"
                }`}
              >
                {post.isFollowing ? "팔로잉" : "팔로우"}
              </button>
            )}
          </div>
        </div>

        {/* 챌린지/장소 배너 스트립 */}
        {(post.challengeTitle || post.storeName) && (
          <div
            className={`mx-4 mb-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
              post.postType === "CHALLENGE"
                ? "bg-emerald-50 text-emerald-700 border-l-[3px] border-emerald-500"
                : "bg-amber-50 text-amber-700 border-l-[3px] border-amber-500"
            }`}
          >
            {post.postType === "CHALLENGE" ? "🏆 " : "📍 "}
            {post.challengeTitle || post.storeName}
          </div>
        )}

        {/* 이미지 (스와이프 + 더블탭) */}
        {imageCount > 0 && (
          <div
            ref={imageContainerRef}
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleDoubleTap}
          >
            <div
              className="flex"
              style={{
                transform: `translateX(calc(-${currentImageIndex * 100}% + ${swipeOffset}px))`,
                transition: swipeOffset === 0 ? "transform 0.3s ease-out" : "none",
              }}
            >
              {images.map((img, idx) => (
                <img
                  key={img.imageCode || idx}
                  src={getImageUrl(img.path || img)}
                  alt={`피드 이미지 ${idx + 1}`}
                  className="w-full aspect-square object-cover shrink-0"
                  draggable={false}
                />
              ))}
            </div>

            {/* 도트 인디케이터 */}
            {imageCount > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 items-center">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`rounded-full transition-all ${
                      idx === currentImageIndex
                        ? "w-4 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* 더블탭 잎 애니메이션 */}
            {showLeafAnimation && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <RiLeafFill
                  size={80}
                  className="text-emerald-400 drop-shadow-lg"
                  style={{ animation: "leafPop 0.8s ease-out forwards" }}
                />
              </div>
            )}
          </div>
        )}

        {/* 좋아요 / 댓글 / 공유 / 날짜 */}
        <div className="flex items-center gap-4 px-4 pt-2.5 pb-1">
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-1 text-sm bg-transparent border-none cursor-pointer p-0"
          >
            {post.liked ? (
              <RiLeafFill className="text-admin-green" size={17} />
            ) : (
              <RiLeafLine className="text-gray-400" size={17} />
            )}
            <span className={post.liked ? "text-admin-green font-semibold" : "text-gray-500"}>
              {post.likeCount || 0}
            </span>
          </button>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FaRegComment size={15} />
            <span>{post.commentCount || 0}</span>
          </div>
          <button
            onClick={handleShareClick}
            className="flex items-center bg-transparent border-none cursor-pointer p-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiShare2 size={15} />
          </button>
          <span className="text-xs text-gray-400 ml-auto">
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* 본문 */}
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 m-0">
            {post.postContent}
          </p>
        </div>

        {/* 댓글 미리보기 */}
        {post.latestCommentNickname && (
          <div className="px-4 pb-1">
            <p className="text-xs text-gray-500 m-0 truncate">
              <span className="font-semibold text-gray-700">{post.latestCommentNickname}</span>{" "}
              {post.latestCommentContent}
            </p>
          </div>
        )}

        {/* 독려 푸터 */}
        {(post.postType === "CHALLENGE" || post.postType === "GREENFIRE") && (
          <div className="px-4 pb-3 pt-1">
            <span className="text-[11px] text-emerald-600 font-medium">
              {post.postType === "CHALLENGE"
                ? "🌱 함께 실천 중이에요"
                : "🌿 초록 발자국을 남겼어요"}
            </span>
          </div>
        )}
      </div>

      <Toast
        message="링크가 복사되었습니다"
        show={showToast}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default FeedCard;
