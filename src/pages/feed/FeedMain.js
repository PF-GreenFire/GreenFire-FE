import React, { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { getFeedListAPI, resetFeedListAction } from "../../apis/feedAPI";
import { searchByType } from "../../apis/searchAPI";
import { useAuth } from "../../hooks/useAuth";
import usePullToRefresh from "../../hooks/usePullToRefresh";
import FeedCard from "../../components/feed/FeedCard";
import FeedSkeleton from "../../components/feed/FeedSkeleton";

const FeedMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const cursorRef = useRef(null);

  const { feedList, loading } = useSelector((state) => state.feedReducer);
  const { posts, hasMore, cursor } = feedList;

  // ref를 state와 동기화 (IntersectionObserver stale closure 방지)
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { cursorRef.current = cursor; }, [cursor]);

  // 초기 로드
  useEffect(() => {
    dispatch(resetFeedListAction());
    dispatch(getFeedListAPI("RECOMMENDED", null));
  }, [dispatch]);

  // 무한스크롤 IntersectionObserver
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreRef.current && !loadingRef.current) {
        dispatch(getFeedListAPI("RECOMMENDED", cursorRef.current));
      }
    },
    [dispatch]
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

  // Pull-to-Refresh
  const handleRefresh = useCallback(async () => {
    dispatch(resetFeedListAction());
    dispatch(getFeedListAPI("RECOMMENDED", null));
    await new Promise((r) => setTimeout(r, 800));
  }, [dispatch]);

  const { pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

  // 검색
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = 검색 안 함, [] = 결과 없음
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    const q = searchInput.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const data = await searchByType("POST", q, 30);
      setSearchResults(data.items || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchResults(null);
  };

  return (
    <div className="pb-16">
      {/* Pull-to-Refresh indicator */}
      <div
        className="overflow-hidden flex items-center justify-center transition-all"
        style={{ height: pullDistance > 0 || isRefreshing ? Math.max(pullDistance, isRefreshing ? 48 : 0) : 0 }}
      >
        <svg
          className="w-6 h-6 text-admin-green"
          style={{
            transform: `rotate(${isRefreshing ? 360 : pullDistance * 3}deg)`,
            transition: isRefreshing ? "transform 0.6s linear" : "none",
            animation: isRefreshing ? "App-logo-spin 0.8s linear infinite" : "none",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>

      {/* 검색바 */}
      <div className="mb-3">
        <div className="flex items-center border border-admin-green rounded-full px-4 py-2 bg-white gap-2">
          <input
            type="text"
            placeholder="피드 내용 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border-none text-sm focus:outline-none placeholder:text-gray-400 bg-transparent"
          />
          {searchInput && (
            <button
              onClick={handleSearchClear}
              className="text-xs text-gray-400 bg-transparent border-none cursor-pointer p-0"
            >
              ✕
            </button>
          )}
          <IoIosSearch
            className="text-xl text-admin-green flex-shrink-0 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* 검색 결과 (검색 모드일 때 기존 피드 대신 표시) */}
      {searchResults !== null && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">
            "{searchInput}" 검색 결과 {searchResults.length}건
          </p>
          {searching ? (
            <div className="text-center py-6">
              <div className="w-6 h-6 mx-auto border-2 border-admin-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              검색 결과가 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {searchResults.map((hit) => (
                <li
                  key={hit.id}
                  onClick={() => navigate(`/feed/${hit.id}`)}
                  className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded"
                >
                  <p className="text-sm text-gray-800 m-0 line-clamp-2">
                    {hit.title}
                    {hit.title?.length >= 40 && "..."}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 글쓰기 유도 영역 (로그인 시만) */}
      {isLoggedIn && (
        <div
          onClick={() => navigate("/feed/create")}
          className="mb-3 bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-lg">
              🌱
            </div>
            <span className="text-sm text-gray-500">
              나의 초록 이야기를 들려주세요
            </span>
          </div>
        </div>
      )}

      {/* 스켈레톤 로딩 (초기 로드) */}
      {loading && posts.length === 0 && <FeedSkeleton count={3} />}

      {/* 피드 카드 목록 */}
      <div className="flex flex-col gap-0">
        {posts.map((post) => (
          <FeedCard key={post.postCode} post={post} />
        ))}
      </div>

      {/* 로딩 (추가 로드) */}
      {loading && posts.length > 0 && (
        <div className="text-center py-6">
          <div className="w-6 h-6 mx-auto border-2 border-admin-green border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 빈 상태 (전체 게시물 없음) */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🌍</div>
          <p className="text-sm font-medium text-gray-500 m-0">아직 초록 실천이 없어요</p>
          <p className="text-xs text-gray-400 mt-1 m-0">첫 번째 초록 발자국을 남겨보세요!</p>
          {isLoggedIn && (
            <button
              onClick={() => navigate("/feed/create")}
              className="mt-4 bg-admin-green text-white border-none rounded-full py-2 px-6 text-sm font-semibold cursor-pointer hover:bg-admin-green-dark transition-all"
            >
              🌱 실천 기록 남기기
            </button>
          )}
        </div>
      )}

      {/* 모든 피드를 다 봤을 때 */}
      {!loading && !hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">🌿</div>
          <p className="text-sm m-0">오늘의 초록 실천을 모두 확인했어요</p>
          <p className="text-xs mt-1 m-0">함께 실천하는 우리, 대단해요! 🙌</p>
        </div>
      )}

      {/* 무한스크롤 감지 요소 */}
      <div ref={sentinelRef} className="h-4" />
    </div>
  );
};

export default FeedMain;
