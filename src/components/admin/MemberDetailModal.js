import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, Form } from 'react-bootstrap';
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
    if (!member) return { bg: '#F5F5F5', color: '#888', label: '-' };
    if (member.deletedAt) return { bg: '#FFEBEE', color: '#D32F2F', label: '탈퇴' };
    if (member.isSuspended) {
      const isPermanent = member.suspendedUntil && new Date(member.suspendedUntil) >= new Date(PERMANENT_THRESHOLD);
      return { bg: '#FFF3E0', color: '#F57C00', label: isPermanent ? '영구 정지' : '정지' };
    }
    return { bg: '#E8F5E9', color: '#1E9E57', label: '활성' };
  };

  const getRoleInfo = () => {
    if (!member) return { bg: '#F5F5F5', color: '#888', label: '-' };
    switch (member.role) {
      case 'ADMIN': return { bg: '#FFEBEE', color: '#D32F2F', label: '관리자' };
      default: return { bg: '#F5F5F5', color: '#888', label: '일반' };
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <Modal.Header closeButton style={{ border: 'none', padding: '24px 24px 0' }}>
          <Modal.Title style={{ fontWeight: 800, fontSize: '20px' }}>회원 상세 정보</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '20px 24px 24px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Spinner animation="border" variant="success" />
              <p style={{ marginTop: '16px', color: '#888', fontSize: '14px' }}>로딩 중...</p>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {member && !loading && (
            <>
              {/* 프로필 섹션 */}
              <div style={{
                background: 'linear-gradient(135deg, #1E9E57, #16a34a)',
                borderRadius: '18px',
                padding: '28px 24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}>
                {/* 큰 이니셜 아바타 */}
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {getInitial(member.email)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '8px',
                  }}>
                    {member.email}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(() => {
                      const roleInfo = getRoleInfo();
                      return (
                        <span style={{
                          background: 'rgba(255,255,255,0.25)',
                          color: '#fff',
                          padding: '3px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}>
                          {roleInfo.label}
                        </span>
                      );
                    })()}
                    {(() => {
                      const statusInfo = getStatusInfo();
                      return (
                        <span style={{
                          background: 'rgba(255,255,255,0.25)',
                          color: '#fff',
                          padding: '3px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}>
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* 탈퇴 정보 */}
              {member.deletedAt && (
                <div style={{
                  background: '#FFF5F5',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '16px',
                  borderLeft: '4px solid #D32F2F',
                }}>
                  <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>탈퇴일</div>
                  <div style={{ fontSize: '14px', color: '#333' }}>{formatDateTime(member.deletedAt)}</div>
                  {member.deleteReason && (
                    <>
                      <div style={{ fontSize: '13px', color: '#888', marginTop: '10px', marginBottom: '4px' }}>탈퇴 사유</div>
                      <div style={{ fontSize: '14px', color: '#333' }}>{member.deleteReason}</div>
                    </>
                  )}
                </div>
              )}

              {/* 정지 상태 표시 */}
              {member.isSuspended && (
                <div style={{
                  background: '#FFF8E1',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '16px',
                  borderLeft: '4px solid #F57C00',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      background: '#FFF3E0',
                      color: '#F57C00',
                      padding: '3px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}>
                      정지 정보
                    </span>
                  </div>
                  {member.suspendReason && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>사유</div>
                      <div style={{ fontSize: '14px', color: '#333' }}>{member.suspendReason}</div>
                    </div>
                  )}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>해제일</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>
                      {member.suspendedUntil && new Date(member.suspendedUntil) >= new Date(PERMANENT_THRESHOLD)
                        ? '영구 정지'
                        : formatDateTime(member.suspendedUntil)}
                    </div>
                  </div>
                  <button
                    onClick={handleUnsuspend}
                    disabled={actionLoading}
                    style={{
                      background: '#1E9E57',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {actionLoading ? '처리 중...' : '정지 해제'}
                  </button>
                </div>
              )}

              {/* 정지 폼 (비정지 상태일 때만) */}
              {!member.isSuspended && !member.deletedAt && (
                <div style={{ marginBottom: '20px' }}>
                  {!showSuspendForm ? (
                    <button
                      onClick={() => setShowSuspendForm(true)}
                      style={{
                        background: 'transparent',
                        color: '#D32F2F',
                        border: '2px solid #D32F2F',
                        borderRadius: '12px',
                        padding: '8px 20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      회원 정지
                    </button>
                  ) : (
                    <div style={{
                      background: '#FFF5F5',
                      borderRadius: '14px',
                      padding: '20px',
                      borderLeft: '4px solid #D32F2F',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '16px',
                      }}>
                        <span style={{
                          background: '#FFEBEE',
                          color: '#D32F2F',
                          padding: '3px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}>
                          회원 정지
                        </span>
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>정지 유형</Form.Label>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                          {['temporary', 'permanent'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setSuspendType(type)}
                              style={{
                                background: suspendType === type
                                  ? (type === 'permanent' ? '#D32F2F' : '#F57C00')
                                  : '#fff',
                                color: suspendType === type ? '#fff' : '#666',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 18px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                              }}
                            >
                              {type === 'temporary' ? '임시 정지' : '영구 정지'}
                            </button>
                          ))}
                        </div>
                      </Form.Group>

                      {suspendType === 'temporary' && (
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>정지 기간</Form.Label>
                          <Form.Select
                            size="sm"
                            value={suspendDays}
                            onChange={(e) => setSuspendDays(Number(e.target.value))}
                            style={{ borderRadius: '10px', padding: '8px 12px' }}
                          >
                            <option value={1}>1일</option>
                            <option value={3}>3일</option>
                            <option value={7}>7일</option>
                            <option value={14}>14일</option>
                            <option value={30}>30일</option>
                          </Form.Select>
                        </Form.Group>
                      )}

                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>정지 사유</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="정지 사유를 입력하세요"
                          value={suspendReason}
                          onChange={(e) => setSuspendReason(e.target.value)}
                          style={{ fontSize: '13px', borderRadius: '10px', resize: 'none' }}
                        />
                      </Form.Group>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={handleSuspend}
                          disabled={actionLoading || !suspendReason.trim()}
                          style={{
                            background: '#D32F2F',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            opacity: actionLoading || !suspendReason.trim() ? 0.5 : 1,
                          }}
                        >
                          {actionLoading ? '처리 중...' : '정지 적용'}
                        </button>
                        <button
                          onClick={resetForm}
                          disabled={actionLoading}
                          style={{
                            background: '#f5f5f5',
                            color: '#666',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
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
                <h6 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px', color: '#222' }}>
                  최근 활동 로그
                </h6>
                {member.recentActivities && member.recentActivities.length > 0 ? (
                  <div style={{ maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
                    {member.recentActivities.map((log, idx) => {
                      const dotColor = ACTION_TYPE_COLORS[log.actionType] || '#888';
                      return (
                        <div
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          style={{
                            display: 'flex',
                            gap: '14px',
                            padding: '14px 0',
                            borderBottom: idx < member.recentActivities.length - 1 ? '1px solid #f0f0f0' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                        >
                          {/* 타임라인 마커 */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingTop: '4px',
                          }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: dotColor,
                              flexShrink: 0,
                            }} />
                            {idx < member.recentActivities.length - 1 && (
                              <div style={{
                                width: '2px',
                                flex: 1,
                                background: '#eee',
                                marginTop: '4px',
                              }} />
                            )}
                          </div>

                          {/* 내용 */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '4px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{
                                background: `${dotColor}15`,
                                color: dotColor,
                                padding: '2px 10px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 600,
                              }}>
                                {ACTION_TYPE_LABELS[log.actionType] || log.actionType}
                              </span>
                              <span style={{
                                background: '#f5f5f5',
                                color: '#888',
                                padding: '2px 10px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 500,
                              }}>
                                {RESOURCE_TYPE_LABELS[log.resourceType] || log.resourceType}
                              </span>
                            </div>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              <span style={{ fontSize: '12px', color: '#aaa' }}>
                                {formatDateTime(log.createdAt)}
                              </span>
                              {log.ipAddress && (
                                <span style={{ fontSize: '11px', color: '#ccc' }}>
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
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                  }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>
                      <span role="img" aria-label="empty">&#128196;</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px' }}>활동 로그가 없습니다.</p>
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
                <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
                  <Modal.Header closeButton style={{ border: 'none', padding: '24px 24px 12px' }}>
                    <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>활동 로그 상세</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ padding: '12px 24px 24px' }}>
                    {selectedLog && (
                      <div style={{
                        background: '#f8f9fa',
                        borderRadius: '14px',
                        padding: '18px',
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>활동</div>
                          <span style={{
                            background: `${ACTION_TYPE_COLORS[selectedLog.actionType] || '#888'}15`,
                            color: ACTION_TYPE_COLORS[selectedLog.actionType] || '#888',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {ACTION_TYPE_LABELS[selectedLog.actionType] || selectedLog.actionType}
                          </span>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>대상 유형</div>
                          <div style={{ fontSize: '14px', color: '#333' }}>
                            {RESOURCE_TYPE_LABELS[selectedLog.resourceType] || selectedLog.resourceType}
                          </div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>대상 ID</div>
                          <code style={{
                            fontSize: '12px',
                            background: '#fff',
                            padding: '4px 10px',
                            borderRadius: '8px',
                          }}>
                            {selectedLog.resourceId || '-'}
                          </code>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>시간</div>
                          <div style={{ fontSize: '14px', color: '#333' }}>{formatFullDateTime(selectedLog.createdAt)}</div>
                        </div>
                        <div style={{ marginBottom: selectedLog.content ? '12px' : '0' }}>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>IP</div>
                          <div style={{ fontSize: '14px', color: '#333' }}>{selectedLog.ipAddress || '-'}</div>
                        </div>
                        {selectedLog.content && (
                          <div>
                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>내용</div>
                            <div style={{
                              padding: '12px',
                              background: '#fff',
                              borderRadius: '10px',
                              whiteSpace: 'pre-wrap',
                              fontSize: '13px',
                              color: '#333',
                              maxHeight: '200px',
                              overflowY: 'auto',
                              lineHeight: 1.5,
                            }}>
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
                              style={{
                                marginTop: '14px',
                                background: '#1E9E57',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 20px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
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

        <Modal.Footer style={{ border: 'none', padding: '0 24px 24px' }}>
          <Button
            onClick={onHide}
            style={{
              background: '#f5f5f5',
              color: '#666',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            닫기
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default MemberDetailModal;
