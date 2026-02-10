import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { createReport } from '../../apis/reportAPI';

/**
 * 신고 모달 공통 컴포넌트
 *
 * 사용 예시:
 * <ReportModal
 *   show={showReportModal}
 *   onHide={() => setShowReportModal(false)}
 *   resourceType="POST"  // 또는 "COMMENT", "CHALLENGE"
 *   resourceId={item.id}
 *   resourceTitle={item.title || item.content}
 * />
 */
const ReportModal = ({ show, onHide, resourceType, resourceId, resourceTitle }) => {
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'SPAM', label: '스팸' },
    { value: 'INAPPROPRIATE', label: '부적절한 콘텐츠' },
    { value: 'HARASSMENT', label: '괴롭힘/혐오' },
    { value: 'OTHER', label: '기타' },
  ];

  const resourceTypeLabels = {
    POST: '게시글',
    COMMENT: '댓글',
    CHALLENGE: '챌린지',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      setError('신고 유형을 선택해주세요.');
      return;
    }

    if (reason.length < 10 || reason.length > 500) {
      setError('신고 사유는 10~500자 사이로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createReport({
        resourceType,
        resourceId: String(resourceId),
        category,
        reason,
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Report error:', err);
      if (err.response?.status === 409) {
        setError('이미 신고한 콘텐츠입니다.');
      } else if (err.response?.status === 401) {
        setError('로그인이 필요합니다.');
      } else {
        setError('신고 접수에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategory('');
    setReason('');
    setError(null);
    setSuccess(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '18px', fontWeight: 600 }}>
          신고하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <Alert variant="success" className="mb-0">
            신고가 접수되었습니다. 검토 후 조치하겠습니다.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            {resourceTitle && (
              <div
                className="mb-3 p-2 bg-light rounded"
                style={{ fontSize: '13px' }}
              >
                <strong>{resourceTypeLabels[resourceType] || '콘텐츠'}:</strong>{' '}
                <span className="text-muted">
                  {resourceTitle.length > 50
                    ? resourceTitle.substring(0, 50) + '...'
                    : resourceTitle}
                </span>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '14px', fontWeight: 500 }}>
                신고 유형 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                style={{ fontSize: '14px' }}
              >
                <option value="">선택해주세요</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '14px', fontWeight: 500 }}>
                신고 사유 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="신고 사유를 상세히 작성해주세요. (10~500자)"
                disabled={loading}
                style={{ fontSize: '14px', resize: 'none' }}
              />
              <Form.Text className="text-muted">
                {reason.length}/500자 (최소 10자)
              </Form.Text>
            </Form.Group>

            {error && (
              <Alert variant="danger" className="py-2" style={{ fontSize: '13px' }}>
                {error}
              </Alert>
            )}

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={loading}
                size="sm"
              >
                취소
              </Button>
              <Button
                variant="danger"
                type="submit"
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    접수 중...
                  </>
                ) : (
                  '신고하기'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
