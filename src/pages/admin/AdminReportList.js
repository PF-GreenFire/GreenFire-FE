import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  Modal,
} from 'react-bootstrap';
import { FaCheck, FaEye } from 'react-icons/fa';
import { getReports, handleReport } from '../../apis/reportAPI';

const AdminReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

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

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
    setReports([]);
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

      // 목록에서 해당 신고 상태 업데이트
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning" text="dark">대기</Badge>;
      case 'HANDLED_DELETED':
        return <Badge bg="danger">삭제처리</Badge>;
      case 'HANDLED_SUSPENDED':
        return <Badge bg="dark">정지처리</Badge>;
      case 'DISMISSED':
        return <Badge bg="secondary">기각</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return '처리 대기';
      case 'HANDLED_DELETED':
        return '처리완료-삭제';
      case 'HANDLED_SUSPENDED':
        return '처리완료-정지';
      case 'DISMISSED':
        return '기각';
      default:
        return status;
    }
  };

  const getResourceTypeBadge = (type) => {
    switch (type) {
      case 'POST':
        return <Badge bg="primary">게시글</Badge>;
      case 'COMMENT':
        return <Badge bg="info">댓글</Badge>;
      case 'CHALLENGE':
        return <Badge bg="success">챌린지</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'SPAM':
        return <Badge bg="secondary">스팸</Badge>;
      case 'INAPPROPRIATE':
        return <Badge bg="warning" text="dark">부적절</Badge>;
      case 'HARASSMENT':
        return <Badge bg="danger">괴롭힘</Badge>;
      case 'OTHER':
        return <Badge bg="dark">기타</Badge>;
      default:
        return <Badge bg="secondary">{category}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">신고 관리</h5>
        <Form.Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          style={{ width: '150px', fontSize: '13px' }}
        >
          <option value="">전체</option>
          <option value="PENDING">대기</option>
          <option value="HANDLED_DELETED">삭제처리</option>
          <option value="HANDLED_SUSPENDED">정지처리</option>
          <option value="DISMISSED">기각</option>
        </Form.Select>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div style={{ overflowX: 'auto' }}>
        <Table hover size="sm" style={{ fontSize: '12px' }}>
          <thead>
            <tr className="table-light">
              <th style={{ width: '8%' }}>ID</th>
              <th style={{ width: '10%' }}>대상</th>
              <th style={{ width: '10%' }}>유형</th>
              <th style={{ width: '20%' }}>신고자</th>
              <th style={{ width: '25%' }}>사유</th>
              <th style={{ width: '10%' }}>상태</th>
              <th style={{ width: '12%' }}>신고일</th>
              <th style={{ width: '5%' }}>조치</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>
                  {getResourceTypeBadge(report.resourceType)}
                  <div className="text-muted" style={{ fontSize: '10px' }}>
                    #{report.resourceId}
                  </div>
                </td>
                <td>{getCategoryBadge(report.category)}</td>
                <td className="text-truncate" style={{ maxWidth: '120px' }}>
                  {report.reporterEmail || report.reporterId}
                </td>
                <td
                  className="text-truncate"
                  style={{ maxWidth: '180px' }}
                  title={report.reason}
                >
                  {report.reason}
                </td>
                <td>{getStatusBadge(report.status)}</td>
                <td className="text-muted">{formatDate(report.createdAt)}</td>
                <td>
                  {report.status === 'PENDING' ? (
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="p-1"
                      onClick={() => openHandleModal(report)}
                      title="처리"
                    >
                      <FaCheck size={10} />
                    </Button>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="p-1"
                      onClick={() => openHandleModal(report)}
                      title="상세"
                    >
                      <FaEye size={10} />
                    </Button>
                  )}
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

      {!loading && reports.length === 0 && (
        <div className="text-center py-4 text-muted">
          신고 내역이 없습니다.
        </div>
      )}

      {!loading && hasMore && reports.length > 0 && (
        <div className="text-center py-2">
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
          >
            더보기
          </Button>
        </div>
      )}

      {/* 처리 모달 */}
      <Modal show={showHandleModal} onHide={closeHandleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '16px', fontWeight: 600 }}>
            신고 {selectedReport?.status === 'PENDING' ? '처리' : '상세'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div style={{ fontSize: '13px' }}>
              <div className="mb-3">
                <strong>대상:</strong>{' '}
                {getResourceTypeBadge(selectedReport.resourceType)}{' '}
                <span className="text-muted">#{selectedReport.resourceId}</span>
              </div>
              <div className="mb-3">
                <strong>신고 유형:</strong> {getCategoryBadge(selectedReport.category)}
              </div>
              <div className="mb-3">
                <strong>신고자:</strong>{' '}
                {selectedReport.reporterEmail || selectedReport.reporterId}
              </div>
              <div className="mb-3">
                <strong>신고 사유:</strong>
                <div
                  className="mt-1 p-2 bg-light rounded"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {selectedReport.reason}
                </div>
              </div>
              <div className="mb-3">
                <strong>신고일:</strong> {formatDate(selectedReport.createdAt)}
              </div>

              {selectedReport.status === 'PENDING' ? (
                <>
                  <hr />
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 500 }}>
                      처리 결과 <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={handleStatus}
                      onChange={(e) => setHandleStatus(e.target.value)}
                      disabled={handleLoading}
                    >
                      <option value="">선택해주세요</option>
                      <option value="HANDLED_DELETED">삭제 처리</option>
                      <option value="HANDLED_SUSPENDED">사용자 정지</option>
                      <option value="DISMISSED">기각</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 500 }}>관리자 메모</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="처리 내용을 메모해주세요. (선택)"
                      disabled={handleLoading}
                      style={{ resize: 'none' }}
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  <hr />
                  <div className="mb-2">
                    <strong>처리 결과:</strong> {getStatusBadge(selectedReport.status)}
                  </div>
                  {selectedReport.handledByEmail && (
                    <div className="mb-2">
                      <strong>처리자:</strong> {selectedReport.handledByEmail}
                    </div>
                  )}
                  {selectedReport.handledAt && (
                    <div className="mb-2">
                      <strong>처리일:</strong> {formatDate(selectedReport.handledAt)}
                    </div>
                  )}
                  {selectedReport.adminNote && (
                    <div className="mb-2">
                      <strong>관리자 메모:</strong>
                      <div className="mt-1 p-2 bg-light rounded">
                        {selectedReport.adminNote}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={closeHandleModal}>
            닫기
          </Button>
          {selectedReport?.status === 'PENDING' && (
            <Button
              variant="success"
              size="sm"
              onClick={submitHandle}
              disabled={handleLoading}
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
      </Modal>
    </div>
  );
};

export default AdminReportList;
