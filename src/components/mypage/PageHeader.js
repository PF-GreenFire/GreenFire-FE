import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import "./PageHeader.css";

const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-header">
      <button className="page-header-back-btn" onClick={handleGoBack}>
        <IoIosArrowBack size={24} />
      </button>
      <h1 className="page-header-title">{title}</h1>
    </div>
  );
};

export default PageHeader;
