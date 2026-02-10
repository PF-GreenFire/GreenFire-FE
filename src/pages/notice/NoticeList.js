import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
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

  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'EVENT': return { bg: '#FFF4E5', color: '#F57C00' };
      case 'SYSTEM': return { bg: '#E3F2FD', color: '#1976D2' };
      default: return { bg: '#E8F5E9', color: '#1E9E57' };
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
    const catStyle = getCategoryStyle(notice.noticeCategory);
    return (
      <div
        onClick={() => navigate(`/notices/${notice.noticeCode}`)}
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #1E9E57 0%, #16a34a 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px',
        }}
      >
        {/* 우측 상단 뱃지 영역 */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
          {notice.hasImages && (
            <div style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(4px)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <FaImage size={10} />
            </div>
          )}
        </div>

        {notice.isImportant && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: '#DC3545',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
          }}>
            중요
          </div>
        )}
        <div style={{
          display: 'inline-block',
          background: catStyle.bg,
          color: catStyle.color,
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 600,
          marginBottom: '12px',
          width: 'fit-content',
        }}>
          {getCategoryName(notice.noticeCategory)}
        </div>
        <h2 style={{
          color: '#fff',
          fontSize: '20px',
          fontWeight: 700,
          marginBottom: '8px',
          lineHeight: 1.3,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {notice.noticeTitle}
        </h2>
        <div style={{
          display: 'flex',
          gap: '16px',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '12px',
        }}>
          <span><FaRegClock style={{ marginRight: '4px' }} />{formatDate(notice.createdAt)}</span>
          <span><FaEye style={{ marginRight: '4px' }} />{notice.viewCount}</span>
        </div>
      </div>
    );
  };

  // 일반 카드
  const NoticeCard = ({ notice }) => {
    const catStyle = getCategoryStyle(notice.noticeCategory);
    return (
      <div
        onClick={() => navigate(`/notices/${notice.noticeCode}`)}
        style={{
          background: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          height: '100%',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        }}
      >
        {/* 이미지 있음 표시 */}
        {notice.hasImages && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(30, 158, 87, 0.1)',
            color: '#1E9E57',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}>
            <FaImage size={12} />
          </div>
        )}

        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              background: catStyle.bg,
              color: catStyle.color,
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 600,
            }}>
              {getCategoryName(notice.noticeCategory)}
            </span>
            {notice.isImportant && (
              <span style={{
                background: '#FFEBEE',
                color: '#DC3545',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 600,
              }}>
                중요
              </span>
            )}
          </div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#222',
            marginBottom: '12px',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {notice.noticeTitle}
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#999',
            fontSize: '11px',
          }}>
            <span>{formatDate(notice.createdAt)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <FaEye size={10} />{notice.viewCount}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Container style={{ maxWidth: '600px', padding: '0', paddingBottom: '100px', background: '#F8F9FA', minHeight: '100vh' }}>
        {/* 헤더 */}
        <div style={{
          padding: '16px 20px',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid #f0f0f0',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Button variant="link" className="p-0" style={{ color: '#222' }} onClick={() => navigate("/")}>
              <FaChevronLeft size={18} />
            </Button>
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>공지사항</h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Button variant="link" className="p-0" style={{ color: '#222' }} onClick={() => setShowSearch(v => !v)}>
                <FaSearch size={18} />
              </Button>
              {role === 'ADMIN' && (
                <Button variant="link" className="p-0" style={{ color: '#1E9E57' }} onClick={() => navigate('/notices/new')}>
                  <FaPlus size={18} />
                </Button>
              )}
            </div>
          </div>

          {/* 검색 */}
          {showSearch && (
            <div style={{ marginTop: '12px' }}>
              <div style={{
                display: 'flex',
                background: '#F5F5F5',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 16px',
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
                    padding: '12px 16px',
                    cursor: 'pointer',
                  }}
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 카테고리 탭 */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          overflowX: 'auto',
        }}>
          {[
            { key: 'ALL', label: '전체' },
            { key: 'NOTICE', label: '공지' },
            { key: 'EVENT', label: '이벤트' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              style={{
                border: 'none',
                background: category === cat.key ? '#1E9E57' : '#F5F5F5',
                color: category === cat.key ? '#fff' : '#666',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div style={{ padding: '20px' }}>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* 히어로 (첫 번째 공지) */}
          {notices.length > 0 && page === 1 && (
            <HeroCard notice={notices[0]} />
          )}

          {/* 그리드 (나머지) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
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
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                <span role="img" aria-label="empty">📭</span>
              </div>
              <p style={{ margin: 0, fontSize: '15px' }}>등록된 공지사항이 없습니다.</p>
            </div>
          )}

          {!loading && hasMore && notices.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button
                variant="outline-success"
                style={{
                  borderRadius: '24px',
                  padding: '10px 32px',
                  fontWeight: 600,
                }}
                onClick={() => setPage(prev => prev + 1)}
              >
                더 보기
              </Button>
            </div>
          )}

          {!loading && !hasMore && notices.length > 0 && (
            <div style={{
              textAlign: 'center',
              padding: '24px',
              color: '#bbb',
              fontSize: '13px',
            }}>
              모든 공지사항을 확인했습니다
            </div>
          )}
        </div>
      </Container>

      <AppBar />
    </>
  );
};

export default NoticeList;
