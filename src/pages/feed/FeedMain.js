import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { getFeedListAPI, resetFeedListAction } from "../../apis/feedAPI";
import { useAuth } from "../../hooks/useAuth";
import FeedCard from "../../components/feed/FeedCard";

const TABS = [
  { key: "", label: "전체" },
  { key: "CHALLENGE", label: "챌린지 인증" },
  { key: "GREENFIRE", label: "장소 후기" },
];

const FeedMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState("");
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const { feedList, loading } = useSelector((state) => state.feedReducer);
  const { posts, hasMore } = feedList;

  // 초기 로드
  useEffect(() => {
    dispatch(resetFeedListAction());
    dispatch(getFeedListAPI(activeTab, 0));
  }, [dispatch, activeTab]);

  // 무한스크롤 IntersectionObserver
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        dispatch(getFeedListAPI(activeTab, feedList.page + 1));
      }
    },
    [dispatch, activeTab, feedList.page, hasMore, loading]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  const handleTabChange = (tabKey) => {
    if (tabKey === activeTab) return;
    setActiveTab(tabKey);
  };

  return (
    <div className="pb-24">
      {/* 탭 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 px-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`border-none py-2 px-4 rounded-full text-[13px] cursor-pointer whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-admin-green text-white font-bold shadow-[0_2px_8px_rgba(30,158,87,0.25)]"
                : "bg-white text-gray-500 font-medium shadow-card"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 피드 카드 목록 */}
      <div className="flex flex-col gap-0">
        {posts.map((post) => (
          <FeedCard key={post.postCode} post={post} />
        ))}
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="text-center py-6">
          <Spinner animation="border" variant="success" size="sm" />
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📝</div>
          <p className="text-sm m-0">아직 피드가 없습니다.</p>
          {isLoggedIn && (
            <button
              onClick={() => navigate("/feed/create")}
              className="mt-4 bg-admin-green text-white border-none rounded-full py-2 px-6 text-sm font-semibold cursor-pointer hover:bg-admin-green-dark transition-all"
            >
              첫 피드 작성하기
            </button>
          )}
        </div>
      )}

      {/* 무한스크롤 감지 요소 */}
      <div ref={sentinelRef} className="h-4" />

      {/* FAB 글쓰기 버튼 */}
      {isLoggedIn && (
        <button
          onClick={() => navigate("/feed/create")}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-admin-green text-white rounded-full shadow-lg flex items-center justify-center border-none cursor-pointer hover:bg-admin-green-dark hover:scale-105 transition-all"
          style={{ maxWidth: "calc((563px - 32px))", right: "max(16px, calc((100vw - 563px) / 2 + 16px))" }}
        >
          <FaPlus size={20} />
        </button>
      )}
    </div>
  );
};

export default FeedMain;
