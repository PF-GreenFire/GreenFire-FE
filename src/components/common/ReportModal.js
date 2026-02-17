import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
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
        <Modal.Title className="text-lg font-semibold">
          신고하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <div className="bg-green-lighter border border-admin-green/30 text-admin-green rounded-xl px-4 py-3 text-sm">
            신고가 접수되었습니다. 검토 후 조치하겠습니다.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {resourceTitle && (
              <div className="mb-3 p-2 bg-gray-50 rounded text-[13px]">
                <strong>{resourceTypeLabels[resourceType] || '콘텐츠'}:</strong>{' '}
                <span className="text-gray-500">
                  {resourceTitle.length > 50
                    ? resourceTitle.substring(0, 50) + '...'
                    : resourceTitle}
                </span>
              </div>
            )}

            <div className="mb-3">
              <label className="text-sm font-medium block mb-1">
                신고 유형 <span className="text-danger">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full text-sm border border-gray-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
              >
                <option value="">선택해주세요</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium block mb-1">
                신고 사유 <span className="text-danger">*</span>
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="신고 사유를 상세히 작성해주세요. (10~500자)"
                disabled={loading}
                className="w-full text-sm border border-gray-300 rounded-xl py-2.5 px-3 resize-none focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
              />
              <span className="text-xs text-gray-500">
                {reason.length}/500자 (최소 10자)
              </span>
            </div>

            {error && (
              <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-2 text-[13px] mb-3">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-sm bg-danger text-white hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Spinner animation="border" size="sm" className="mr-1" />
                    접수 중...
                  </span>
                ) : (
                  '신고하기'
                )}
              </button>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
