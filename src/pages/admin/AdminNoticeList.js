import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
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
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'NOTICE': return <Badge bg="success">공지</Badge>;
      case 'EVENT': return <Badge bg="primary">이벤트</Badge>;
      case 'SYSTEM': return <Badge bg="secondary">시스템</Badge>;
      default: return <Badge bg="secondary">{category}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">공지사항 관리</h5>
        <Button
          variant="success"
          size="sm"
          onClick={() => navigate('/notices/new')}
        >
          <FaPlus className="me-1" /> 등록
        </Button>
      </div>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="제목 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button variant="outline-success" onClick={handleSearch}>
          <FaSearch />
        </Button>
      </InputGroup>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <div style={{ overflowX: 'auto' }}>
        <Table hover size="sm" style={{ fontSize: '13px' }}>
          <thead>
            <tr className="table-light">
              <th style={{ width: '50%' }}>제목</th>
              <th style={{ width: '12%' }}>카테고리</th>
              <th style={{ width: '12%' }}>날짜</th>
              <th style={{ width: '8%' }}>조회</th>
              <th style={{ width: '8%' }}>중요</th>
              <th style={{ width: '10%' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr
                key={notice.noticeCode}
                onClick={() => navigate(`/notices/${notice.noticeCode}`)}
                style={{ cursor: 'pointer' }}
              >
                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                  {notice.noticeTitle}
                </td>
                <td>{getCategoryBadge(notice.noticeCategory)}</td>
                <td className="text-muted">{formatDate(notice.createdAt)}</td>
                <td className="text-muted">{notice.viewCount ?? 0}</td>
                <td>
                  {notice.isImportant && <Badge bg="danger">중요</Badge>}
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/notices/${notice.noticeCode}/edit`);
                      }}
                      title="수정"
                    >
                      <FaEdit size={12} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notice.noticeCode);
                      }}
                      title="삭제"
                    >
                      <FaTrash size={12} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" variant="success" size="sm" />
        </div>
      )}

      {!loading && notices.length === 0 && (
        <div className="text-center py-4 text-muted">
          등록된 공지사항이 없습니다.
        </div>
      )}

      {!loading && hasMore && notices.length > 0 && (
        <div className="text-center py-2">
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => setPage(prev => prev + 1)}
          >
            더보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminNoticeList;
