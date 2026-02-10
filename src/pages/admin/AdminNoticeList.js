import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
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
      case 'EVENT': return { bg: '#FFF4E5', color: '#F57C00', label: '이벤트' };
      case 'SYSTEM': return { bg: '#E3F2FD', color: '#1976D2', label: '시스템' };
      default: return { bg: '#E8F5E9', color: '#1E9E57', label: '공지' };
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: '18px', color: '#222' }}>
          공지사항 관리
        </h5>
        <button
          onClick={() => navigate('/notices/new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#1E9E57',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <FaPlus size={12} /> 등록
        </button>
      </div>

      {/* 검색바 */}
      <div style={{
        display: 'flex',
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '16px',
          color: '#aaa',
        }}>
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          placeholder="제목 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            padding: '12px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            border: 'none',
            background: '#1E9E57',
            color: '#fff',
            padding: '12px 20px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          검색
        </button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* 공지사항 카드 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notices.map((notice) => {
          const catStyle = getCategoryStyle(notice.noticeCategory);
          return (
            <div
              key={notice.noticeCode}
              onClick={() => navigate(`/notices/${notice.noticeCode}`)}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '18px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              {/* 뱃지 행 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
              }}>
                <span style={{
                  background: catStyle.bg,
                  color: catStyle.color,
                  padding: '3px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {catStyle.label}
                </span>
                {notice.isImportant && (
                  <span style={{
                    background: '#FFEBEE',
                    color: '#D32F2F',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    중요
                  </span>
                )}
              </div>

              {/* 제목 */}
              <h6 style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#222',
                margin: '0 0 12px',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {notice.noticeTitle}
              </h6>

              {/* 메타 + 액션 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  color: '#aaa',
                  fontSize: '12px',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaRegClock size={10} /> {formatDate(notice.createdAt)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaEye size={10} /> {notice.viewCount ?? 0}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/notices/${notice.noticeCode}/edit`);
                    }}
                    title="수정"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#E8F5E9',
                      color: '#1E9E57',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FaEdit size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notice.noticeCode);
                    }}
                    title="삭제"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#FFEBEE',
                      color: '#D32F2F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
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
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <span role="img" aria-label="empty">&#128227;</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px' }}>등록된 공지사항이 없습니다.</p>
        </div>
      )}

      {!loading && hasMore && notices.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            onClick={() => setPage(prev => prev + 1)}
            style={{
              background: 'transparent',
              border: '2px solid #1E9E57',
              color: '#1E9E57',
              borderRadius: '24px',
              padding: '10px 32px',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1E9E57';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1E9E57';
            }}
          >
            더보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminNoticeList;
