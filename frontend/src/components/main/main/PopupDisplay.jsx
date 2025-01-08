import { fetchVisiblePopups, hidePopupForUser } from "@/api/popupAPI";
import useAuthStore from "@/store/AuthStore";
import React, { useEffect, useState } from "react";

const PopupDisplay = () => {
  const [popups, setPopups] = useState([]);
  const [visiblePopup, setVisiblePopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hideFor7Days, setHideFor7Days] = useState(false); // 7일간 보지 않기 체크박스 상태
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadPopups = async () => {
      try {
        if (!user?.id) {
          console.error("사용자 정보가 없습니다.");
          return;
        }
        const data = await fetchVisiblePopups(user.id);
        setPopups(data);
        if (data.length > 0) {
          setVisiblePopup(data[0]);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("팝업 데이터를 가져오는 중 오류 발생:", error);
      }
    };
    loadPopups();
  }, [user?.id]);

  const handleHideFor7Days = async () => {
    try {
      if (visiblePopup && user?.id) {
        await hidePopupForUser(visiblePopup.id, user.id);
        setPopups((prev) =>
          prev.filter((popup) => popup.id !== visiblePopup.id)
        );
        handleClose();
      }
    } catch (error) {
      console.error("팝업 숨김 처리 중 오류 발생:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (popups.length > 1) {
        setVisiblePopup(popups[1]);
        setPopups(popups.slice(1));
        setIsVisible(true);
      } else {
        setVisiblePopup(null);
      }
    }, 300);
  };

  const handleCheckboxChange = (e) => {
    setHideFor7Days(e.target.checked); // 체크박스 상태 업데이트
  };

  const handleAction = () => {
    if (hideFor7Days) {
      handleHideFor7Days(); // 7일간 보지 않기 처리
    } else {
      handleClose(); // 팝업 단순히 닫기
    }
  };

  if (!visiblePopup) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full relative transform transition-transform duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Popup Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {visiblePopup.title}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {visiblePopup.description}
          </p>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Footer Section */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={hideFor7Days}
              onChange={handleCheckboxChange} // 상태 변경 핸들러
              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2">7일간 보지 않기</span>
          </label>
          <button
            onClick={handleAction} // 체크박스 상태에 따라 동작
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            {hideFor7Days ? "확인" : "닫기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupDisplay;
