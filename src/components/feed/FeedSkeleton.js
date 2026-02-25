import React from "react";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-card mb-3 overflow-hidden animate-pulse">
    {/* Header */}
    <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
      <div className="w-9 h-9 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="h-3.5 bg-gray-200 rounded w-24 mb-1" />
        <div className="h-2.5 bg-gray-100 rounded w-16" />
      </div>
    </div>
    {/* Image */}
    <div className="w-full aspect-square bg-gray-200" />
    {/* Action bar */}
    <div className="flex items-center gap-4 px-4 pt-2.5 pb-1">
      <div className="h-4 bg-gray-200 rounded w-10" />
      <div className="h-4 bg-gray-200 rounded w-10" />
      <div className="h-4 bg-gray-200 rounded w-6" />
    </div>
    {/* Body */}
    <div className="px-4 pb-3">
      <div className="h-3.5 bg-gray-200 rounded w-full mb-1.5" />
      <div className="h-3.5 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const FeedSkeleton = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);

export default FeedSkeleton;
