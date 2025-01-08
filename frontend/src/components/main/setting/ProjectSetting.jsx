import {
  addAttribute,
  deleteAttribute,
  fetchAttributes,
  updateAttribute,
} from "@/api/projectAPI";
import React, { useState, useEffect } from "react";

export default function ProjectSetting() {
  const [priorities, setPriorities] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [newPriority, setNewPriority] = useState("");
  const [newSize, setNewSize] = useState("");
  const [editingPriority, setEditingPriority] = useState(null);
  const [editingSize, setEditingSize] = useState(null);

  // 우선순위와 크기 데이터 로드
  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const priorityData = await fetchAttributes("PRIORITY");
        const sizeData = await fetchAttributes("SIZE");

        setPriorities(priorityData);
        setSizes(sizeData);
      } catch (error) {
        console.error("Error loading attributes:", error);
      }
    };

    loadAttributes();
  }, []);

  // 속성 등록 핸들러
  const handleAddAttribute = async (name, type) => {
    if (!name.trim()) return;

    const isConfirmed = window.confirm(
      `해당 ${type === "PRIORITY" ? "우선순위" : "크기"}를 등록하시겠습니까?`
    );
    if (!isConfirmed) return;

    try {
      const newItem = await addAttribute({ name, type });

      if (type === "PRIORITY") {
        setPriorities((prev) => [...prev, newItem]);
        setNewPriority("");
      } else {
        setSizes((prev) => [...prev, newItem]);
        setNewSize("");
      }

      window.alert(`성공적으로 등록되었습니다.`);
    } catch (error) {
      console.error("Error adding attribute:", error);
    }
  };

  // 속성 수정 핸들러
  const handleUpdateAttribute = async (id, name, type) => {
    if (!name.trim()) return;

    try {
      const updatedData = await updateAttribute(id, { name, type });

      if (type === "PRIORITY") {
        setPriorities((prev) =>
          prev.map((item) => (item.id === id ? updatedData : item))
        );
        setEditingPriority(null);
      } else {
        setSizes((prev) =>
          prev.map((item) => (item.id === id ? updatedData : item))
        );
        setEditingSize(null);
      }

      window.alert(`성공적으로 수정되었습니다.`);
    } catch (error) {
      console.error("Error updating attribute:", error);
    }
  };

  // 속성 삭제 핸들러
  const handleDeleteAttribute = async (id, type) => {
    const isConfirmed = window.confirm(
      `해당 ${type === "PRIORITY" ? "우선순위" : "크기"}를 삭제하시겠습니까?`
    );
    if (!isConfirmed) return;

    try {
      await deleteAttribute(id);

      // 상태에서 삭제된 항목 제거
      if (type === "PRIORITY") {
        setPriorities((prev) => prev.filter((p) => p.id !== id));
      } else {
        setSizes((prev) => prev.filter((s) => s.id !== id));
      }

      window.alert(`정상적으로 삭제되었습니다.`);
    } catch (error) {
      console.error("Error deleting attribute:", error);
      window.alert("삭제에 실패했습니다.");
    }
  };

  return (
    <article className="page-list w-[1100px] mx-auto">
      <div className="content-header">
        <h1>프로젝트 설정</h1>
        <p className="!mb-5 mt-[9px]">
          작업 우선순위와 작업 크기 데이터를 관리할 수 있습니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        {/* 우선순위 설정 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">작업 우선순위 설정</h2>
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="새 작업 우선순위 추가 (예: P0 - 긴급)"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => handleAddAttribute(newPriority, "PRIORITY")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>
          <ul className="space-y-2">
            {priorities.map((priority) => (
              <li
                key={priority.id}
                className="flex justify-between items-center p-3 bg-white border rounded"
              >
                {editingPriority?.id === priority.id ? (
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={editingPriority.name}
                      onChange={(e) =>
                        setEditingPriority({
                          ...editingPriority,
                          name: e.target.value,
                        })
                      }
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() =>
                        handleUpdateAttribute(
                          editingPriority.id,
                          editingPriority.name,
                          "PRIORITY"
                        )
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingPriority(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{priority.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPriority(priority)}
                        className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteAttribute(priority.id, "PRIORITY")
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* 크기 설정 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">작업 크기 설정</h2>
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="새 작업 크기 추가 (예: S - 소형)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => handleAddAttribute(newSize, "SIZE")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>
          <ul className="space-y-2">
            {sizes.map((size) => (
              <li
                key={size.id}
                className="flex justify-between items-center p-3 bg-white border rounded"
              >
                {editingSize?.id === size.id ? (
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={editingSize.name}
                      onChange={(e) =>
                        setEditingSize({
                          ...editingSize,
                          name: e.target.value,
                        })
                      }
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() =>
                        handleUpdateAttribute(
                          editingSize.id,
                          editingSize.name,
                          "SIZE"
                        )
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingSize(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{size.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSize(size)}
                        className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteAttribute(size.id, "SIZE")}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
