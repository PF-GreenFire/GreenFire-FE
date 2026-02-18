import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaSearch, FaChevronLeft, FaPlus, FaEye, FaRegClock, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getNoticeList } from '../../apis/noticeAPI';
import { useAuth } from '../../hooks/useAuth';
import AppBar from '../../components/common/AppBar';

const NoticeList = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const userCode = user?.userId || null;

  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchKeyword, page, userCode]);

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        category: category !== 'ALL' ? category : undefined,
        searchKeyword: searchKeyword || undefined,
        userCode
      };
      const response = await getNoticeList(params);
      if (page === 1) setNotices(response.notices);
      else setNotices(prev => [...prev, ...response.notices]);
      setHasMore(response.hasMore);
    } catch (err) {
      setError('공지사항을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setNotices([]);
  };

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setPage(1);
    setNotices([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;

    return d.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryBadgeClasses = (cat) => {
    switch (cat) {
      case 'EVENT': return 'bg-warning-light text-warning';
      case 'SYSTEM': return 'bg-info-light text-info';
      default: return 'bg-green-lighter text-admin-green';
    }
  };

  const getCategoryName = (cat) => {
    switch (cat) {
      case 'EVENT': return '이벤트';
      case 'SYSTEM': return '시스템';
      default: return '공지';
    }
  };

  // 히어로 카드 (첫 번째 공지)
  const HeroCard = ({ notice }) => {
    const badgeClasses = getCategoryBadgeClasses(notice.noticeCategory);
    return (
      <div
        onClick={() => navigate(`/notices/${notice.noticeCode}`)}
        className="relative rounded-[20px] overflow-hidden cursor-pointer mb-6 h-[220px] flex flex-col justify-end p-6"
        style={{
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #1E9E57 0%, #16a34a 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 우측 상단 뱃지 영역 */}
        <div className="absolute top-4 right-4 flex gap-2">
          {notice.hasImages && (
            <div className="flex items-center gap-1 text-white text-[11px] font-semibold px-2.5 py-1 rounded-[20px]"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
            >
              <FaImage size={10} />
            </div>
          )}
        </div>

        {notice.isImportant && (
          <div className="absolute top-4 left-4 bg-[#DC3545] text-white px-3 py-1 rounded-[20px] text-[11px] font-bold">
            중요
          </div>
        )}
        <div className={`inline-block px-3 py-1 rounded-[20px] text-[11px] font-semibold mb-3 w-fit ${badgeClasses}`}>
          {getCategoryName(notice.noticeCategory)}
        </div>
        <h2 className="text-white text-xl font-bold mb-2 leading-[1.3] line-clamp-2"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
        >
          {notice.noticeTitle}
        </h2>
        <div className="flex gap-4 text-white/80 text-xs">
          <span><FaRegClock className="inline mr-1" />{formatDate(notice.createdAt)}</span>
          <span><FaEye className="inline mr-1" />{notice.viewCount}</span>
        </div>
      </div>
    );
  };

  // 일반 카드
  const NoticeCard = ({ notice }) => {
    const badgeClasses = getCategoryBadgeClasses(notice.noticeCategory);
    return (
      <div
        onClick={() => navigate(`/notices/${notice.noticeCode}`)}
        className="bg-white rounded-2xl overflow-hidden cursor-pointer h-full relative transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        {/* 이미지 있음 표시 */}
        {notice.hasImages && (
          <div className="absolute top-2.5 right-2.5 bg-admin-green/10 text-admin-green w-7 h-7 rounded-lg flex items-center justify-center z-[1]">
            <FaImage size={12} />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
            <span className={`px-2.5 py-[3px] rounded-xl text-[10px] font-semibold ${badgeClasses}`}>
              {getCategoryName(notice.noticeCategory)}
            </span>
            {notice.isImportant && (
              <span className="bg-danger-light text-[#DC3545] px-2.5 py-[3px] rounded-xl text-[10px] font-semibold">
                중요
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-[#222] mb-3 leading-[1.4] line-clamp-2">
            {notice.noticeTitle}
          </h3>
          <div className="flex justify-between items-center text-[#999] text-[11px]">
            <span>{formatDate(notice.createdAt)}</span>
            <span className="flex items-center gap-[3px]">
              <FaEye size={10} />{notice.viewCount}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-[600px] mx-auto px-0 pb-[100px] bg-[#F8F9FA] min-h-screen">
        {/* 헤더 */}
        <div className="px-5 py-4 bg-white sticky top-0 z-[100] border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between">
            <button className="p-0 text-[#222] bg-transparent border-none cursor-pointer" onClick={() => navigate("/")}>
              <FaChevronLeft size={18} />
            </button>
            <h1 className="text-lg font-bold m-0">공지사항</h1>
            <div className="flex gap-4 items-center">
              <button className="p-0 text-[#222] bg-transparent border-none cursor-pointer" onClick={() => setShowSearch(v => !v)}>
                <FaSearch size={18} />
              </button>
              {role === 'ADMIN' && (
                <button className="p-0 text-admin-green bg-transparent border-none cursor-pointer" onClick={() => navigate('/notices/new')}>
                  <FaPlus size={18} />
                </button>
              )}
            </div>
          </div>

          {/* 검색 */}
          {showSearch && (
            <div className="mt-3">
              <div className="flex bg-[#F5F5F5] rounded-xl overflow-hidden">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 border-none bg-transparent py-3 px-4 text-sm outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="border-none bg-admin-green text-white py-3 px-4 cursor-pointer"
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 px-5 py-4 bg-white border-b border-[#f0f0f0] overflow-x-auto">
          {[
            { key: 'ALL', label: '전체' },
            { key: 'NOTICE', label: '공지' },
            { key: 'EVENT', label: '이벤트' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`border-none px-5 py-2 rounded-[20px] text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${
                category === cat.key
                  ? 'bg-admin-green text-white'
                  : 'bg-[#F5F5F5] text-[#666]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div className="p-5">
          {error && (
            <div className="bg-danger-light text-danger border border-danger/20 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="bg-transparent border-none text-danger text-lg cursor-pointer font-bold ml-2"
              >
                &times;
              </button>
            </div>
          )}

          {/* 히어로 (첫 번째 공지) */}
          {notices.length > 0 && page === 1 && (
            <HeroCard notice={notices[0]} />
          )}

          {/* 그리드 (나머지) */}
          <div className="grid grid-cols-2 gap-4">
            {notices.slice(page === 1 ? 1 : 0).map((notice) => (
              <NoticeCard key={notice.noticeCode} notice={notice} />
            ))}
          </div>

          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="success" />
            </div>
          )}

          {!loading && notices.length === 0 && (
            <div className="text-center py-[60px] px-5 text-[#999]">
              <div className="text-5xl mb-4">
                <span role="img" aria-label="empty">📭</span>
              </div>
              <p className="m-0 text-[15px]">등록된 공지사항이 없습니다.</p>
            </div>
          )}

          {!loading && hasMore && notices.length > 0 && (
            <div className="text-center mt-6">
              <button
                className="border border-admin-green text-admin-green bg-transparent rounded-3xl px-8 py-2.5 font-semibold cursor-pointer hover:bg-admin-green hover:text-white transition-all duration-200"
                onClick={() => setPage(prev => prev + 1)}
              >
                더 보기
              </button>
            </div>
          )}

          {!loading && !hasMore && notices.length > 0 && (
            <div className="text-center p-6 text-[#bbb] text-[13px]">
              모든 공지사항을 확인했습니다
            </div>
          )}
        </div>
      </div>

      <AppBar />
    </>
  );
};

export default NoticeList;
