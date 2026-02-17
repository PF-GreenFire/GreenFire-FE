import React, { useState, useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMemberDetail, suspendMember, unsuspendMember } from '../../apis/adminAPI';

const ACTION_TYPE_LABELS = {
  LOGIN: '로그인', LOGOUT: '로그아웃', SIGNUP: '회원가입', REFRESH: '토큰 갱신',
  DELETE_ACCOUNT: '계정 탈퇴', CREATE: '작성', UPDATE: '수정', DELETE: '삭제',
  VIEW: '조회', LIKE: '좋아요', UNLIKE: '좋아요 취소', BOOKMARK: '북마크',
  UNBOOKMARK: '북마크 취소', SHARE: '공유', FOLLOW: '팔로우', UNFOLLOW: '언팔로우',
  JOIN: '참여', LEAVE: '탈퇴', COMPLETE: '완료', REPORT: '신고',
  SUSPEND: '계정 정지', UNSUSPEND: '정지 해제',
};

const RESOURCE_TYPE_LABELS = {
  AUTH: '인증', ACCOUNT: '계정', NOTICE: '공지사항', POST: '게시글',
  COMMENT: '댓글', CHALLENGE: '챌린지', USER: '사용자',
};

const PERMANENT_THRESHOLD = '9999-01-01T00:00:00Z';

const ACTION_TYPE_COLORS = {
  LOGIN: '#1E9E57', LOGOUT: '#888', SIGNUP: '#1976D2', REFRESH: '#aaa',
  DELETE_ACCOUNT: '#D32F2F', CREATE: '#1E9E57', UPDATE: '#F57C00', DELETE: '#D32F2F',
  VIEW: '#888', LIKE: '#E91E63', UNLIKE: '#888', BOOKMARK: '#7B1FA2',
  UNBOOKMARK: '#888', SHARE: '#1976D2', FOLLOW: '#1E9E57', UNFOLLOW: '#888',
  JOIN: '#1E9E57', LEAVE: '#D32F2F', COMPLETE: '#1E9E57', REPORT: '#F57C00',
  SUSPEND: '#D32F2F', UNSUSPEND: '#1E9E57',
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const formatFullDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
};

const getResourceLink = (resourceType, resourceId) => {
  if (!resourceId) return null;
  switch (resourceType) {
    case 'NOTICE': return { label: '공지사항 보기', path: `/notices/${resourceId}` };
    case 'CHALLENGE': return { label: '챌린지 보기', path: `/challenges/${resourceId}` };
    default: return null;
  }
};

