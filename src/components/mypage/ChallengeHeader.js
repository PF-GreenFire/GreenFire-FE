import PageHeader from "./PageHeader";

const ChallengeHeader = ({ username }) => {
  return <PageHeader title={`${username}님의 챌린지`} />;
};

export default ChallengeHeader;
