import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaRegClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getNoticeList, deleteNotice } from '../../apis/noticeAPI';

const AdminNoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchKeyword]);

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        searchKeyword: searchKeyword || undefined,
      };
      const response = await getNoticeList(params);
      if (page === 1) setNotices(response.notices);
      else setNotices(prev => [...prev, ...response.notices]);
      setHasMore(response.hasMore);
    } catch (err) {
      console.error(err);
      setError('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setPage(1);
    setNotices([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleDelete = async (noticeCode) => {
    const ok = window.confirm('정말 삭제할까요? 삭제 후 복구할 수 없습니다.');
    if (!ok) return;
    try {
      await deleteNotice(noticeCode);
      setNotices(prev => prev.filter(n => n.noticeCode !== noticeCode));
      alert('삭제되었습니다.');
    } catch (e) {
      console.error(e);
      alert('삭제에 실패했습니다.');
    }
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

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'EVENT': return { bg: 'bg-warning-light', color: 'text-warning', label: '이벤트' };
      case 'SYSTEM': return { bg: 'bg-info-light', color: 'text-info', label: '시스템' };
      default: return { bg: 'bg-green-lighter', color: 'text-admin-green', label: '공지' };
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-5">
        <h5 className="font-extrabold m-0 text-lg text-gray-900">
          공지사항 관리
        </h5>
        <button
          onClick={() => navigate('/notices/new')}
          className="flex items-center gap-1.5 bg-admin-green text-white border-none rounded-full py-2 px-5 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-admin-green-dark"
        >
          <FaPlus size={12} /> 등록
        </button>
      </div>

      {/* 검색바 */}
      <div className="flex bg-white rounded-[14px] overflow-hidden shadow-card mb-5">
        <div className="flex items-center pl-4 text-gray-400">
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          placeholder="제목 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 border-none bg-transparent p-3 text-sm outline-none"
        />
        <button
          onClick={handleSearch}
          className="border-none bg-admin-green text-white py-3 px-5 cursor-pointer font-semibold text-[13px]"
        >
          검색
        </button>
      </div>

      {error && (
        <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right text-danger font-bold ml-2">&times;</button>
        </div>
      )}

      {/* 공지사항 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {notices.map((notice) => {
          const catStyle = getCategoryStyle(notice.noticeCategory);
          return (
            <div
              key={notice.noticeCode}
              onClick={() => navigate(`/notices/${notice.noticeCode}`)}
              className="bg-white rounded-2xl py-[18px] px-5 shadow-card cursor-pointer transition-all duration-200 relative hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              {/* 뱃지 행 */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className={`${catStyle.bg} ${catStyle.color} py-0.5 px-3 rounded-full text-[11px] font-semibold`}>
                  {catStyle.label}
                </span>
                {notice.isImportant && (
                  <span className="bg-danger-light text-danger py-0.5 px-3 rounded-full text-[11px] font-semibold">
                    중요
                  </span>
                )}
              </div>

              {/* 제목 */}
              <h6 className="text-[15px] font-semibold text-gray-900 mb-3 leading-snug line-clamp-2">
                {notice.noticeTitle}
              </h6>

              {/* 메타 + 액션 */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3 text-gray-400 text-xs">
                  <span className="flex items-center gap-1">
                    <FaRegClock size={10} /> {formatDate(notice.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye size={10} /> {notice.viewCount ?? 0}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/notices/${notice.noticeCode}/edit`);
                    }}
                    title="수정"
                    className="w-8 h-8 rounded-[10px] border-none bg-green-lighter text-admin-green flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-admin-green hover:text-white"
                  >
                    <FaEdit size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notice.noticeCode);
                    }}
                    title="삭제"
                    className="w-8 h-8 rounded-[10px] border-none bg-danger-light text-danger flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-danger hover:text-white"
                  >
                    <FaTrash size={12} />
                  </button>
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

      {!loading && notices.length === 0 && (
        <div className="text-center py-[60px] px-5 text-gray-400">
          <div className="text-[48px] mb-4">
            <span role="img" aria-label="empty">&#128227;</span>
          </div>
          <p className="m-0 text-sm">등록된 공지사항이 없습니다.</p>
        </div>
      )}

      {!loading && hasMore && notices.length > 0 && (
        <div className="text-center mt-5">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="bg-transparent border-2 border-admin-green text-admin-green rounded-full py-2.5 px-8 font-semibold text-[13px] transition-all duration-200 hover:bg-admin-green hover:text-white"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNoticeList;
