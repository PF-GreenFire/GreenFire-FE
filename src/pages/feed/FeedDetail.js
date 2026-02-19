import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import {
  FaChevronLeft,
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaTrash,
  FaEllipsisV,
  FaChevronRight,
} from "react-icons/fa";
import {
  getFeedDetailAPI,
  toggleLikeAPI,
  getCommentsAPI,
  addCommentAPI,
  deleteCommentAPI,
  deleteFeedPostAPI,
} from "../../apis/feedAPI";
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

const FeedDetail = () => {
  const { postCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useAuth();
  const commentInputRef = useRef(null);

  const { feedDetail, comments, loading } = useSelector(
    (state) => state.feedReducer
  );
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    dispatch(getFeedDetailAPI(postCode));
    dispatch(getCommentsAPI(postCode));
  }, [dispatch, postCode]);

  const handleLike = () => {
    if (!isLoggedIn) return;
    dispatch(toggleLikeAPI(Number(postCode)));
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !isLoggedIn) return;
    dispatch(addCommentAPI(postCode, commentText.trim()));
    setCommentText("");
  };

  const handleDeleteComment = (commentCode) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      dispatch(deleteCommentAPI(commentCode));
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("이 피드를 삭제하시겠습니까?")) return;
    try {
      await dispatch(deleteFeedPostAPI(postCode));
      navigate("/feed", { replace: true });
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !feedDetail) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!feedDetail) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>피드를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/feed")}
          className="mt-2 text-admin-green bg-transparent border-none cursor-pointer text-sm underline"
        >
          피드 목록으로
        </button>
      </div>
    );
  }

  const images = feedDetail.images || [];
  const isOwner = user?.userCode === feedDetail.userCode;

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <div className="flex items-center justify-between py-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none cursor-pointer p-1 text-gray-600"
        >
          <FaChevronLeft size={18} />
        </button>
        <span className="font-bold text-base">피드</span>
        <div className="relative">
          {isOwner && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-transparent border-none cursor-pointer p-1 text-gray-500"
            >
              <FaEllipsisV size={16} />
            </button>
          )}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white shadow-lg rounded-xl py-1 z-10 min-w-[100px]">
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDeletePost();
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 bg-transparent border-none cursor-pointer hover:bg-gray-50"
              >
                <FaTrash size={12} /> 삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 px-1 mb-3">
        <img
          src={getImageUrl(feedDetail.profileImage) || "/default-profile.png"}
          alt={feedDetail.nickname}
          className="w-10 h-10 rounded-full object-cover bg-gray-100"
        />
        <div>
          <div className="text-sm font-semibold text-gray-800">
            {feedDetail.nickname}
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(feedDetail.createdAt)}
          </div>
        </div>
      </div>

      {/* 이미지 슬라이드 */}
      {images.length > 0 && (
        <div className="relative mb-3 -mx-[15px]">
          <img
            src={getImageUrl(images[currentImageIndex]?.path || images[currentImageIndex])}
            alt={`이미지 ${currentImageIndex + 1}`}
            className="w-full aspect-square object-cover"
          />
          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex((i) => i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border-none cursor-pointer"
                >
                  <FaChevronLeft size={14} />
                </button>
              )}
              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex((i) => i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border-none cursor-pointer"
                >
                  <FaChevronRight size={14} />
                </button>
              )}
              {/* 인디케이터 */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? "bg-white w-4"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 좋아요 / 댓글 */}
      <div className="flex items-center gap-4 px-1 mb-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
        >
          {feedDetail.liked ? (
            <FaHeart className="text-red-500" size={20} />
          ) : (
            <FaRegHeart className="text-gray-500" size={20} />
          )}
          <span
            className={`text-sm font-semibold ${
              feedDetail.liked ? "text-red-500" : "text-gray-600"
            }`}
          >
            {feedDetail.likeCount || 0}
          </span>
        </button>
        <button
          onClick={() => commentInputRef.current?.focus()}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
        >
          <FaRegComment className="text-gray-500" size={19} />
          <span className="text-sm text-gray-600">{comments.length}</span>
        </button>
      </div>

      {/* 본문 + 태그 */}
      <div className="px-1 mb-4">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap m-0">
          {feedDetail.postContent}
        </p>
        {feedDetail.postType && (
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                POST_TYPE_STYLES[feedDetail.postType] ||
                "bg-gray-100 text-gray-500"
              }`}
            >
              {POST_TYPE_LABELS[feedDetail.postType] || feedDetail.postType}
            </span>
            {(feedDetail.challengeTitle || feedDetail.storeName) && (
              <span className="text-xs text-gray-500">
                {feedDetail.challengeTitle || feedDetail.storeName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 댓글 구분선 */}
      <div className="border-t border-gray-100 mx-1 mb-3" />

      {/* 댓글 목록 */}
      <div className="px-1 mb-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          댓글 {comments.length}
        </h3>
        {comments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {comments.map((comment) => (
              <div key={comment.commentCode} className="flex gap-2.5">
                <img
                  src={
                    getImageUrl(comment.profileImage) || "/default-profile.png"
                  }
                  alt={comment.nickname}
                  className="w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800">
                      {comment.nickname}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                    {user?.userCode === comment.userCode && (
                      <button
                        onClick={() =>
                          handleDeleteComment(comment.commentCode)
                        }
                        className="ml-auto bg-transparent border-none text-gray-400 cursor-pointer p-0 hover:text-red-500"
                      >
                        <FaTrash size={10} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 m-0 mt-0.5 leading-relaxed">
                    {comment.commentContent || comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 댓글 입력 - 하단 고정 */}
      {isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
          <div className="max-w-[563px] mx-auto flex gap-2">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="댓글을 입력해주세요..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="bg-admin-green text-white border-none rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-admin-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedDetail;
