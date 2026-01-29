import React, { useState, useEffect } from 'react';
import { Container, Form, InputGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaChevronLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getNoticeList, deleteNotice } from '../../apis/noticeAPI';
import { useAuth } from '../../hooks/useAuth';
import AppBar from '../../components/common/AppBar';

const NoticeList = () => {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState('ALL'); // ALL | NOTICE | EVENT
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const userCode = user?.userId || null;

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

  const handleLoadMore = () => setPage(prev => prev + 1);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pillStyle = (active) => ({
    border: '1px solid #D9D9D9',
    background: active ? '#1E9E57' : '#fff',
    color: active ? '#fff' : '#222',
    borderRadius: '999px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: active ? 700 : 500,
  });

  const handleDelete = async (noticeCode) => {
    const ok = window.confirm('정말 삭제할까요? 삭제 후 복구할 수 없습니다.');
    if (!ok) return;

    try {
      await deleteNotice(noticeCode);
      // UI 즉시 반영
      setNotices(prev => prev.filter(n => n.noticeCode !== noticeCode));
      alert('삭제되었습니다.');
    } catch (e) {
      console.error(e);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <Container style={{ maxWidth: '600px', padding: "20px 15px", paddingBottom: "90px" }}>
        {/* 상단 앱바(뒤로 / 제목 / 검색+등록) */}
        <div
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 10,
          }}
        >
          <Button variant="link" className="p-0" style={{ color: '#222', textDecoration: 'none' }} onClick={() => navigate("/")}>
            <FaChevronLeft />
          </Button>

          <div style={{ fontWeight: 700, fontSize: '16px' }}>공지사항</div>

          {/* ✅ 오른쪽: 검색 + 등록 */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button
              variant="link"
              className="p-0"
              style={{ color: '#222', textDecoration: 'none' }}
              onClick={() => setShowSearch(v => !v)}
            >
              <FaSearch />
            </Button>

            <Button
              variant="link"
              className="p-0"
              style={{ color: '#1E9E57', textDecoration: 'none' }}
              onClick={() => navigate('/notices/new')}
              title="공지 등록"
            >
              <FaPlus />
            </Button>
          </div>
        </div>

        {/* 검색 */}
        {showSearch && (
          <InputGroup style={{ margin: '8px 0 10px' }}>
            <Form.Control
              placeholder="공지사항 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button variant="success" onClick={handleSearch}>
              <FaSearch />
            </Button>
          </InputGroup>
        )}

        {/* 카테고리 */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '10px 0 14px' }}>
          <button style={pillStyle(category === 'ALL')} onClick={() => handleCategoryChange('ALL')}>전체</button>
          <button style={pillStyle(category === 'NOTICE')} onClick={() => handleCategoryChange('NOTICE')}>공지사항</button>
          <button style={pillStyle(category === 'EVENT')} onClick={() => handleCategoryChange('EVENT')}>이벤트</button>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 리스트 + ✅ 각 항목 수정/삭제 */}
        <div>
          {notices.map((notice) => (
            <div
              key={notice.noticeCode}
              onClick={() => navigate(`/notices/${notice.noticeCode}`)}
              style={{
                padding: '14px 0',
                borderBottom: '1px solid #EEEEEE',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#222', marginBottom: '6px' }}>
                  {notice.noticeTitle}
                </div>
                <div style={{ fontSize: '12px', color: '#9A9A9A' }}>
                  {formatDate(notice.createdAt)}
                </div>
              </div>

              {/* ✅ 관리 버튼 */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/notices/${notice.noticeCode}/edit`);
                  }}
                  title="수정"
                >
                  <FaEdit />
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notice.noticeCode);
                  }}
                  title="삭제"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="success" />
            </div>
          )}

          {!loading && notices.length === 0 && (
            <div className="text-center py-5">
              <p style={{ color: '#9A9A9A', margin: 0 }}>등록된 공지사항이 없습니다.</p>
            </div>
          )}

          {!loading && hasMore && notices.length > 0 && (
            <div className="text-center py-3">
              <Button variant="link" style={{ color: '#1E9E57', textDecoration: 'none', fontWeight: 600 }} onClick={handleLoadMore}>
                더보기
              </Button>
            </div>
          )}

          {!loading && !hasMore && notices.length > 0 && (
            <div className="text-center py-3">
              <small style={{ color: '#9A9A9A' }}>마지막 공지사항입니다.</small>
            </div>
          )}
        </div>
      </Container>

      <AppBar />
    </>
  );
};

export default NoticeList;
