import React from 'react';
import { Row } from 'react-bootstrap';

const TabNavigation = ({ activeTab, onTabClick }) => {
  return (
    <Row className="m-0 p-0">
      <div className="flex border-t border-b border-gray-200">
        <button
          className={`flex-1 py-3.5 bg-transparent border-none text-sm font-medium cursor-pointer relative transition-colors
            ${activeTab === 'posts' ? 'text-green-primary' : 'text-gray-500'}`}
          onClick={() => onTabClick('posts')}
        >
          게시물
          {activeTab === 'posts' && (
            <span className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-green-primary rounded" />
          )}
        </button>
        <button
          className={`flex-1 py-3.5 bg-transparent border-none text-sm font-medium cursor-pointer relative transition-colors
            ${activeTab === 'likes' ? 'text-green-primary' : 'text-gray-500'}`}
          onClick={() => onTabClick('likes')}
        >
          좋아요
          {activeTab === 'likes' && (
            <span className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-green-primary rounded" />
          )}
        </button>
      </div>
    </Row>
  );
};

export default TabNavigation;
