import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProfileSection = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full -mx-4 w-[calc(100%+30px)]">
      {/* 배너 이미지 */}
      <div className="w-full h-[120px] overflow-hidden bg-gradient-to-br from-green-primary to-[#6B9B7A]">
        <Image
          src={"/images/mypage-banner.png"}
          alt="배너"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.background =
              "linear-gradient(135deg, #4A7C59 0%, #6B9B7A 100%)";
          }}
        />
      </div>

      {/* 프로필 정보 */}
      <div className="flex flex-col items-center -mt-[60px] relative z-[1] px-4">
        <div className="w-[120px] h-[120px] rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-5xl">
              <Image
                src="/images/default-profile.png"
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
          className="py-1.5 px-8 text-sm rounded-full bg-green-primary border-green-primary text-white hover:bg-green-dark hover:border-green-dark transition-colors"
          onClick={() => navigate("/mypage/info")}
        >
          내 정보 수정
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
