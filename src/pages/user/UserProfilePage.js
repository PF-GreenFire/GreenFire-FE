import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FiChevronLeft } from "react-icons/fi";
import {
  getPublicProfileAPI,
  followUserAPI,
  unfollowUserAPI,
} from "../../apis/userAPI";
import { useAuth } from "../../hooks/useAuth";
import { TIER_BY_CODE, getTierByPoints } from "../../utils/tierUtils";

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicProfileAPI(userId);
      setProfile(data);
      setFollowing(!!data.isFollowing);
    } catch (e) {
      setError(
        e?.response?.status === 404
          ? "사용자를 찾을 수 없습니다."
          : "프로필 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFollowToggle = async () => {
    if (!isLoggedIn || !profile || busy) return;
    setBusy(true);
    // 낙관적 업데이트
    setFollowing((prev) => !prev);
    try {
      if (following) await unfollowUserAPI(profile.userCode);
      else await followUserAPI(profile.userCode);
    } catch (e) {
      // 실패 시 롤백
      setFollowing((prev) => !prev);
      alert(e?.response?.data?.message || "처리에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">{error || "데이터가 없습니다."}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 text-sm bg-transparent border-none text-green-700 underline cursor-pointer"
        >
          뒤로
        </button>
      </div>
    );
  }

  const tier = profile.spark
    ? (TIER_BY_CODE[profile.spark.tierCode] || getTierByPoints(profile.spark.total))
    : getTierByPoints(0);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-3 py-3">
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none p-1 cursor-pointer"
        >
          <FiChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold flex-1 text-center pr-7">
          프로필
        </h1>
      </div>

      {/* 프로필 카드 */}
      <div className="px-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-3xl">
            {/* TODO: profileKey가 있으면 이미지 endpoint 호출. 일단 이모지 fallback */}
            🐱
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold m-0 truncate">{profile.nickname}</h2>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-base">{tier.emoji}</span>
              <span className="text-xs text-gray-600">{tier.label}의 보호자</span>
              <span className="text-xs text-gray-400">· 불씨 {profile.spark?.total ?? 0}</span>
            </div>
          </div>
        </div>

        {/* 팔로워/팔로잉 + 팔로우 토글 */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-base font-bold m-0">{profile.followerCount}</p>
              <p className="text-xs text-gray-500 m-0">팔로워</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold m-0">{profile.followingCount}</p>
              <p className="text-xs text-gray-500 m-0">팔로잉</p>
            </div>
          </div>
          {!profile.isMe && isLoggedIn && (
            <button
              onClick={handleFollowToggle}
              disabled={busy}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors disabled:opacity-50 ${
                following
                  ? "bg-white text-gray-600 border-gray-300"
                  : "bg-green-700 text-white border-transparent"
              }`}
            >
              {following ? "팔로잉" : "팔로우"}
            </button>
          )}
          {profile.isMe && (
            <button
              onClick={() => navigate("/mypage")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-gray-300 bg-white text-gray-700"
            >
              내 마이페이지
            </button>
          )}
        </div>

        {/* 최근 뱃지 */}
        {profile.recentBadges?.length > 0 && (
          <div className="mt-7">
            <h3 className="text-sm font-bold mb-3">최근 획득한 뱃지</h3>
            <div className="flex gap-3">
              {profile.recentBadges.map((b) => (
                <div
                  key={b.code}
                  className="flex-1 max-w-[100px] flex flex-col items-center bg-gray-50 rounded-xl py-3"
                >
                  <span className="text-3xl">{b.emoji}</span>
                  <span className="text-[11px] text-gray-700 mt-1 text-center break-keep px-1">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
