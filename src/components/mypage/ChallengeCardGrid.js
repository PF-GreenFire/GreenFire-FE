import React from "react";

const ChallengeCardGrid = ({ challenges, onChallengeClick }) => {
  return (
    <div className="grid grid-cols-3 gap-3 pb-20 max-h-[60vh] overflow-y-auto">
      {challenges.length > 0 ? (
        challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="cursor-pointer transition-transform duration-200 bg-white rounded-xl overflow-hidden hover:-translate-y-0.5"
            onClick={() => onChallengeClick(challenge.id)}
          >
            <div className="relative w-full pb-[100%] overflow-hidden bg-gray-100 rounded-xl">
              <img
                src={challenge.imageUrl || "/challenge-placeholder.png"}
                alt={challenge.title}
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="py-2 px-1 text-center">
              <p className="m-0 text-[13px] font-normal text-gray-600">
                {challenge.type || "기연빙"}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-16 px-5 text-gray-400">
          <p className="text-base m-0">챌린지가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ChallengeCardGrid;
