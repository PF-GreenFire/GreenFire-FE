import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../modules/ScrapbookReducer";
import SectionHeader from "./SectionHeader";

const ScrapbookSection = ({ scrapbook }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCategoryClick = (tab) => {
    dispatch(setActiveTab(tab));
    navigate("/mypage/scrapbook");
  };

  return (
    <section className="mb-6">
      <SectionHeader title="나의 스크랩북" navigateTo="/mypage/scrapbook" />
      <div className="flex bg-green-light rounded-xl py-4 px-2">
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("greenFire")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.greenFireCount}
          </span>
          <span className="text-sm text-gray-600">초록불</span>
        </div>
        <div className="w-px bg-[#B8D4B4] mx-1" />
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("challenge")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.challengeCount}
          </span>
          <span className="text-sm text-gray-600">챌린지</span>
        </div>
        <div className="w-px bg-[#B8D4B4] mx-1" />
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("feed")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.feedCount}
          </span>
          <span className="text-sm text-gray-600">피드</span>
        </div>
        <div className="w-px bg-[#B8D4B4] mx-1" />
        <div
          className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick("friend")}
        >
          <span className="text-lg font-semibold text-gray-800">
            {scrapbook.friendCount}
          </span>
          <span className="text-sm text-gray-600">친구</span>
        </div>
      </div>
    </section>
  );
};

export default ScrapbookSection;
