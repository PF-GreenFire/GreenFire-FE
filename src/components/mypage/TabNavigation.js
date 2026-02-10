import React from "react";

const TabNavigation = ({ activeTab, onTabClick }) => {
  return (
    <div className="flex border-t border-b border-gray-200 mt-2">
      <button
        className={`flex-1 py-3 bg-transparent border-none text-sm font-medium cursor-pointer relative transition-colors
          ${activeTab === "posts" ? "text-green-primary" : "text-gray-400"}`}
        onClick={() => onTabClick("posts")}
      >
        게시물
        {activeTab === "posts" && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50px] h-[2px] bg-green-primary rounded" />
        )}
      </button>
      <button
        className={`flex-1 py-3 bg-transparent border-none text-sm font-medium cursor-pointer relative transition-colors
          ${activeTab === "likes" ? "text-green-primary" : "text-gray-400"}`}
        onClick={() => onTabClick("likes")}
      >
        좋아요
        {activeTab === "likes" && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50px] h-[2px] bg-green-primary rounded" />
        )}
      </button>
    </div>
  );
};

export default TabNavigation;
