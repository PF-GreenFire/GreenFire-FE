import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsHouseDoor, BsAward } from "react-icons/bs";
import { IoRestaurantOutline } from "react-icons/io5";
import PageHeader from "../../components/mypage/PageHeader";
import { deleteAccount } from "../../apis/authAPI";
import { useAuth } from "../../hooks/useAuth";

const WITHDRAWAL_REASONS = [
  { id: "no_restaurant", label: "원하는 식당이 없어요" },
  { id: "inconvenient", label: "오류가 많거나 사용이 불편해요" },
  { id: "low_usage", label: "사용 빈도가 낮아요" },
  { id: "delete_records", label: "기록을 삭제하고 싶어요" },
  { id: "custom", label: "직접 입력" },
];

const MypageWithdrawal = () => {
  const navigate = useNavigate();
  const { onLogout } = useAuth();
  const { user } = useSelector((state) => state.mypageReducer);
  const nickname = user?.nickname || "회원";

  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 임시 통계 데이터 (추후 API에서 가져올 수 있음)
  const [userStats, setUserStats] = useState({
    favoriteStores: 0,
    registeredMeals: 0,
    achievements: 0,
  });

  useEffect(() => {
    // TODO: API 호출하여 사용자 통계 데이터 가져오기
    // 임시 데이터
    setUserStats({
      favoriteStores: 32,
      registeredMeals: 77,
      achievements: 14,
    });
  }, []);

  const handleReasonChange = (reasonId) => {
    setSelectedReason(reasonId);
    if (reasonId !== "custom") {
      setCustomReason("");
    }
  };

  const handleWithdrawClick = () => {
    setError("");

    if (!selectedReason) {
      setError("탈퇴 사유를 선택해주세요.");
      return;
    }

    if (selectedReason === "custom" && !customReason.trim()) {
      setError("탈퇴 사유를 입력해주세요.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmWithdraw = async () => {
    const reason =
      selectedReason === "custom"
        ? customReason
        : WITHDRAWAL_REASONS.find((r) => r.id === selectedReason)?.label;

    setIsLoading(true);
    setShowConfirmModal(false);
    try {
      await deleteAccount(password, reason);
      await onLogout();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "회원 탈퇴에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader title={`${nickname}님의 정보`} />

      <div className="px-4 pb-[120px]">
        {/* 제목 */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-800 m-0">
            {nickname} 님,
          </p>
          <p className="text-xl font-semibold text-gray-800 m-0">
            정말 초록불을 떠나시나요?
          </p>
        </div>

        {/* 안내 박스 1 - 삭제되는 정보 */}
        <div className="border-1 border-green-primary rounded-xl p-4 mb-4 bg-gray-50">
          <p className="text-sm font-semibold text-gray-800 m-0 mb-2">
            회원 탈퇴 시 아래의 정보는 전부 삭제돼요.
          </p>
          <ul className="m-0 pl-5 text-xs text-gray-800 list-disc">
            <li>
              계정 정보, 내 초록불 식단, 내가 찜한 식당, 달성한 업적, 초록불
              통계
            </li>
          </ul>
        </div>

        {/* 안내 박스 2 - 사라지는 기록 */}
        <div className="border-1 border-green-primary rounded-xl p-4 mb-6 bg-gray-50">
          <p className="text-sm font-semibold text-gray-800 m-0 text-center">
            {nickname} 님의 소중한 기록이 모두 사라져요.
          </p>
          <p className="text-xs text-gray-400 m-0 text-center mb-4">
            탈퇴하면 복구할 수 없어요.
          </p>

          {/* 통계 아이콘 */}
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <BsHouseDoor size={28} className="text-gray-600 mb-2" />
              <span className="text-xs text-gray-600">찜한 식당</span>
              <span className="text-sm font-semibold text-gray-800">
                {userStats.favoriteStores}개
              </span>
            </div>
            <div className="flex flex-col items-center">
              <IoRestaurantOutline size={28} className="text-gray-600 mb-2" />
              <span className="text-xs text-gray-600">등록한 식단</span>
              <span className="text-sm font-semibold text-gray-800">
                {userStats.registeredMeals}개
              </span>
            </div>
            <div className="flex flex-col items-center">
              <BsAward size={28} className="text-gray-600 mb-2" />
              <span className="text-xs text-gray-600">달성한 업적</span>
              <span className="text-sm font-semibold text-gray-800">
                {userStats.achievements}개
              </span>
            </div>
          </div>
        </div>

        {/* 탈퇴 사유 */}
        <div className="mb-6">
          <p className="text-base font-semibold text-gray-800 m-0 mb-1">
            탈퇴 사유를 알려주시겠어요?
          </p>
          <p className="text-xs text-gray-500 m-0 mb-4">
            {nickname} 님의 소중한 의견을 통해 더 나은 초록불이 될게요.
          </p>

          {/* 라디오 버튼 목록 */}
          <div className="flex flex-col gap-3">
            {WITHDRAWAL_REASONS.map((reason) => (
              <label
                key={reason.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="withdrawalReason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={() => handleReasonChange(reason.id)}
                  className="w-4 h-4 accent-green-primary"
                />
                <span className="text-sm text-gray-700">{reason.label}</span>
              </label>
            ))}

            {/* 직접 입력 필드 */}
            {selectedReason === "custom" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="탈퇴 사유를 입력해주세요"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-800 resize-none focus:border-green-primary focus:outline-none ml-7"
                rows={3}
              />
            )}
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <p className="text-base font-semibold text-gray-800 m-0 mb-1">
            본인 확인
          </p>
          <p className="text-xs text-gray-500 m-0 mb-4">
            탈퇴를 위해 현재 비밀번호를 입력해주세요.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="현재 비밀번호"
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary"
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="mb-4 py-3 px-4 rounded-lg text-sm"
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
          >
            {error}
          </div>
        )}

        {/* 탈퇴하기 버튼 */}
        <button
          className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-[15px] font-medium text-gray-400 cursor-pointer transition-all duration-300 hover:!bg-red-100 hover:!text-red-600 hover:!border-transparent focus:outline-none"
          onClick={handleWithdrawClick}
          disabled={isLoading}
        >
          {isLoading ? "처리 중..." : "탈퇴하기"}
        </button>
      </div>

      {/* 탈퇴 확인 모달 */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-2xl mx-6 p-6 w-full max-w-[340px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-bold text-gray-800 text-center m-0 mb-2">
              정말 탈퇴하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 text-center m-0 mb-6 leading-relaxed">
              탈퇴 후 <span className="font-semibold text-red-500">30일간 동일 이메일로 재가입이 불가능</span>하며,
              모든 데이터는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-600 cursor-pointer transition-colors hover:bg-gray-50"
                onClick={() => setShowConfirmModal(false)}
              >
                취소
              </button>
              <button
                className="flex-1 py-3 rounded-xl border-none text-sm font-medium text-white cursor-pointer transition-colors"
                style={{ backgroundColor: '#dc2626' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onClick={handleConfirmWithdraw}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MypageWithdrawal;
