import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center relative py-4">
      <button
        className="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center text-gray-800 absolute left-0 hover:text-green-primary"
        onClick={handleGoBack}
      >
        <IoIosArrowBack size={24} />
      </button>
      <h1 className="text-xl font-semibold text-gray-800 m-0 w-full text-center">
        {title}
      </h1>
    </div>
  );
};

export default PageHeader;
