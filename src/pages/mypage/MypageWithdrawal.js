import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsHouseDoor, BsAward } from "react-icons/bs";
import { IoRestaurantOutline } from "react-icons/io5";
import PageHeader from "../../components/mypage/PageHeader";

const WITHDRAWAL_REASONS = [
  { id: "no_restaurant", label: "원하는 식당이 없어요" },
  { id: "inconvenient", label: "오류가 많거나 사용이 불편해요" },
  { id: "low_usage", label: "사용 빈도가 낮아요" },
  { id: "delete_records", label: "기록을 삭제하고 싶어요" },
  { id: "custom", label: "직접 입력" },
];

const MypageWithdrawal = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  // 임시 사용자 데이터 (추후 Redux에서 가져올 수 있음)
  const [userInfo] = useState({
    nickname: "메밀면",
  });

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

  const handleWithdraw = () => {
    if (!selectedReason) {
      alert("탈퇴 사유를 선택해주세요.");
      return;
    }

    if (selectedReason === "custom" && !customReason.trim()) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }

    const reason =
      selectedReason === "custom"
        ? customReason
        : WITHDRAWAL_REASONS.find((r) => r.id === selectedReason)?.label;

    if (
      window.confirm(
        "정말로 탈퇴하시겠습니까?\n탈퇴 후에는 복구할 수 없습니다.",
      )
    ) {
      console.log("회원탈퇴 처리:", { reason });
      // TODO: API 호출하여 회원탈퇴 처리
      // 탈퇴 완료 후 메인 페이지로 이동
      navigate("/");
    }
  };

  return (
    <>
      <PageHeader title={`${userInfo.nickname}님의 정보`} />

      <div className="px-4 pb-[120px]">
        {/* 제목 */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-800 m-0">
            {userInfo.nickname} 님,
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
            {userInfo.nickname} 님의 소중한 기록이 모두 사라져요.
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
            {userInfo.nickname} 님의 소중한 의견을 통해 더 나은 초록불이 될게요.
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

        {/* 탈퇴하기 버튼 */}
        <button
          className="w-full py-4 rounded-full bg-green-primary border-none text-base font-semibold text-white cursor-pointer transition-all hover:!bg-green-dark focus:outline-none"
          onClick={handleWithdraw}
        >
          탈퇴하기
        </button>
      </div>
    </>
  );
};

export default MypageWithdrawal;
