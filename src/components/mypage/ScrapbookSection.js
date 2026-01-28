import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../modules/ScrapbookReducer";

const ScrapbookSection = ({ scrapbook }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCategoryClick = (tab) => {
    dispatch(setActiveTab(tab));
    navigate("/mypage/scrapbook");
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800 m-0">
          나의 스크랩북
        </h3>
        <button
          className="bg-transparent border-none text-gray-500 text-sm cursor-pointer p-0 hover:text-green-primary"
          onClick={() => navigate("/mypage/scrapbook")}
        >
          더보기
        </button>
      </div>
      <div className="flex bg-green-light rounded-xl py-4 px-2">
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("greenFire")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.greenFire}
          </span>
          <span className="text-sm text-gray-600">초록불</span>
        </div>
        <div className="w-px bg-[#B8D4B4] mx-1" />
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("challenge")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.challenge}
          </span>
          <span className="text-sm text-gray-600">챌린지</span>
        </div>
        <div className="w-px bg-[#B8D4B4] mx-1" />
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("feed")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.feed}
          </span>
          <span className="text-sm text-gray-600">피드</span>
        </div>
        <div className="w-px bg-[#B8D4B4] mx-1" />
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("friend")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.friends}
          </span>
          <span className="text-sm text-gray-600">친구</span>
        </div>
      </div>
    </section>
  );
};

export default ScrapbookSection;
