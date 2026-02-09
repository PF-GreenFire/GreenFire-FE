import { useNavigate } from "react-router-dom";

const SectionHeader = ({ title, count, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-base font-semibold text-gray-800 m-0">
        {title}{" "}
        {count !== undefined && (
          <span className="text-sm font-normal text-gray-500">+{count}</span>
        )}
      </h3>
      <button
        className="bg-transparent border-none text-gray-500 text-sm cursor-pointer p-0 hover:text-green-primary"
        onClick={() => navigate(navigateTo)}
      >
        더보기
      </button>
    </div>
  );
};

export default SectionHeader;
