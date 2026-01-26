import React from "react";
import TabButtons from "../common/TabButtons";

const CHALLENGE_TABS = [
  { id: "all", label: "전체" },
  { id: "participating", label: "참여중인 챌린지" },
  { id: "created", label: "내가 만든 챌린지" },
];

const ChallengeTabs = ({ activeTab, onTabClick }) => {
  return (
    <TabButtons
      tabs={CHALLENGE_TABS}
      activeTab={activeTab}
      onTabChange={onTabClick}
      wrapWithRow={true}
    />
  );
};

export default ChallengeTabs;
