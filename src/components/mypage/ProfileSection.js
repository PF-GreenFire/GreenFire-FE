import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuth } from "../../hooks/useAuth";
import { TIER_BY_CODE, getTierByPoints, getNextTier, tierProgress } from "../../utils/tierUtils";

const ProfileSection = ({ user }) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const spark = authUser?.spark;
  const tier = spark
    ? (TIER_BY_CODE[spark.tierCode] || getTierByPoints(spark.total))
    : getTierByPoints(0);
  const next = getNextTier(tier);
  const progress = spark ? tierProgress(spark.total, tier) : 0;

  return (
    <div className="w-full w-[calc(100%+30px)]">
      {/* 배너 이미지 */}
      <div className="w-full h-[120px] overflow-hidden bg-gradient-to-br from-green-primary to-[#6B9B7A]">
        {user.coverImageCode && (
          <img
            src={getImageUrl(`user/me/cover-image/${user.coverImageCode}`)}
            alt="배너"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.style.background =
                "linear-gradient(135deg, #4A7C59 0%, #6B9B7A 100%)";
            }}
          />
        )}
      </div>

      {/* 프로필 정보 */}
      <div className="flex flex-col items-center -mt-[60px] relative z-[1] px-4">
        <div className="w-[120px] h-[120px] rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
          {user.profileImageCode ? (
            <img
              src={getImageUrl(
                `user/me/profile-image/${user.profileImageCode}`,
              )}
              alt="프로필"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = (e2) => {
                  e2.target.style.display = "none";
                  e2.target.parentElement.innerHTML = "<span>🐱</span>";
                };
                e.target.src = "/default_profile.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-5xl">
              <img
                src="/default_profile.png"
                alt="기본 프로필"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = "<span>🐱</span>";
                }}
              />
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold my-3 text-gray-800">
          {user.nickname}
        </h2>
        <button
          className="py-1.5 px-8 text-sm rounded-full border-0 bg-green-primary text-white hover:bg-green-dark transition-colors"
          onClick={() => navigate("/mypage/info")}
        >
          내 정보 수정
        </button>

        {/* 멸종위기동물 등급 카드 */}
        <div className="mt-5 w-full max-w-[480px] bg-white rounded-2xl shadow-md px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl flex-shrink-0">{tier.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-gray-800">
                  {tier.label}
                </span>
                <span className="text-xs text-gray-400">의 보호자</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                {tier.blurb}
              </p>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-primary transition-all"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                  <span>불씨 {spark?.total ?? 0}</span>
                  {next ? (
                    <span>
                      다음 {next.emoji} {next.label}까지 {Math.max(0, (next.threshold - (spark?.total ?? 0)))}
                    </span>
                  ) : (
                    <span>최고 등급 도달!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
