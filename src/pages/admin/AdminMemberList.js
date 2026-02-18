import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
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
      case 'ADMIN': return { bg: 'bg-danger-light', color: 'text-danger', label: '관리자' };
      case 'MANAGER': return { bg: 'bg-warning-light', color: 'text-warning', label: '매니저' };
      default: return { bg: 'bg-gray-100', color: 'text-gray-400', label: '일반' };
    }
  };

  const getStatusStyle = (member) => {
    if (member.deletedAt) return { bg: 'bg-danger-light', color: 'text-danger', label: '탈퇴' };
    return { bg: 'bg-green-lighter', color: 'text-admin-green', label: '활성' };
  };

  const openMemberDetail = (userId) => {
    setSelectedUserId(userId);
    setShowDetail(true);
  };

  return (
    <div>
      <h5 className="font-extrabold mb-5 text-lg text-gray-900">
        회원 관리
      </h5>

      {/* 검색바 */}
      <div className="flex bg-white rounded-[14px] overflow-hidden shadow-card mb-5">
        <div className="flex items-center pl-4 text-gray-400">
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          placeholder="이메일 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 border-none bg-transparent p-3 text-sm outline-none"
        />
        <button
          onClick={handleSearch}
          className="border-none bg-admin-green text-white py-3 px-5 cursor-pointer font-semibold text-[13px]"
        >
          검색
        </button>
      </div>

      {error && (
        <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right text-danger font-bold ml-2">&times;</button>
        </div>
      )}

      {/* 회원 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {members.map((member) => {
          const roleStyle = getRoleStyle(member.role);
          const statusStyle = getStatusStyle(member);
          return (
            <div
              key={member.userId}
              className="bg-white rounded-2xl py-4 px-5 shadow-card transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div
                className="flex items-center gap-3.5"
                onClick={() => openMemberDetail(member.userId)}
              >
                {/* 이니셜 아바타 */}
                <div
                  className="w-11 h-11 rounded-full text-white flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1E9E57, #16a34a)' }}
                >
                  {getInitial(member.email)}
                </div>

                {/* 회원 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                    {member.email}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className={`${roleStyle.bg} ${roleStyle.color} py-0.5 px-2.5 rounded-full text-[11px] font-semibold`}>
                      {roleStyle.label}
                    </span>
                    <span className={`${statusStyle.bg} ${statusStyle.color} py-0.5 px-2.5 rounded-full text-[11px] font-semibold`}>
                      {statusStyle.label}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(member.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 역할 변경 셀렉트 */}
              <div
                className="mt-3 pt-3 border-t border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    역할 변경
                  </span>
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                    disabled={!!member.deletedAt}
                    className="text-xs rounded-[10px] border border-gray-200 max-w-[140px] py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-admin-green"
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
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
        <div className="text-center py-[60px] px-5 text-gray-400">
          <div className="text-[48px] mb-4">
            <span role="img" aria-label="empty">&#128100;</span>
          </div>
          <p className="m-0 text-sm">회원이 없습니다.</p>
        </div>
      )}

      {!loading && hasMore && members.length > 0 && (
        <div className="text-center mt-5">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="bg-transparent border-2 border-admin-green text-admin-green rounded-full py-2.5 px-8 font-semibold text-[13px] transition-all duration-200 hover:bg-admin-green hover:text-white"
          >
            더보기
          </button>
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
