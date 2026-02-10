import React, { useState, useEffect } from 'react';
import {
  Button,
  Spinner,
  Alert,
  Form,
  Modal,
} from 'react-bootstrap';
import { FaCheck, FaEye } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { getReports, handleReport } from '../../apis/reportAPI';

const STATUS_FILTERS = [
  { key: '', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'HANDLED_DELETED', label: '삭제처리' },
  { key: 'HANDLED_SUSPENDED', label: '정지처리' },
  { key: 'DISMISSED', label: '기각' },
];

const AdminReportList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  // 처리 모달 상태
  const [showHandleModal, setShowHandleModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [handleStatus, setHandleStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [handleLoading, setHandleLoading] = useState(false);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        status: statusFilter || undefined,
      };
      const response = await getReports(params);
      if (page === 1) {
        setReports(response.reports);
      } else {
        setReports((prev) => [...prev, ...response.reports]);
      }
      setHasMore(response.hasMore);
    } catch (err) {
      console.error(err);
      setError('신고 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
    setReports([]);
    if (newStatus) {
      setSearchParams({ status: newStatus });
    } else {
      setSearchParams({});
    }
  };

  const openHandleModal = (report) => {
    setSelectedReport(report);
    setHandleStatus('');
    setAdminNote('');
    setShowHandleModal(true);
  };

  const closeHandleModal = () => {
    setShowHandleModal(false);
    setSelectedReport(null);
    setHandleStatus('');
    setAdminNote('');
  };

  const submitHandle = async () => {
    if (!handleStatus) {
      alert('처리 결과를 선택해주세요.');
      return;
    }

    setHandleLoading(true);
    try {
      await handleReport(selectedReport.id, {
        status: handleStatus,
        adminNote: adminNote || null,
      });

      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? { ...r, status: handleStatus, statusDescription: getStatusLabel(handleStatus) }
            : r
        )
      );

      alert('신고가 처리되었습니다.');
      closeHandleModal();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        alert('이미 처리된 신고입니다.');
      } else {
        alert('신고 처리에 실패했습니다.');
      }
    } finally {
      setHandleLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FFF3E0', color: '#F57C00', label: '대기' };
      case 'HANDLED_DELETED':
        return { bg: '#FFEBEE', color: '#D32F2F', label: '삭제처리' };
      case 'HANDLED_SUSPENDED':
        return { bg: '#F3E5F5', color: '#7B1FA2', label: '정지처리' };
      case 'DISMISSED':
        return { bg: '#F5F5F5', color: '#888', label: '기각' };
      default:
        return { bg: '#F5F5F5', color: '#888', label: status };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return '처리 대기';
      case 'HANDLED_DELETED': return '처리완료-삭제';
      case 'HANDLED_SUSPENDED': return '처리완료-정지';
      case 'DISMISSED': return '기각';
      default: return status;
    }
  };

  const getResourceTypeStyle = (type) => {
    switch (type) {
      case 'POST': return { bg: '#E3F2FD', color: '#1976D2', label: '게시글' };
      case 'COMMENT': return { bg: '#E0F7FA', color: '#00796B', label: '댓글' };
      case 'CHALLENGE': return { bg: '#E8F5E9', color: '#1E9E57', label: '챌린지' };
      default: return { bg: '#F5F5F5', color: '#888', label: type };
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'SPAM': return { bg: '#F5F5F5', color: '#888', label: '스팸' };
      case 'INAPPROPRIATE': return { bg: '#FFF3E0', color: '#F57C00', label: '부적절' };
      case 'HARASSMENT': return { bg: '#FFEBEE', color: '#D32F2F', label: '괴롭힘' };
      case 'OTHER': return { bg: '#ECEFF1', color: '#546E7A', label: '기타' };
      default: return { bg: '#F5F5F5', color: '#888', label: category };
    }
  };

  const getStatusBadgeJsx = (status) => {
    const style = getStatusStyle(status);
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '3px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
      }}>
        {style.label}
      </span>
    );
  };

  const getResourceTypeBadgeJsx = (type) => {
    const style = getResourceTypeStyle(type);
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '3px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
      }}>
        {style.label}
      </span>
    );
  };

  const getCategoryBadgeJsx = (category) => {
    const style = getCategoryStyle(category);
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '3px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div>
      <h5 style={{ fontWeight: 800, marginBottom: '20px', fontSize: '18px', color: '#222' }}>
        신고 관리
      </h5>

      {/* 상태 필터 - pill 버튼 그룹 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleStatusFilterChange(filter.key)}
            style={{
              border: 'none',
              background: statusFilter === filter.key ? '#1E9E57' : '#fff',
              color: statusFilter === filter.key ? '#fff' : '#666',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: statusFilter === filter.key ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: statusFilter === filter.key
                ? '0 2px 8px rgba(30, 158, 87, 0.3)'
                : '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 신고 카드 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reports.map((report) => {
          const statusStyle = getStatusStyle(report.status);
          return (
            <div
              key={report.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '18px 20px',
                boxShadow: report.status === 'PENDING'
                  ? '0 2px 12px rgba(245, 124, 0, 0.1)'
                  : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderLeft: report.status === 'PENDING'
                  ? '4px solid #F57C00'
                  : '4px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = report.status === 'PENDING'
                  ? '0 2px 12px rgba(245, 124, 0, 0.1)'
                  : '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              {/* 상단: 뱃지들 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
                flexWrap: 'wrap',
              }}>
                {getResourceTypeBadgeJsx(report.resourceType)}
                {getCategoryBadgeJsx(report.category)}
                {getStatusBadgeJsx(report.status)}
                <span style={{ fontSize: '11px', color: '#bbb', marginLeft: 'auto' }}>
                  #{report.id}
                </span>
              </div>

              {/* 사유 */}
              <p style={{
                fontSize: '14px',
                color: '#444',
                margin: '0 0 10px',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {report.reason}
              </p>

              {/* 하단: 메타 + 액션 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ fontSize: '12px', color: '#aaa' }}>
                  <span>{report.reporterEmail || report.reporterId}</span>
                  <span style={{ margin: '0 8px' }}>|</span>
                  <span>{formatDate(report.createdAt)}</span>
                </div>
                <div>
                  {report.status === 'PENDING' ? (
                    <button
                      onClick={() => openHandleModal(report)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#1E9E57',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <FaCheck size={10} /> 처리
                    </button>
                  ) : (
                    <button
                      onClick={() => openHandleModal(report)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#f5f5f5',
                        color: '#888',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <FaEye size={10} /> 상세
                    </button>
                  )}
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

      {!loading && reports.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <span role="img" aria-label="empty">&#128203;</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px' }}>신고 내역이 없습니다.</p>
        </div>
      )}

      {!loading && hasMore && reports.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
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

      {/* 처리 모달 */}
      <Modal show={showHandleModal} onHide={closeHandleModal} centered>
        <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Modal.Header
            closeButton
            style={{
              border: 'none',
              padding: '24px 24px 12px',
            }}
          >
            <Modal.Title style={{ fontSize: '18px', fontWeight: 700 }}>
              신고 {selectedReport?.status === 'PENDING' ? '처리' : '상세'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '12px 24px 24px' }}>
            {selectedReport && (
              <div>
                {/* 신고 정보 카드 */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    {getResourceTypeBadgeJsx(selectedReport.resourceType)}
                    <span style={{ fontSize: '12px', color: '#aaa' }}>
                      #{selectedReport.resourceId}
                    </span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>신고 유형</span>
                    <div style={{ marginTop: '4px' }}>
                      {getCategoryBadgeJsx(selectedReport.category)}
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>신고자</span>
                    <div style={{ fontSize: '14px', color: '#333', marginTop: '2px' }}>
                      {selectedReport.reporterEmail || selectedReport.reporterId}
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>신고 사유</span>
                    <div style={{
                      marginTop: '6px',
                      padding: '12px',
                      background: '#fff',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#333',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {selectedReport.reason}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#888' }}>신고일</span>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>
                      {formatDate(selectedReport.createdAt)}
                    </div>
                  </div>
                </div>

                {selectedReport.status === 'PENDING' ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: 600, fontSize: '14px' }}>
                        처리 결과 <span style={{ color: '#D32F2F' }}>*</span>
                      </Form.Label>
                      <Form.Select
                        value={handleStatus}
                        onChange={(e) => setHandleStatus(e.target.value)}
                        disabled={handleLoading}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      >
                        <option value="">선택해주세요</option>
                        <option value="HANDLED_DELETED">삭제 처리</option>
                        <option value="HANDLED_SUSPENDED">사용자 정지</option>
                        <option value="DISMISSED">기각</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: 600, fontSize: '14px' }}>관리자 메모</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="처리 내용을 메모해주세요. (선택)"
                        disabled={handleLoading}
                        style={{
                          resize: 'none',
                          borderRadius: '12px',
                          padding: '12px 14px',
                        }}
                      />
                    </Form.Group>
                  </>
                ) : (
                  <div style={{
                    background: '#f8f9fa',
                    borderRadius: '14px',
                    padding: '18px',
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#888' }}>처리 결과</span>
                      <div style={{ marginTop: '4px' }}>
                        {getStatusBadgeJsx(selectedReport.status)}
                      </div>
                    </div>
                    {selectedReport.handledByEmail && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>처리자</span>
                        <div style={{ fontSize: '14px', color: '#333', marginTop: '2px' }}>
                          {selectedReport.handledByEmail}
                        </div>
                      </div>
                    )}
                    {selectedReport.handledAt && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>처리일</span>
                        <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>
                          {formatDate(selectedReport.handledAt)}
                        </div>
                      </div>
                    )}
                    {selectedReport.adminNote && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#888' }}>관리자 메모</span>
                        <div style={{
                          marginTop: '6px',
                          padding: '12px',
                          background: '#fff',
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#333',
                        }}>
                          {selectedReport.adminNote}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', padding: '0 24px 24px' }}>
            <Button
              onClick={closeHandleModal}
              style={{
                background: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              닫기
            </Button>
            {selectedReport?.status === 'PENDING' && (
              <Button
                onClick={submitHandle}
                disabled={handleLoading}
                style={{
                  background: '#1E9E57',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                {handleLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    처리 중...
                  </>
                ) : (
                  '처리 완료'
                )}
              </Button>
            )}
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReportList;
