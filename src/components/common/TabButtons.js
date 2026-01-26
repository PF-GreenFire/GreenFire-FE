import React from "react";
import { Row, Button } from "react-bootstrap";
import "./TabButtons.css";

const TabButtons = ({
  tabs,
  activeTab,
  onTabChange,
  containerClassName = "tab-buttons",
  buttonClassName = "tab-button",
  wrapWithRow = false,
  rowClassName = "tab-buttons-row",
}) => {
  const content = (
    <div className={containerClassName}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          className={`${buttonClassName} ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );

  if (wrapWithRow) {
    return <Row className={rowClassName}>{content}</Row>;
  }

  return content;
};

export default TabButtons;
