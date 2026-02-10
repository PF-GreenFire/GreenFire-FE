import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

const PasswordChangeModal = ({ show, onHide, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onHide();
  };

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    onSave({
      currentPassword,
      newPassword,
    });

    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0 rounded-2xl overflow-hidden"
    >
      <div className="p-5">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 m-0">
            비밀번호 변경
          </h2>
          <button
            className="bg-transparent border-none p-1 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* 입력 필드 */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center">
            <label className="w-[110px] flex-shrink-0 text-sm text-gray-800 font-medium">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요."
              className="flex-1 border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-800 focus:border-green-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center">
            <label className="w-[110px] flex-shrink-0 text-sm text-gray-800 font-medium">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요."
              className="flex-1 border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-800 focus:border-green-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center">
            <label className="w-[110px] flex-shrink-0 text-sm text-gray-800 font-medium">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 한 번 더 입력하세요."
              className="flex-1 border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-800 focus:border-green-primary focus:outline-none"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3">
          <button
            className="px-6 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all hover:!bg-gray-100"
            onClick={handleClose}
          >
            취소
          </button>
          <button
            className="px-6 py-2.5 rounded-lg bg-green-primary border border-green-primary text-sm font-medium text-white cursor-pointer transition-all hover:!bg-green-dark hover:!border-green-dark"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