const MemberDetailModal = ({ show, onHide, userId, onMemberUpdated }) => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [suspendType, setSuspendType] = useState('temporary');
  const [suspendDays, setSuspendDays] = useState(7);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    if (show && userId) {
      fetchDetail();
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, userId]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMemberDetail(userId);
      setMember(data);
    } catch (err) {
      setError('회원 정보를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowSuspendForm(false);
    setSuspendType('temporary');
    setSuspendDays(7);
    setSuspendReason('');
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      alert('정지 사유를 입력해주세요.');
      return;
    }

    const ok = window.confirm(
      suspendType === 'permanent'
        ? '이 회원을 영구 정지하시겠습니까?'
        : `이 회원을 ${suspendDays}일간 정지하시겠습니까?`
    );
    if (!ok) return;

    setActionLoading(true);
    try {
      let until = null;
      if (suspendType === 'temporary') {
        const d = new Date();
        d.setDate(d.getDate() + suspendDays);
        until = d.toISOString();
      }
      await suspendMember(userId, suspendReason.trim(), until);
      alert('회원이 정지되었습니다.');
      resetForm();
      await fetchDetail();
      onMemberUpdated?.();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || '정지 처리에 실패했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    const ok = window.confirm('이 회원의 정지를 해제하시겠습니까?');
    if (!ok) return;

    setActionLoading(true);
    try {
      await unsuspendMember(userId);
      alert('정지가 해제되었습니다.');
      await fetchDetail();
      onMemberUpdated?.();
    } catch (err) {
      console.error(err);
      alert('정지 해제에 실패했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  const getInitial = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const getStatusInfo = () => {
    if (!member) return { bg: 'bg-gray-100', color: 'text-gray-400', label: '-' };
    if (member.deletedAt) return { bg: 'bg-danger-light', color: 'text-danger', label: '탈퇴' };
    if (member.isSuspended) {
      const isPermanent = member.suspendedUntil && new Date(member.suspendedUntil) >= new Date(PERMANENT_THRESHOLD);
      return { bg: 'bg-warning-light', color: 'text-warning', label: isPermanent ? '영구 정지' : '정지' };
    }
    return { bg: 'bg-green-lighter', color: 'text-admin-green', label: '활성' };
  };

  const getRoleInfo = () => {
    if (!member) return { bg: 'bg-gray-100', color: 'text-gray-400', label: '-' };
    switch (member.role) {
      case 'ADMIN': return { bg: 'bg-danger-light', color: 'text-danger', label: '관리자' };
      default: return { bg: 'bg-gray-100', color: 'text-gray-400', label: '일반' };
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <div className="rounded-[20px] overflow-hidden">
        <Modal.Header closeButton className="border-none pt-6 px-6 pb-0">
          <Modal.Title className="font-extrabold text-xl">회원 상세 정보</Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-5 px-6 pb-6">
          {loading && (
            <div className="text-center py-[60px] px-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-4 text-gray-400 text-sm">로딩 중...</p>
            </div>
          )}

          {error && (
            <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {member && !loading && (
            <>
              {/* 프로필 섹션 */}
              <div
                className="rounded-[18px] py-7 px-6 mb-5 flex items-center gap-5"
                style={{ background: 'linear-gradient(135deg, #1E9E57, #16a34a)' }}
              >
                {/* 큰 이니셜 아바타 */}
                <div
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[28px] font-extrabold text-white shrink-0"
                  style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
                >
                  {getInitial(member.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap mb-2">
                    {member.email}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(() => {
                      const roleInfo = getRoleInfo();
                      return (
                        <span
                          className="py-[3px] px-3 rounded-full text-[11px] font-semibold text-white"
                          style={{ background: 'rgba(255,255,255,0.25)' }}
                        >
                          {roleInfo.label}
                        </span>
                      );
                    })()}
                    {(() => {
                      const statusInfo = getStatusInfo();
                      return (
                        <span
                          className="py-[3px] px-3 rounded-full text-[11px] font-semibold text-white"
                          style={{ background: 'rgba(255,255,255,0.25)' }}
                        >
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* 탈퇴 정보 */}
              {member.deletedAt && (
                <div className="bg-[#FFF5F5] rounded-[14px] p-[18px] mb-4 border-l-4 border-l-danger">
                  <div className="text-[13px] text-gray-400 mb-1">탈퇴일</div>
                  <div className="text-sm text-gray-800">{formatDateTime(member.deletedAt)}</div>
                  {member.deleteReason && (
                    <>
                      <div className="text-[13px] text-gray-400 mt-2.5 mb-1">탈퇴 사유</div>
                      <div className="text-sm text-gray-800">{member.deleteReason}</div>
                    </>
                  )}
                </div>
              )}

              {/* 정지 상태 표시 */}
              {member.isSuspended && (
                <div className="bg-[#FFF8E1] rounded-[14px] p-[18px] mb-4 border-l-4 border-l-warning">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="bg-warning-light text-warning py-[3px] px-3 rounded-full text-xs font-bold">
                      정지 정보
                    </span>
                  </div>
                  {member.suspendReason && (
                    <div className="mb-2.5">
                      <div className="text-xs text-gray-400 mb-0.5">사유</div>
                      <div className="text-sm text-gray-800">{member.suspendReason}</div>
                    </div>
                  )}
                  <div className="mb-3.5">
                    <div className="text-xs text-gray-400 mb-0.5">해제일</div>
                    <div className="text-sm text-gray-800">
                      {member.suspendedUntil && new Date(member.suspendedUntil) >= new Date(PERMANENT_THRESHOLD)
                        ? '영구 정지'
                        : formatDateTime(member.suspendedUntil)}
                    </div>
                  </div>
                  <button
                    onClick={handleUnsuspend}
                    disabled={actionLoading}
                    className="bg-admin-green text-white border-none rounded-[10px] py-2 px-5 text-[13px] font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? '처리 중...' : '정지 해제'}
                  </button>
                </div>
              )}

              {/* 정지 폼 (비정지 상태일 때만) */}
              {!member.isSuspended && !member.deletedAt && (
                <div className="mb-5">
                  {!showSuspendForm ? (
                    <button
                      onClick={() => setShowSuspendForm(true)}
                      className="bg-transparent text-danger border-2 border-danger rounded-xl py-2 px-5 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-danger hover:text-white"
                    >
                      회원 정지
                    </button>
                  ) : (
                    <div className="bg-[#FFF5F5] rounded-[14px] p-5 border-l-4 border-l-danger">
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="bg-danger-light text-danger py-[3px] px-3 rounded-full text-xs font-bold">
                          회원 정지
                        </span>
                      </div>

                      <div className="mb-3">
                        <label className="text-[13px] font-semibold text-gray-500 block mb-1">정지 유형</label>
                        <div className="flex gap-2.5 mt-1">
                          {['temporary', 'permanent'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setSuspendType(type)}
                              className={`border-none rounded-[10px] py-2 px-[18px] text-[13px] font-semibold cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${
                                suspendType === type
                                  ? (type === 'permanent' ? 'bg-danger text-white' : 'bg-warning text-white')
                                  : 'bg-white text-gray-500'
                              }`}
                            >
                              {type === 'temporary' ? '임시 정지' : '영구 정지'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {suspendType === 'temporary' && (
                        <div className="mb-3">
                          <label className="text-[13px] font-semibold text-gray-500 block mb-1">정지 기간</label>
                          <select
                            value={suspendDays}
                            onChange={(e) => setSuspendDays(Number(e.target.value))}
                            className="text-sm rounded-[10px] py-2 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-admin-green"
                          >
                            <option value={1}>1일</option>
                            <option value={3}>3일</option>
                            <option value={7}>7일</option>
                            <option value={14}>14일</option>
                            <option value={30}>30일</option>
                          </select>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="text-[13px] font-semibold text-gray-500 block mb-1">정지 사유</label>
                        <textarea
                          rows={2}
                          placeholder="정지 사유를 입력하세요"
                          value={suspendReason}
                          onChange={(e) => setSuspendReason(e.target.value)}
                          className="w-full text-[13px] rounded-[10px] resize-none border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-admin-green"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSuspend}
                          disabled={actionLoading || !suspendReason.trim()}
                          className="bg-danger text-white border-none rounded-[10px] py-2 px-5 text-[13px] font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading ? '처리 중...' : '정지 적용'}
                        </button>
                        <button
                          onClick={resetForm}
                          disabled={actionLoading}
                          className="bg-gray-100 text-gray-500 border-none rounded-[10px] py-2 px-5 text-[13px] font-semibold cursor-pointer"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 활동 로그 - 타임라인 스타일 */}
              <div>
                <h6 className="font-bold text-base mb-4 text-gray-900">
                  최근 활동 로그
                </h6>
                {member.recentActivities && member.recentActivities.length > 0 ? (
                  <div className="max-h-[360px] overflow-y-auto pr-1">
                    {member.recentActivities.map((log, idx) => {
                      const dotColor = ACTION_TYPE_COLORS[log.actionType] || '#888';
                      return (
                        <div
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          className={`flex gap-3.5 py-3.5 cursor-pointer transition-colors duration-200 ${
                            idx < member.recentActivities.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                        >
                          {/* 타임라인 마커 */}
                          <div className="flex flex-col items-center pt-1">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ background: dotColor }}
                            />
                            {idx < member.recentActivities.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                            )}
                          </div>

                          {/* 내용 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span
                                className="py-0.5 px-2.5 rounded-full text-[11px] font-semibold"
                                style={{ background: `${dotColor}15`, color: dotColor }}
                              >
                                {ACTION_TYPE_LABELS[log.actionType] || log.actionType}
                              </span>
                              <span className="bg-gray-100 text-gray-400 py-0.5 px-2.5 rounded-full text-[11px] font-medium">
                                {RESOURCE_TYPE_LABELS[log.resourceType] || log.resourceType}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-300">
                                {formatDateTime(log.createdAt)}
                              </span>
                              {log.ipAddress && (
                                <span className="text-[11px] text-gray-200">
                                  {log.ipAddress}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 px-5 text-gray-400">
                    <div className="text-4xl mb-3">
                      <span role="img" aria-label="empty">&#128196;</span>
                    </div>
                    <p className="m-0 text-[13px]">활동 로그가 없습니다.</p>
                  </div>
                )}
              </div>

              {/* 활동 로그 상세 팝업 */}
              <Modal
                show={!!selectedLog}
                onHide={() => setSelectedLog(null)}
                centered
                size="md"
              >
                <div className="rounded-[20px] overflow-hidden">
                  <Modal.Header closeButton className="border-none pt-6 px-6 pb-3">
                    <Modal.Title className="font-bold text-lg">활동 로그 상세</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="pt-3 px-6 pb-6">
                    {selectedLog && (
                      <div className="bg-gray-50 rounded-[14px] p-[18px]">
                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-1">활동</div>
                          <span
                            className="py-[3px] px-3 rounded-full text-xs font-semibold"
                            style={{
                              background: `${ACTION_TYPE_COLORS[selectedLog.actionType] || '#888'}15`,
                              color: ACTION_TYPE_COLORS[selectedLog.actionType] || '#888',
                            }}
                          >
                            {ACTION_TYPE_LABELS[selectedLog.actionType] || selectedLog.actionType}
                          </span>
                        </div>
                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-1">대상 유형</div>
                          <div className="text-sm text-gray-800">
                            {RESOURCE_TYPE_LABELS[selectedLog.resourceType] || selectedLog.resourceType}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-1">대상 ID</div>
                          <code className="text-xs bg-white py-1 px-2.5 rounded-lg">
                            {selectedLog.resourceId || '-'}
                          </code>
                        </div>
                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-1">시간</div>
                          <div className="text-sm text-gray-800">{formatFullDateTime(selectedLog.createdAt)}</div>
                        </div>
                        <div className={selectedLog.content ? 'mb-3' : ''}>
                          <div className="text-xs text-gray-400 mb-1">IP</div>
                          <div className="text-sm text-gray-800">{selectedLog.ipAddress || '-'}</div>
                        </div>
                        {selectedLog.content && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1.5">내용</div>
                            <div className="p-3 bg-white rounded-[10px] whitespace-pre-wrap text-[13px] text-gray-800 max-h-[200px] overflow-y-auto leading-normal">
                              {selectedLog.content}
                            </div>
                          </div>
                        )}
                        {(() => {
                          const link = getResourceLink(selectedLog.resourceType, selectedLog.resourceId);
                          if (!link) return null;
                          return (
                            <button
                              onClick={() => {
                                setSelectedLog(null);
                                onHide();
                                navigate(link.path);
                              }}
                              className="mt-3.5 bg-admin-green text-white border-none rounded-[10px] py-2 px-5 text-[13px] font-semibold cursor-pointer hover:bg-admin-green-dark transition-all duration-200"
                            >
                              {link.label}
                            </button>
                          );
                        })()}
                      </div>
                    )}
                  </Modal.Body>
                </div>
              </Modal>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-none px-6 pt-0 pb-6">
          <button
            onClick={onHide}
            className="bg-gray-100 text-gray-500 border-none rounded-xl py-2.5 px-6 font-semibold text-sm cursor-pointer hover:bg-gray-200 transition-all duration-200"
          >
            닫기
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default MemberDetailModal;
