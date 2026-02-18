import React, { useState, useEffect } from 'react';
import { Spinner, Modal } from 'react-bootstrap';
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
      case 'PENDING': return { tw: 'bg-warning-light text-warning', label: '대기' };
      case 'HANDLED_DELETED': return { tw: 'bg-danger-light text-danger', label: '삭제처리' };
      case 'HANDLED_SUSPENDED': return { tw: 'bg-purple-light text-purple', label: '정지처리' };
      case 'DISMISSED': return { tw: 'bg-gray-100 text-gray-400', label: '기각' };
      default: return { tw: 'bg-gray-100 text-gray-400', label: status };
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
      case 'POST': return { tw: 'bg-info-light text-info', label: '게시글' };
      case 'COMMENT': return { tw: 'bg-[#E0F7FA] text-[#00796B]', label: '댓글' };
      case 'CHALLENGE': return { tw: 'bg-green-lighter text-admin-green', label: '챌린지' };
      default: return { tw: 'bg-gray-100 text-gray-400', label: type };
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'SPAM': return { tw: 'bg-gray-100 text-gray-400', label: '스팸' };
      case 'INAPPROPRIATE': return { tw: 'bg-warning-light text-warning', label: '부적절' };
      case 'HARASSMENT': return { tw: 'bg-danger-light text-danger', label: '괴롭힘' };
      case 'OTHER': return { tw: 'bg-gray-200 text-gray-600', label: '기타' };
      default: return { tw: 'bg-gray-100 text-gray-400', label: category };
    }
  };

  const Badge = ({ style, label }) => (
    <span className={`${style.tw} py-0.5 px-3 rounded-full text-[11px] font-semibold`}>
      {label || style.label}
    </span>
  );

  return (
    <div>
      <h5 className="font-extrabold mb-5 text-lg text-gray-900">
        신고 관리
      </h5>

      {/* 상태 필터 - pill 버튼 그룹 */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleStatusFilterChange(filter.key)}
            className={`border-none py-2 px-[18px] rounded-full text-[13px] cursor-pointer whitespace-nowrap transition-all duration-200 ${
              statusFilter === filter.key
                ? 'bg-admin-green text-white font-bold shadow-[0_2px_8px_rgba(30,158,87,0.3)]'
                : 'bg-white text-gray-500 font-medium shadow-card'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right text-danger font-bold ml-2">&times;</button>
        </div>
      )}

      {/* 신고 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {reports.map((report) => {
          const isPending = report.status === 'PENDING';
          return (
            <div
              key={report.id}
              className={`bg-white rounded-2xl py-[18px] px-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
                isPending ? 'border-l-4 border-l-warning shadow-[0_2px_12px_rgba(245,124,0,0.1)]' : 'border-l-4 border-l-transparent shadow-card'
              }`}
            >
              {/* 상단: 뱃지들 */}
              <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                <Badge style={getResourceTypeStyle(report.resourceType)} />
                <Badge style={getCategoryStyle(report.category)} />
                <Badge style={getStatusStyle(report.status)} />
                <span className="text-[11px] text-gray-300 ml-auto">
                  #{report.id}
                </span>
              </div>

              {/* 사유 */}
              <p className="text-sm text-gray-700 mb-2.5 leading-relaxed line-clamp-2">
                {report.reason}
              </p>

              {/* 하단: 메타 + 액션 */}
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  <span>{report.reporterEmail || report.reporterId}</span>
                  <span className="mx-2">|</span>
                  <span>{formatDate(report.createdAt)}</span>
                </div>
                <div>
                  {isPending ? (
                    <button
                      onClick={() => openHandleModal(report)}
                      className="flex items-center gap-1 bg-admin-green text-white border-none rounded-[10px] py-1.5 px-3.5 text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-admin-green-dark"
                    >
                      <FaCheck size={10} /> 처리
                    </button>
                  ) : (
                    <button
                      onClick={() => openHandleModal(report)}
                      className="flex items-center gap-1 bg-gray-100 text-gray-400 border-none rounded-[10px] py-1.5 px-3.5 text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-200"
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
        <div className="text-center py-[60px] px-5 text-gray-400">
          <div className="text-[48px] mb-4">
            <span role="img" aria-label="empty">&#128203;</span>
          </div>
          <p className="m-0 text-sm">신고 내역이 없습니다.</p>
        </div>
      )}

      {!loading && hasMore && reports.length > 0 && (
        <div className="text-center mt-5">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-transparent border-2 border-admin-green text-admin-green rounded-full py-2.5 px-8 font-semibold text-[13px] transition-all duration-200 hover:bg-admin-green hover:text-white"
          >
            더보기
          </button>
        </div>
      )}

      {/* 처리 모달 */}
      <Modal show={showHandleModal} onHide={closeHandleModal} centered>
        <div className="rounded-[20px] overflow-hidden">
          <Modal.Header closeButton className="border-none pt-6 px-6 pb-3">
            <Modal.Title className="text-lg font-bold">
              신고 {selectedReport?.status === 'PENDING' ? '처리' : '상세'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-6 pb-6 pt-3">
            {selectedReport && (
              <div>
                {/* 신고 정보 카드 */}
                <div className="bg-gray-50 rounded-[14px] p-[18px] mb-5">
                  <div className="flex gap-1.5 mb-3.5 flex-wrap">
                    <Badge style={getResourceTypeStyle(selectedReport.resourceType)} />
                    <span className="text-xs text-gray-400">
                      #{selectedReport.resourceId}
                    </span>
                  </div>
                  <div className="mb-2.5">
                    <span className="text-xs text-gray-400">신고 유형</span>
                    <div className="mt-1">
                      <Badge style={getCategoryStyle(selectedReport.category)} />
                    </div>
                  </div>
                  <div className="mb-2.5">
                    <span className="text-xs text-gray-400">신고자</span>
                    <div className="text-sm text-gray-800 mt-0.5">
                      {selectedReport.reporterEmail || selectedReport.reporterId}
                    </div>
                  </div>
                  <div className="mb-2.5">
                    <span className="text-xs text-gray-400">신고 사유</span>
                    <div className="mt-1.5 p-3 bg-white rounded-[10px] text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {selectedReport.reason}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">신고일</span>
                    <div className="text-[13px] text-gray-600 mt-0.5">
                      {formatDate(selectedReport.createdAt)}
                    </div>
                  </div>
                </div>

                {selectedReport.status === 'PENDING' ? (
                  <>
                    <div className="mb-3">
                      <label className="font-semibold text-sm block mb-1">
                        처리 결과 <span className="text-danger">*</span>
                      </label>
                      <select
                        value={handleStatus}
                        onChange={(e) => setHandleStatus(e.target.value)}
                        disabled={handleLoading}
                        className="w-full border border-gray-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                      >
                        <option value="">선택해주세요</option>
                        <option value="HANDLED_DELETED">삭제 처리</option>
                        <option value="HANDLED_SUSPENDED">사용자 정지</option>
                        <option value="DISMISSED">기각</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="font-semibold text-sm block mb-1">관리자 메모</label>
                      <textarea
                        rows={3}
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="처리 내용을 메모해주세요. (선택)"
                        disabled={handleLoading}
                        className="w-full border border-gray-300 rounded-xl py-3 px-3.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-admin-green"
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 rounded-[14px] p-[18px]">
                    <div className="mb-2.5">
                      <span className="text-xs text-gray-400">처리 결과</span>
                      <div className="mt-1">
                        <Badge style={getStatusStyle(selectedReport.status)} />
                      </div>
                    </div>
                    {selectedReport.handledByEmail && (
                      <div className="mb-2.5">
                        <span className="text-xs text-gray-400">처리자</span>
                        <div className="text-sm text-gray-800 mt-0.5">
                          {selectedReport.handledByEmail}
                        </div>
                      </div>
                    )}
                    {selectedReport.handledAt && (
                      <div className="mb-2.5">
                        <span className="text-xs text-gray-400">처리일</span>
                        <div className="text-[13px] text-gray-600 mt-0.5">
                          {formatDate(selectedReport.handledAt)}
                        </div>
                      </div>
                    )}
                    {selectedReport.adminNote && (
                      <div>
                        <span className="text-xs text-gray-400">관리자 메모</span>
                        <div className="mt-1.5 p-3 bg-white rounded-[10px] text-sm text-gray-800">
                          {selectedReport.adminNote}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-none px-6 pb-6 pt-0">
            <button
              onClick={closeHandleModal}
              className="bg-gray-100 text-gray-500 border-none rounded-xl py-2.5 px-5 font-semibold text-[13px] hover:bg-gray-200 transition-all"
            >
              닫기
            </button>
            {selectedReport?.status === 'PENDING' && (
              <button
                onClick={submitHandle}
                disabled={handleLoading}
                className="bg-admin-green text-white border-none rounded-xl py-2.5 px-5 font-semibold text-[13px] hover:bg-admin-green-dark transition-all disabled:opacity-50"
              >
                {handleLoading ? (
                  <span className="flex items-center">
                    <Spinner animation="border" size="sm" className="mr-1" />
                    처리 중...
                  </span>
                ) : (
                  '처리 완료'
                )}
              </button>
            )}
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReportList;
