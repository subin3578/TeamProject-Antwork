import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "../../../hooks/paging/useEditor";
import useAuthStore from "@/store/AuthStore";
import axiosInstance from "@utils/axiosInstance";
import {
  PAGE_CREATE_URI,
  PAGE_FETCH_URI,
  PAGE_SAVE_URI,
} from "../../../api/_URI";
import EmojiPicker from "emoji-picker-react";

const TemplateView = () => {
  const params = useParams();
  const pageId = params.id;
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const user = useAuthStore((state) => state.user);

  console.log(user);
  // Editor 훅 사용 - readOnly 상태를 isEditable에 따라 결정
  const editor = useEditor(
    () => {},
    editorRef,
    null,
    pageId,
    null,
    !isEditable
  );

  // 에디터 초기화를 위한 별도의 useEffect
  useEffect(() => {
    const initEditor = async () => {
      if (!editorRef.current && template) {
        try {
          console.log("Initializing editor with template:", template);
          const contentData =
            typeof template.content === "string"
              ? JSON.parse(template.content)
              : template.content;

          const newEditor = await editor(contentData);
          editorRef.current = newEditor;
          console.log("Editor initialized successfully");
        } catch (error) {
          console.error("Editor initialization error:", error);
        }
      }
    };

    initEditor();

    return () => {
      if (editorRef.current?.destroy) {
        console.log("Destroying editor instance");
        editorRef.current.destroy();
      }
    };
  }, [template]);

  // 템플릿 데이터 가져오기
  useEffect(() => {
    let isMounted = true;

    const fetchTemplate = async () => {
      try {
        const response = await axiosInstance.get(`${PAGE_FETCH_URI}/${pageId}`);
        const templateData = response.data;

        if (!isMounted) return;
        setTemplate(templateData);
        setTitle(templateData.title);
        // 소유자 체크
        setIsEditable(templateData.owner === user?.uid);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTemplate();

    return () => {
      isMounted = false;
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [pageId, user?.uid]);

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

  // 템플릿 수정 저장 핸들러
  const handleSaveTemplate = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log("Saving template...");

      if (!editorRef.current) {
        throw new Error("에디터가 초기화되지 않았습니다.");
      }

      const savedData = await editorRef.current.save();
      console.log("Editor data saved:", savedData);

      const templateData = {
        _id: pageId,
        title: title || "제목 없는 템플릿",
        content: JSON.stringify(savedData),
        owner: user.uid,
        ownerName: user.name,
        ownerImage: user.profile,
        isTemplate: true,
      };

      console.log("Sending template data to server:", templateData);
      const response = await axiosInstance.post(PAGE_SAVE_URI, templateData);

      if (response.data) {
        console.log("Template saved successfully");
        alert("템플릿이 성공적으로 수정되었습니다.");
        navigate("/antwork/page/template");
      }
    } catch (error) {
      console.error("템플릿 수정 중 오류 발생:", error);
      alert("템플릿 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(PAGE_CREATE_URI, {
        title: template.title,
        content:
          typeof template.content === "string"
            ? template.content
            : JSON.stringify(template.content),
        owner: user?.uid,
        ownerName: user?.name,
        ownerImage: user?.profile,
        isTemplate: false,
        companyRate: user?.companyRate,
      });

      const newPageId = response.data;
      navigate(`/antwork/page/write?id=${newPageId}`);
    } catch (error) {
      console.error("Error creating new page:", error);
      if (error.response && error.response.status === 403) {
        alert(
          "무료 회원은 5개 이상의 페이지를 생성할 수 없습니다.\n임시 삭제된 페이지를 포함하여 5개의 페이지를 허용합니다."
        );
        navigate("/antwork/page/template");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <article className="page-list pageWrite content">
        <div className="content-header flex justify-between items-center p-6">
          <div>
            <h2 className="text-[30px] font-semibold">
              {isEditable ? "템플릿 수정" : "템플릿 미리보기"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isEditable
                ? "템플릿을 수정할 수 있습니다."
                : "이 템플릿을 사용하여 새로운 페이지를 만들 수 있습니다."}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/antwork/page/template")}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              목록으로
            </button>
            {isEditable ? (
              <button
                onClick={handleSaveTemplate}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
              >
                {isLoading ? "저장 중..." : "템플릿 저장"}
              </button>
            ) : (
              <button
                onClick={handleUseTemplate}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
              >
                {isLoading ? "처리 중..." : "이 템플릿 사용하기"}
              </button>
            )}
          </div>
        </div>

        <article className="page-list !mt-5 !border-none w-full">
          <div className="content-header">
            <div className="flex items-center gap-2">
              <div className="relative">
                {isEditable ? (
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-2xl p-2 hover:bg-gray-100 rounded-full"
                  >
                    {title.match(/^\p{Emoji}/u)?.[0] || "🫥"}
                  </button>
                ) : (
                  <button className="text-2xl p-2 hover:bg-gray-100 rounded-full cursor-default">
                    {template?.icon || "🫥"}
                  </button>
                )}
                {showEmojiPicker && (
                  <div className="absolute left-0 top-12 z-50">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              {isEditable ? (
                <input
                  className="text-[30px] text-gray-500 !border-none focus:outline-none flex-1"
                  placeholder="템플릿 제목을 입력하세요"
                  value={title}
                  onChange={handleTitleChange}
                />
              ) : (
                <div className="text-[30px] text-gray-500">
                  {template?.title || "제목 없는 템플릿"}
                </div>
              )}
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

export default TemplateView;
