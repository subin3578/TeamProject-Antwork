import React, { useEffect, useState } from "react";
import {
  fetchPopups,
  updatePopup,
  addPopup,
  deletePopup,
} from "../../../api/popupAPI";
import useAuthStore from "@/store/AuthStore";
import dayjs from "dayjs";
const PopupManager = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [popups, setPopups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(""); // 사용자 알림 메시지 상태
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  // 팝업 데이터 가져오기
  useEffect(() => {
    const loadPopups = async () => {
      try {
        if (!user?.company) return; // companyId가 없으면 아무 것도 로드하지 않음
        const data = await fetchPopups(user.company); // 회사별 팝업 데이터 가져오기
        setPopups(data);
      } catch (error) {
        console.error("팝업 데이터를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPopups();
  }, [user?.company]);

  const handleAddPopup = () => {
    setEditingPopup(null);
    setIsAddPopupOpen(true);
  };

  const handleSavePopup = async (popup) => {
    try {
      const popupWithCompanyId = { ...popup, companyId: user.company }; // 회사 ID 추가
      if (editingPopup) {
        // 수정
        const updatedPopup = await updatePopup(
          editingPopup.id,
          popupWithCompanyId
        );
        setPopups(
          popups.map((p) => (p.id === editingPopup.id ? updatedPopup : p))
        );
        alert("팝업이 성공적으로 수정되었습니다.");
      } else {
        // 추가
        const newPopup = await addPopup(popupWithCompanyId);
        setPopups([...popups, newPopup]);
        alert("새 팝업이 성공적으로 추가되었습니다.");
      }
      setIsAddPopupOpen(false);
    } catch (error) {
      console.error("팝업 저장 중 오류가 발생했습니다:", error);
      alert("팝업을 저장하는 중 오류가 발생했습니다.");
    }
  };

  const handleEditPopup = (popup) => {
    setEditingPopup(popup);
    setIsAddPopupOpen(true);
  };

  const handleDeletePopup = async (id) => {
    try {
      await deletePopup(id);
      setPopups(popups.filter((popup) => popup.id !== id));
      alert("팝업이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("팝업 삭제 중 오류가 발생했습니다:", error);
      alert("팝업을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">팝업 관리</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">팝업 리스트</h2>
          <button
            onClick={handleAddPopup}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            팝업 추가
          </button>
        </div>

        {popups.length === 0 ? (
          <p className="text-gray-600 text-center mt-6">
            현재 등록된 팝업이 없습니다.
          </p>
        ) : (
          <PopupTable
            popups={popups}
            onDelete={handleDeletePopup}
            onEdit={handleEditPopup}
          />
        )}

        {isAddPopupOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                {editingPopup ? "팝업 수정" : "팝업 추가"}
              </h3>
              <PopupForm
                popup={editingPopup}
                onSave={handleSavePopup}
                onCancel={() => setIsAddPopupOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PopupTable = ({ popups, onDelete, onEdit }) => (
  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
    <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
      <tr>
        <th className="py-3 px-6 text-left">제목</th>
        <th className="py-3 px-6 text-left">설명</th>
        <th className="py-3 px-6 text-center">상태</th>
        <th className="py-3 px-6 text-center">기간</th>
        <th className="py-3 px-6 text-center">액션</th>
      </tr>
    </thead>
    <tbody className="text-gray-600 text-sm font-light">
      {popups.map((popup) => (
        <tr
          key={popup.id}
          className="border-b border-gray-200 hover:bg-gray-100 transition"
        >
          <td className="py-3 px-6">{popup.title}</td>
          <td className="py-3 px-6">{popup.description}</td>
          <td className="text-center py-3 px-6">
            {popup.active ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                활성
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                비활성
              </span>
            )}
          </td>
          <td className="text-center py-3 px-6">
            {dayjs(popup.startDate).format("YYYY-MM-DD")} ~{" "}
            {dayjs(popup.endDate).format("YYYY-MM-DD")}
          </td>
          <td className="text-center py-3 px-6 space-x-2">
            <button
              onClick={() => onEdit(popup)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(popup.id)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              삭제
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
const PopupForm = ({ popup, onSave, onCancel }) => {
  const [title, setTitle] = useState(popup?.title || "");
  const [description, setDescription] = useState(popup?.description || "");
  const [active, setActive] = useState(popup?.active || false);
  const [startDate, setStartDate] = useState(popup?.startDate || "");
  const [endDate, setEndDate] = useState(popup?.endDate || "");
  const [errorMessage, setErrorMessage] = useState("");

  const validateDates = () => {
    if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage("종료 날짜는 시작 날짜보다 이후여야 합니다.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateDates()) return;
    onSave({ title, description, active, startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          required
        ></textarea>
      </div>
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
        />
        <label className="text-gray-600 font-medium">활성화</label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">
          시작 날짜
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">
          종료 날짜
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={validateDates}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 ${
            errorMessage ? "border-red-500" : "border-gray-300"
          }`}
          required
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          저장
        </button>
      </div>
    </form>
  );
};

export default PopupManager;
