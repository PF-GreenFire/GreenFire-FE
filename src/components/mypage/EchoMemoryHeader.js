import React from "react";
import { IoIosArrowBack, IoIosSearch, IoMdMore } from "react-icons/io";

const EchoMemoryHeader = ({ username, onGoBack }) => {
  return (
    <div className="flex items-center justify-between py-3 bg-white">
      <div className="flex items-center gap-2">
        <IoIosArrowBack
          className="text-2xl cursor-pointer text-gray-800"
          onClick={onGoBack}
        />
        <h1 className="text-base font-semibold m-0 text-gray-800">
          {username}
        </h1>
      </div>
      <div className="flex gap-3">
        <IoIosSearch className="text-[22px] cursor-pointer text-gray-800 hover:text-green-primary transition-colors" />
        <IoMdMore className="text-[22px] cursor-pointer text-gray-800 hover:text-green-primary transition-colors" />
      </div>
    </div>
  );
};

export default EchoMemoryHeader;
