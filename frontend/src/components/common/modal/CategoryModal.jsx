import { useState } from "react";

export default function CategoryModal({ onClose, onSubmit }) {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(categoryData);
    onClose();
  };

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">새 카테고리 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              카테고리 이름
            </label>
            <input
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              설명
            </label>
            <textarea
              name="description"
              value={categoryData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
