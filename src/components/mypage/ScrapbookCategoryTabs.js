import React from "react";
import TabButtons from "../common/TabButtons";

const ScrapbookCategoryTabs = ({
  categories,
  currentCategory,
  onCategoryChange,
}) => {
  const tabs = categories.map((category) => ({
    id: category,
    label: category,
  }));

  return (
    <TabButtons
      tabs={tabs}
      activeTab={currentCategory}
      onTabChange={onCategoryChange}
    />
  );
};

export default ScrapbookCategoryTabs;
