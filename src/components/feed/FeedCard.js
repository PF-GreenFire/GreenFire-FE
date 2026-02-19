import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { toggleLikeAPI } from "../../apis/feedAPI";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuth } from "../../hooks/useAuth";

const POST_TYPE_LABELS = {
  CHALLENGE: "챌린지 인증",
  GREENFIRE: "장소 후기",
};

const POST_TYPE_STYLES = {
  CHALLENGE: "bg-emerald-100 text-emerald-700",
  GREENFIRE: "bg-amber-100 text-amber-700",
};

const FeedCard = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();

  const firstImage =
    post.images && post.images.length > 0 ? post.images[0] : null;
  const imageCount = post.images ? post.images.length : 0;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    dispatch(toggleLikeAPI(post.postCode));
  };

  const handleCardClick = () => {
    navigate(`/feed/${post.postCode}`);
  };

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
    <div
      className="bg-white rounded-2xl shadow-card mb-3 overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
      onClick={handleCardClick}
    >
      {/* 헤더: 아바타 + 닉네임 + 타입뱃지 */}
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
        </div>
        {post.postType && (
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              POST_TYPE_STYLES[post.postType] || "bg-gray-100 text-gray-500"
            }`}
          >
            {POST_TYPE_LABELS[post.postType] || post.postType}
          </span>
        )}
      </div>

      {/* 이미지 */}
      {firstImage && (
        <div className="relative">
          <img
            src={getImageUrl(firstImage.path || firstImage)}
            alt="피드 이미지"
            className="w-full aspect-square object-cover"
          />
          {imageCount > 1 && (
            <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              +{imageCount - 1}
            </span>
          )}
        </div>
      )}

      {/* 좋아요 / 댓글 / 날짜 */}
      <div className="flex items-center gap-4 px-4 pt-2.5 pb-1">
        <button
          onClick={handleLikeClick}
          className="flex items-center gap-1 text-sm bg-transparent border-none cursor-pointer p-0"
        >
          {post.liked ? (
            <FaHeart className="text-red-500" size={16} />
          ) : (
            <FaRegHeart className="text-gray-400" size={16} />
          )}
          <span className={post.liked ? "text-red-500 font-semibold" : "text-gray-500"}>
            {post.likeCount || 0}
          </span>
        </button>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FaRegComment size={15} />
          <span>{post.commentCount || 0}</span>
        </div>
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

      {/* 챌린지/장소 태그 */}
      {(post.challengeTitle || post.storeName) && (
        <div className="px-4 pb-3">
          <span className="inline-block text-[11px] bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            {post.postType === "CHALLENGE" ? "🏆 " : "📍 "}
            {post.challengeTitle || post.storeName}
          </span>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
