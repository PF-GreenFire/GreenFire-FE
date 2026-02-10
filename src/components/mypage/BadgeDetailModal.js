import React from 'react';
import { Modal } from 'react-bootstrap';

const BadgeDetailModal = ({
  show,
  onClose,
  badge,
  username,
  onDownload,
  badgeCardRef
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="max-w-[90%] mx-auto"
      contentClassName="bg-transparent border-none shadow-none"
    >
      <div className="bg-black/80 rounded-2xl py-10 px-5 relative">
        <div className="absolute top-5 right-5 flex gap-3 z-10">
          <button
            className="w-10 h-10 rounded-full bg-white/20 border-none flex items-center justify-center cursor-pointer transition-colors hover:bg-white/30"
            onClick={onDownload}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white/20 border-none flex items-center justify-center cursor-pointer transition-colors hover:bg-white/30"
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {badge && (
          <div
            className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl py-8 px-6 text-center relative overflow-hidden"
            ref={badgeCardRef}
          >
            <div className="absolute -top-1/2 -right-[10%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)] rounded-full" />
            <div className="absolute -bottom-[30%] -left-[5%] w-[150px] h-[150px] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)] rounded-full" />

            <div className="text-sm text-gray-600 mb-4 relative z-[1]">
              {badge.unlockedDate}
            </div>
            <div className="w-[120px] h-[120px] mx-auto mb-5 relative z-[1]">
              <img src={badge.image} alt={badge.name} className="w-full h-full object-contain" />
            </div>
            <div className="inline-block py-1 px-4 bg-green-primary/20 rounded-xl text-xs text-green-primary font-semibold mb-3 relative z-[1]">
              {badge.category}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 my-3 relative z-[1]">{badge.name}</h3>
            <p className="text-sm text-gray-600 mb-6 relative z-[1]">
              {badge.description}
            </p>
            <div className="mb-4 relative z-[1]">
              <span className="text-base font-semibold text-gray-800">{username}</span>
            </div>
            <p className="text-sm text-gray-600 m-0 relative z-[1]">
              전체 사용자의 6%만이 가지고 있는 배지예요.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BadgeDetailModal;
