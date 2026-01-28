import React from "react";
import { Row } from "react-bootstrap";

const TabButtons = ({ tabs, activeTab, onTabChange, wrapWithRow = false }) => {
  const content = (
    <div className="flex justify-center gap-2.5 py-3 px-4 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-full border-none !text-sm font-medium cursor-pointer transition-all duration-300 focus:outline-none whitespace-nowrap
            ${
              activeTab === tab.id
                ? "bg-green-primary text-white hover:bg-green-dark"
                : "bg-gray-200 text-gray-600 hover:bg-green-badge hover:text-green-dark"
            }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  if (wrapWithRow) {
    return <Row className="m-0 p-0">{content}</Row>;
  }

  return content;
};

export default TabButtons;
