import React from "react";
import { Row } from "react-bootstrap";
import { IoIosArrowBack, IoIosSearch, IoMdMore } from "react-icons/io";

const EchoMemoryHeader = ({ username, onGoBack }) => {
  return (
    <Row className="m-0 p-0">
      <div className="flex items-center justify-between py-4 bg-white mb-4">
        <div className="flex items-center gap-0">
          <IoIosArrowBack
            className="text-2xl cursor-pointer text-gray-800"
            onClick={onGoBack}
          />
          <h1 className="text-lg font-semibold m-0 text-gray-800">{username}</h1>
        </div>
        <div className="flex gap-4">
          <IoIosSearch className="text-[22px] cursor-pointer text-gray-800" />
          <IoMdMore className="text-[22px] cursor-pointer text-gray-800" />
        </div>
      </div>
    </Row>
  );
};

export default EchoMemoryHeader;
