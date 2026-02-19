import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaStar, FaRegStar, FaEye } from 'react-icons/fa';
import api from '../../apis/axios';
import { getImageUrl } from '../../utils/imageUtils';

const TYPE_FILTERS = [
  { key: '', label: '전체' },
  { key: 'CHALLENGE', label: '챌린지 인증' },
  { key: 'GREENFIRE', label: '장소 후기' },
];

const POST_TYPE_STYLES = {
  CHALLENGE: { tw: 'bg-emerald-100 text-emerald-700', label: '챌린지' },
  GREENFIRE: { tw: 'bg-amber-100 text-amber-700', label: '장소 후기' },
};

const AdminFeedList = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [togglingPost, setTogglingPost] = useState(null);

  useEffect(() => {
    fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, typeFilter]);

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 20 });
      if (typeFilter) params.append('type', typeFilter);
      const result = await api.get(`/api/feed?${params.toString()}`);
      const data = result.data;

      if (page === 0) {
        setFeeds(data.content || []);
      } else {
        setFeeds((prev) => [...prev, ...(data.content || [])]);
      }
      setHasMore(!data.last);
    } catch (err) {
      console.error('피드 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilterChange = (newType) => {
    setTypeFilter(newType);
    setPage(0);
    setFeeds([]);
  };

  const handleToggleFeatured = async (postCode) => {
    setTogglingPost(postCode);
    try {
      const result = await api.post(`/api/admin/feed/${postCode}/feature`);
      const { featured } = result.data;
      setFeeds((prev) =>
        prev.map((f) =>
          f.postCode === postCode ? { ...f, featured } : f
        )
      );
    } catch (err) {
      console.error('추천 토글 실패:', err);
      alert('추천 상태 변경에 실패했습니다.');
    } finally {
      setTogglingPost(null);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h5 className="font-extrabold mb-5 text-lg text-gray-900">
        피드 관리
      </h5>

      {/* 타입 필터 */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleTypeFilterChange(filter.key)}
            className={`border-none py-2 px-[18px] rounded-full text-[13px] cursor-pointer whitespace-nowrap transition-all duration-200 ${
              typeFilter === filter.key
                ? 'bg-admin-green text-white font-bold shadow-[0_2px_8px_rgba(30,158,87,0.3)]'
                : 'bg-white text-gray-500 font-medium shadow-card'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* 피드 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {feeds.map((feed) => {
          const typeStyle = POST_TYPE_STYLES[feed.postType] || { tw: 'bg-gray-100 text-gray-500', label: feed.postType };
          const firstImage = feed.images && feed.images.length > 0 ? feed.images[0] : null;

          return (
            <div
              key={feed.postCode}
              className="bg-white rounded-2xl py-[18px] px-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex gap-3">
                {/* 썸네일 */}
                {firstImage && (
                  <img
                    src={getImageUrl(firstImage.path || firstImage)}
                    alt="피드 이미지"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {/* 상단: 뱃지 */}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className={`${typeStyle.tw} py-0.5 px-3 rounded-full text-[11px] font-semibold`}>
                      {typeStyle.label}
                    </span>
                    {feed.featured && (
                      <span className="bg-yellow-100 text-yellow-700 py-0.5 px-3 rounded-full text-[11px] font-semibold">
                        추천
                      </span>
                    )}
                    <span className="text-[11px] text-gray-300 ml-auto">
                      #{feed.postCode}
                    </span>
                  </div>

                  {/* 본문 미리보기 */}
                  <p className="text-sm text-gray-700 mb-1.5 leading-relaxed line-clamp-1 m-0">
                    {feed.postContent}
                  </p>

                  {/* 하단: 메타 + 액션 */}
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      <span>{feed.nickname}</span>
                      <span className="mx-1.5">|</span>
                      <span>{formatDate(feed.createdAt)}</span>
                      <span className="mx-1.5">|</span>
                      <FaEye className="inline" size={10} /> {feed.likeCount || 0}
                    </div>
                    <button
                      onClick={() => handleToggleFeatured(feed.postCode)}
                      disabled={togglingPost === feed.postCode}
                      className={`flex items-center gap-1 border-none rounded-[10px] py-1.5 px-3.5 text-xs font-semibold cursor-pointer transition-all duration-200 ${
                        feed.featured
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {feed.featured ? (
                        <><FaStar size={10} /> 추천 해제</>
                      ) : (
                        <><FaRegStar size={10} /> 추천</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="success" />
        </div>
      )}

      {!loading && feeds.length === 0 && (
        <div className="text-center py-[60px] text-gray-400">
          <div className="text-[48px] mb-4">📝</div>
          <p className="m-0 text-sm">피드가 없습니다.</p>
        </div>
      )}

      {!loading && hasMore && feeds.length > 0 && (
        <div className="text-center mt-5">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-transparent border-2 border-admin-green text-admin-green rounded-full py-2.5 px-8 font-semibold text-[13px] transition-all duration-200 hover:bg-admin-green hover:text-white"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminFeedList;
