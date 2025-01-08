import {
  addAttribute,
  deleteAttribute,
  fetchAttributes,
  updateAttribute,
} from "@/api/projectAPI";
import React, { useState, useEffect } from "react";

export default function DriveSetting() {
  const [selectedOption, setSelectedOption] = useState("자동 삭제 안함");
  const [appliedOption, setAppliedOption] = useState("자동 삭제 안함"); // 버튼 눌렀을 때 적용된 값

  const handleApply = () => {
    console.log("선택한 옵션:", selectedOption);
    setAppliedOption(selectedOption); // 선택된 값을 적용

    // 선택한 옵션에 따라 동작을 처리
    alert(`"${selectedOption}" 옵션이 적용되었습니다.`);
  };

  return (
    <article className="page-list w-[1100px] mx-auto">
      <div className="content-header">
        <h1>드라이브 설정</h1>
        <p className="!mb-5">휴지통의 보관기간을 설정할 수 있습니다.</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        {/* 우선순위 설정 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">휴지통 보관기간</h2>
          <div className="mb-6 flex gap-2">
            <div className="flex-1 p-2 border rounded">{appliedOption}</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <select
                name=""
                id=""
                className="flex-1 p-2 border rounded mr-[10px]"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="자동 삭제 안함">자동 삭제 안함</option>
                <option value="15일 뒤 자동 삭제">15일 뒤 자동 삭제</option>
                <option value="30일 뒤 자동 삭제">30일 뒤 자동 삭제</option>
              </select>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleApply}
              >
                적용하기
              </button>
            </div>
          </div>
        </section>
        <section>
          - 전체 용량에 휴지통 용량도 포함됩니다.<br></br>- 사용중 용량에 공유중
          용량도 포함됩니다.<br></br>- 휴지통 자동 삭제 기간을 설정하고 삭제한
          항목을 자동으로 관리해보세요.<br></br>
        </section>

        {/* 크기 설정
        <section>
          <h2 className="text-2xl font-semibold mb-4">크기 설정</h2>
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="새 크기 추가 (예: S - 소형)"
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
        </section> */}
      </div>
    </article>
  );
}
