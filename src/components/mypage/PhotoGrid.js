import React from "react";
import { BsImage } from "react-icons/bs";

const PhotoGrid = ({ posts }) => {
  // 데이터가 없을 때
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <BsImage size={48} className="mb-3 opacity-50" />
        <p className="text-sm m-0">아직 게시물이 없어요</p>
        <p className="text-xs m-0 mt-1">첫 번째 게시물을 올려보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-px bg-gray-200">
      {posts.map((post) => (
        <div
          key={post.id}
          className="relative w-full pb-[100%] overflow-hidden bg-gray-100 cursor-pointer"
        >
          <img
            src={post.imageUrl}
            alt={`게시물 ${post.id}`}
            className="absolute top-0 left-0 w-full h-full object-cover transition-opacity hover:opacity-90"
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
