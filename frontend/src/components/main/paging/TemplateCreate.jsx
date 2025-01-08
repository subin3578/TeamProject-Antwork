import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_CREATE_URI } from "../../../api/_URI";
import axiosInstance from "@utils/axiosInstance";
import { useEditor } from "../../../hooks/paging/useEditor";
import useAuthStore from "@/store/AuthStore";
import EmojiPicker from "emoji-picker-react";

const TemplateCreate = () => {
  // 기본 상태들
  const [title, setTitle] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // navigation
  const navigate = useNavigate();

  // refs
  const editorRef = useRef(null);

  // 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);
  const uid = user?.uid;
  const name = user?.name;
  const profile = user?.profile;
  const rate = user?.companyRate;
  // uid 체크 로그인 안되어 있으면 로그인 페이지로
  useEffect(() => {
    if (!uid) {
      console.warn("User ID is not available");
      navigate("/login");
      return;
    }
  }, [uid, navigate]);

  // Editor 훅 사용 (웹소켓 없이)
  const createEditor = useEditor(() => {});

  // 에디터 초기화
  const initializeEditor = async () => {
    try {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        await editorRef.current.destroy();
        editorRef.current = null;
      }

      const editor = await createEditor();
      editorRef.current = editor;
      return editor;
    } catch (error) {
      console.error("Error initializing editor:", error);
    }
  };

  // 컴포넌트 마운트 시 에디터 초기화
  useEffect(() => {
    initializeEditor();
  }, []);

  // 제목 변경 핸들러
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // 이모지 선택 핸들러
  const onEmojiClick = (emojiObject) => {
    const titleWithoutEmoji = title.replace(/^\p{Emoji}\s*/u, "");
    const newTitle = `${emojiObject.emoji} ${titleWithoutEmoji}`;
    setTitle(newTitle);
    setShowEmojiPicker(false);
  };

  // 템플릿 저장 핸들러
  const handleSaveTemplate = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!editorRef.current) {
        throw new Error("에디터가 초기화되지 않았습니다.");
      }

      const savedData = await editorRef.current.save();

      const templateData = {
        _id: undefined, // MongoDB에서 자동 생성
        title: title || "제목 없는 템플릿",
        content: JSON.stringify(savedData),
        owner: uid,
        ownerName: name,
        isTemplate: Boolean(true),
        companyRate: rate,
      };
      console.log("templateData", templateData);

      const response = await axiosInstance.post(PAGE_CREATE_URI, templateData);

      if (response.data) {
        alert("템플릿이 성공적으로 저장되었습니다.");
        navigate("/antwork/page/template"); // 템플릿 목록 페이지로 이동
      }
    } catch (error) {
      console.error("템플릿 저장 중 오류 발생:", error);
      alert("템플릿 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <article className="page-list pageWrite content">
        <div className="content-header flex justify-between items-center p-6">
          <h2 className="text-[30px] font-semibold">새 템플릿 만들기</h2>
          <button
            onClick={handleSaveTemplate}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
          >
            {isSubmitting ? "저장 중..." : "템플릿 저장"}
          </button>
        </div>
        <article className="page-list !-5mt !border-none w-full">
          <div className="content-header">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-2xl p-2 hover:bg-gray-100 rounded-full"
                >
                  {title.match(/^\p{Emoji}/u)?.[0] || "🫥"}
                </button>
                {showEmojiPicker && (
                  <div className="absolute left-0 top-12 z-50">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <input
                className="text-[30px] text-gray-500 !border-none focus:outline-none flex-1"
                placeholder="템플릿 제��을 입력하세요"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
          </div>
          <div
            id="editorjs"
            className="editorSection min-h-[800px] !h-[auto] !mt-14"
          ></div>
        </article>
      </article>
    </div>
  );
};

export default TemplateCreate;
