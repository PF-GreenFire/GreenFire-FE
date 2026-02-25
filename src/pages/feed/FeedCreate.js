import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import {
  FaChevronLeft,
  FaCamera,
  FaTimes,
  FaTrophy,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import { createFeedPostAPI } from "../../apis/feedAPI";
import api from "../../apis/axios";

const STEPS = [
  { num: 1, label: "실천 선택" },
  { num: 2, label: "어디에서?" },
  { num: 3, label: "나의 이야기" },
];

const FeedCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [postType, setPostType] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);

  // Step 2 데이터
  const [targets, setTargets] = useState([]);
  const [targetLoading, setTargetLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Step 3 데이터
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Step 2: 대상 목록 로드
  useEffect(() => {
    if (step !== 2 || !postType) return;

    const fetchTargets = async () => {
      setTargetLoading(true);
      try {
        if (postType === "CHALLENGE") {
          const result = await api.get("/v1/challenges/participating");
          setTargets(result.data || []);
        } else {
          const result = await api.get("/api/stores/approved");
          setTargets(result.data || []);
        }
      } catch (error) {
        console.error("대상 목록 조회 실패:", error);
        setTargets([]);
      } finally {
        setTargetLoading(false);
      }
    };

    fetchTargets();
  }, [step, postType]);

  // 파일 미리보기 관리
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = files.length + newFiles.length;
    if (total > 5) {
      alert("사진은 최대 5장까지 추가할 수 있습니다.");
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleFileRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("사진을 최소 1장 추가해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        postContent: content.trim(),
        postType,
        challengeCode: postType === "CHALLENGE" ? selectedTarget.challengeCode : null,
        storeCode: postType === "GREENFIRE" ? selectedTarget.storeCode : null,
      };
      await dispatch(createFeedPostAPI(data, files));
      navigate("/feed", { replace: true });
    } catch (error) {
      console.error("피드 등록 실패:", error);
      alert("피드 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 검색 필터링
  const filteredTargets = targets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const name =
      postType === "CHALLENGE"
        ? t.challengeTitle || t.title || ""
        : t.storeName || t.name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pb-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3 py-3 mb-4">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
          className="bg-transparent border-none cursor-pointer p-1 text-gray-600"
        >
          <FaChevronLeft size={18} />
        </button>
        <h1 className="text-lg font-bold m-0">나의 초록 이야기</h1>
      </div>

      {/* 스텝 인디케이터 */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {STEPS.map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s.num
                  ? "bg-admin-green text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {s.num}
            </div>
            <span
              className={`text-xs ${
                step >= s.num
                  ? "text-admin-green font-semibold"
                  : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {s.num < 3 && (
              <div
                className={`w-8 h-0.5 ${
                  step > s.num ? "bg-admin-green" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: 타입 선택 */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-gray-500 mb-2">
            오늘은 어떤 실천을 했나요?
          </p>
          <button
            onClick={() => {
              setPostType("CHALLENGE");
              setSelectedTarget(null);
              setStep(2);
            }}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white hover:border-admin-green ${
              postType === "CHALLENGE"
                ? "border-admin-green"
                : "border-gray-200"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <FaTrophy className="text-emerald-600" size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 mb-1">챌린지에 참여했어요</div>
              <div className="text-xs text-gray-500">
                함께한 챌린지 경험을 나눠보세요
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setPostType("GREENFIRE");
              setSelectedTarget(null);
              setStep(2);
            }}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white hover:border-admin-green ${
              postType === "GREENFIRE"
                ? "border-admin-green"
                : "border-gray-200"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <FaMapMarkerAlt className="text-amber-600" size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 mb-1">초록 장소를 다녀왔어요</div>
              <div className="text-xs text-gray-500">
                방문한 장소의 경험을 나눠보세요
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: 대상 선택 */}
      {step === 2 && (
        <div>
          <p className="text-center text-sm text-gray-500 mb-3">
            {postType === "CHALLENGE"
              ? "어떤 챌린지에 참여했나요?"
              : "어디를 다녀왔나요?"}
          </p>

          {/* 검색 */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green bg-white"
            />
          </div>

          {targetLoading ? (
            <div className="text-center py-10">
              <Spinner animation="border" variant="success" size="sm" />
            </div>
          ) : filteredTargets.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-3">
                {postType === "CHALLENGE" ? "🏆" : "📍"}
              </div>
              <p className="text-sm m-0">
                {postType === "CHALLENGE"
                  ? "아직 참여 중인 챌린지가 없어요"
                  : "아직 방문한 장소가 없어요"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredTargets.map((target) => {
                const code =
                  postType === "CHALLENGE"
                    ? target.challengeCode
                    : target.storeCode;
                const name =
                  postType === "CHALLENGE"
                    ? target.challengeTitle || target.title
                    : target.storeName || target.name;
                const isSelected =
                  selectedTarget &&
                  (postType === "CHALLENGE"
                    ? selectedTarget.challengeCode === code
                    : selectedTarget.storeCode === code);

                return (
                  <button
                    key={code}
                    onClick={() => {
                      setSelectedTarget(target);
                      setStep(3);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all text-left bg-white hover:border-admin-green ${
                      isSelected ? "border-admin-green" : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        postType === "CHALLENGE"
                          ? "bg-emerald-100"
                          : "bg-amber-100"
                      }`}
                    >
                      {postType === "CHALLENGE" ? (
                        <FaTrophy className="text-emerald-600" size={16} />
                      ) : (
                        <FaMapMarkerAlt className="text-amber-600" size={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-gray-800 truncate">
                        {name}
                      </div>
                      {target.description && (
                        <div className="text-xs text-gray-400 truncate mt-0.5">
                          {target.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 3: 글 작성 */}
      {step === 3 && (
        <div>
          {/* 선택된 대상 */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                postType === "CHALLENGE"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {postType === "CHALLENGE" ? "🏆 챌린지 참여" : "📍 장소 방문"}
            </span>
            <span className="text-sm font-semibold text-gray-700 truncate">
              {postType === "CHALLENGE"
                ? selectedTarget?.challengeTitle || selectedTarget?.title
                : selectedTarget?.storeName || selectedTarget?.name}
            </span>
          </div>

          {/* 사진 추가 */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              사진 <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-1">
                ({files.length}/5)
              </span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {previews.map((url, idx) => (
                <div key={idx} className="relative shrink-0">
                  <img
                    src={url}
                    alt={`미리보기 ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    onClick={() => handleFileRemove(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer text-xs"
                  >
                    <FaTimes size={8} />
                  </button>
                </div>
              ))}
              {files.length < 5 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer shrink-0 hover:border-admin-green transition-all bg-white">
                  <FaCamera className="text-gray-400 mb-1" size={18} />
                  <span className="text-[10px] text-gray-400">추가</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileAdd}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              나의 이야기 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="어떤 경험을 했나요? 다른 분들에게도 추천하고 싶은 이유를 적어주세요"
              rows={5}
              maxLength={500}
              className="w-full border border-gray-200 rounded-xl p-3.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-admin-green"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {content.length}/500
            </div>
          </div>

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={submitting || files.length === 0 || !content.trim()}
            className="w-full bg-admin-green text-white border-none rounded-xl py-3.5 font-bold text-[15px] cursor-pointer hover:bg-admin-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner animation="border" size="sm" />
                등록 중...
              </span>
            ) : (
              "나의 실천 공유하기"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedCreate;
