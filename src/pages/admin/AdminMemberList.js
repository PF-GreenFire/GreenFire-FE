import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getMembers, changeUserRole } from '../../apis/adminAPI';
import MemberDetailModal from '../../components/admin/MemberDetailModal';

const AdminMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchKeyword]);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMembers(page, PAGE_SIZE, searchKeyword);
      const memberList = data.members || data.content || [];
      if (page === 1) setMembers(memberList);
      else setMembers(prev => [...prev, ...memberList]);
      setHasMore(data.hasMore ?? (memberList.length >= PAGE_SIZE));
    } catch (err) {
      console.error(err);
      setError('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setPage(1);
    setMembers([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleRoleChange = async (userId, newRole) => {
    const ok = window.confirm(`역할을 ${newRole}(으)로 변경하시겠습니까?`);
    if (!ok) return;
    try {
      await changeUserRole(userId, newRole);
      setMembers(prev =>
        prev.map(m => m.userId === userId ? { ...m, role: newRole } : m)
      );
      alert('역할이 변경되었습니다.');
    } catch (err) {
      console.error(err);
      alert('역할 변경에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getInitial = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN': return { bg: '#FFEBEE', color: '#D32F2F', label: '관리자' };
      case 'MANAGER': return { bg: '#FFF3E0', color: '#F57C00', label: '매니저' };
      default: return { bg: '#F5F5F5', color: '#888', label: '일반' };
    }
  };

  const getStatusStyle = (member) => {
    if (member.deletedAt) return { bg: '#FFEBEE', color: '#D32F2F', label: '탈퇴' };
    return { bg: '#E8F5E9', color: '#1E9E57', label: '활성' };
  };

  const openMemberDetail = (userId) => {
    setSelectedUserId(userId);
    setShowDetail(true);
  };

  return (
    <div>
      <h5 style={{ fontWeight: 800, marginBottom: '20px', fontSize: '18px', color: '#222' }}>
        회원 관리
      </h5>

      {/* 검색바 */}
      <div style={{
        display: 'flex',
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '16px',
          color: '#aaa',
        }}>
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          placeholder="이메일 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            padding: '12px',
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
            padding: '12px 20px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          검색
        </button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* 회원 카드 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {members.map((member) => {
          const roleStyle = getRoleStyle(member.role);
          const statusStyle = getStatusStyle(member);
          return (
            <div
              key={member.userId}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                onClick={() => openMemberDetail(member.userId)}
              >
                {/* 이니셜 아바타 */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1E9E57, #16a34a)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {getInitial(member.email)}
                </div>

                {/* 회원 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#222',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {member.email}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '6px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      background: roleStyle.bg,
                      color: roleStyle.color,
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {roleStyle.label}
                    </span>
                    <span style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {statusStyle.label}
                    </span>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>
                      {formatDate(member.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 역할 변경 셀렉트 */}
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #f0f0f0',
              }}
              onClick={(e) => e.stopPropagation()}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>
                    역할 변경
                  </span>
                  <Form.Select
                    size="sm"
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                    disabled={!!member.deletedAt}
                    style={{
                      fontSize: '12px',
                      borderRadius: '10px',
                      border: '1px solid #e0e0e0',
                      maxWidth: '140px',
                    }}
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </Form.Select>
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

      {!loading && members.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <span role="img" aria-label="empty">&#128100;</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px' }}>회원이 없습니다.</p>
        </div>
      )}

      {!loading && hasMore && members.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            onClick={() => setPage(prev => prev + 1)}
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

      {/* 회원 상세 모달 */}
      <MemberDetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        userId={selectedUserId}
        onMemberUpdated={fetchMembers}
      />
    </div>
  );
};

export default AdminMemberList;
