import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { findEmail } from "../../apis/authAPI";

const FindEmailPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null); // { exists, maskedEmail }
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const data = await findEmail(email);
      setResult(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "확인 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-5 max-w-[420px] mx-auto px-4">
      <div className="text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">아이디 찾기</h2>
          <div className="text-gray-500 text-sm">
            가입한 이메일 주소를 입력해주세요
          </div>
        </div>

        <form onSubmit={handleSubmit} className="text-left">
          {error && (
            <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-3">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="text-sm font-semibold block mb-1">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full h-12 text-sm border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-admin-green text-white rounded-xl hover:bg-admin-green-dark transition-all disabled:opacity-50"
            disabled={isLoading || !email}
          >
            {isLoading ? "확인 중..." : "확인"}
          </button>
        </form>

        {result && (
          <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200">
            {result.exists ? (
              <div className="text-center">
                <FaCheckCircle
                  size={40}
                  className="text-admin-green mb-3"
                />
                <div className="text-sm text-admin-green font-semibold">
                  가입된 계정입니다
                </div>
                <div className="text-lg font-bold mt-2 text-gray-900">
                  {result.maskedEmail}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <FaTimesCircle
                  size={40}
                  className="text-danger mb-3"
                />
                <div className="text-sm text-danger font-semibold">
                  가입되지 않은 이메일입니다.
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-3 mt-4 text-sm">
          <span
            className="cursor-pointer text-admin-green font-semibold"
            onClick={() => navigate("/")}
          >
            로그인으로 돌아가기
          </span>
          <span className="text-gray-300">|</span>
          <span
            className="cursor-pointer text-admin-green font-semibold"
            onClick={() => navigate("/reset-password")}
          >
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
};

export default FindEmailPage;
