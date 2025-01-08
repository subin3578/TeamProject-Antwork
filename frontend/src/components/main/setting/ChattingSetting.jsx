import React, { useState, useEffect } from "react";
import {
  getForbiddenWords,
  addForbiddenWord,
  deleteForbiddenWord,
} from "@/api/chattingAPI";

export default function ChattingSetting() {
  const [forbiddenWords, setForbiddenWords] = useState([]); // 금칙어 목록 상태
  const [newWord, setNewWord] = useState(""); // 새 금칙어 입력 상태

  // 금칙어 목록 로드
  useEffect(() => {
    const loadForbiddenWords = async () => {
      try {
        const words = await getForbiddenWords();
        setForbiddenWords(words);
      } catch (error) {
        console.error("금칙어 목록 로드 실패:", error);
      }
    };

    loadForbiddenWords();
  }, []);

  // 금칙어 추가 핸들러
  const handleAddForbiddenWord = async () => {
    if (!newWord.trim()) return;
    if (!window.confirm("금칙어를 추가하시겠습니까?")) return;

    try {
      const addedWord = await addForbiddenWord(newWord);
      setForbiddenWords((prev) => [...prev, addedWord]);
      setNewWord(""); // 입력 필드 초기화
      alert("금칙어가 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("금칙어 추가 실패:", error);
      alert("금칙어 추가에 실패했습니다.");
    }
  };

  // 금칙어 삭제 핸들러
  const handleDeleteForbiddenWord = async (id) => {
    if (!window.confirm("금칙어를 삭제하시겠습니까?")) return;

    try {
      await deleteForbiddenWord(id);
      setForbiddenWords((prev) => prev.filter((word) => word.id !== id));
      alert("금칙어가 삭제되었습니다.");
    } catch (error) {
      console.error("금칙어 삭제 실패:", error);
      alert("금칙어 삭제에 실패했습니다.");
    }
  };

  return (
    <article className="page-list max-w-9xl mx-auto p-6">
      <div className="content-header">
        <h1>Chatting Settings</h1>
        <p className="!mb-5">금칙어를 추가, 삭제할 수 있습니다.</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        {/* 금칙어 추가 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">채팅 금칙어 관리</h2>
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="금칙어를 입력하세요"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddForbiddenWord}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>

          {/* 금칙어 목록 */}
          <ul className="space-y-2">
            {forbiddenWords.map((word) => (
              <li
                key={word.id}
                className="flex justify-between items-center p-3 bg-white border rounded"
              >
                <span>{word.word}</span>
                <button
                  onClick={() => handleDeleteForbiddenWord(word.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

