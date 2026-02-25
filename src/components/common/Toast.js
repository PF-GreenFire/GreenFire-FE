import React, { useState, useEffect } from "react";

const Toast = ({ message, show, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // fade-out 후 콜백
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !visible) return null;

  return (
    <div
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="bg-gray-800 text-white text-sm px-5 py-3 rounded-full shadow-lg whitespace-nowrap">
        {message}
      </div>
    </div>
  );
};

export default Toast;
