import React, { useState, useEffect } from "react";
import { getTemplates } from "../../../api/pageAPI";
import useAuthStore from "@/store/AuthStore";
import { TemplateCard } from "./TemplateCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { PAGE_CREATE_URI, PAGE_HARD_DELETE_URI } from "../../../api/_URI";

export default function PagingTemplate() {
  const user = useAuthStore((state) => state.user);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllFreeTemplates, setShowAllFreeTemplates] = useState(false);
  const [showAllMyTemplates, setShowAllMyTemplates] = useState(false);
  const [menuActive, setMenuActive] = useState(null);
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      const response = await getTemplates();
      setTemplates(response);
    } catch (error) {
      console.error("템플릿 목록을 가져오는 중 오류 발생:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateClick = async (template) => {
    try {
      // 새 페이지 생성 요청 (템플릿의 title과 content만 사용)
      const response = await axiosInstance.post(PAGE_CREATE_URI, {
        title: template.title,
        content: template.content,
        owner: user.uid,
        ownerName: user.name,
        ownerImage: user.profile,
      });

      // 생성된 페이지의 ID로 페이지 작성 화면으로 이동
      const newPageId = response.data;
      console.log(newPageId);
      navigate(`/antwork/page/write?id=${newPageId}`);
    } catch (error) {
      alert("페이지 생성에 실패했습니다.");
    }
  };

  // 템플릿 삭제 핸들러
  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm("템플릿을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(
          PAGE_HARD_DELETE_URI.replace(":id", templateId)
        );
        navigate("/antwork/page/template");
        alert("템플릿이 삭제되었습니다.");
      } catch (error) {
        console.error("템플릿 삭제 중 오류 발생:", error);
        alert("템플릿 삭제에 실패했습니다.");
      }
    }
  };

  // 템플릿 수정 페이지로 이동
  const handleEditTemplate = (templateId) => {
    setMenuActive(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuActive(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  // 내 템플릿과 무료 템플릿 분리
  const myTemplates = templates.filter(
    (template) => template.owner === user.uid
  );
  const freeTemplates = templates.filter(
    (template) => template.owner !== user.uid
  );

  // 표시할 템플릿 개수 제한
  const displayedMyTemplates = showAllMyTemplates
    ? myTemplates
    : myTemplates.slice(0, 6);
  const displayedFreeTemplates = showAllFreeTemplates
    ? freeTemplates
    : freeTemplates.slice(0, 6);

  return (
    <article className="page-list">
      <div className="content-header">
        <div className="max-w-9xl mx-auto ">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[30px] font-semibold">Template</h2>
              <p className="text-gray-600 mt-2">
                페이지에서 사용할 수 있는 템플릿입니다.
              </p>
            </div>
            <button
              onClick={() => navigate("/antwork/page/template/create")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              템플릿 생성
            </button>
          </div>
        </div>
      </div>

      {/* 내가 만든 템플릿 섹션 */}
      {myTemplates.length > 0 && (
        <article className="page-list !mt-5 !min-h-[200px]">
          <div className="content-header">
            <div className="!inline-flex">
              <h1 className="!text-[19px]">내가 만든 템플릿</h1>
              {myTemplates.length > 6 && !showAllMyTemplates && (
                <button
                  onClick={() => setShowAllMyTemplates(true)}
                  className="!ml-3 text-gray-500"
                >
                  더보기 ({myTemplates.length - 6}개)
                </button>
              )}
            </div>
          </div>
          <div className="page-grid">
            {displayedMyTemplates.map((template) => (
              <TemplateCard
                key={template._id}
                page={template}
                menuActive={menuActive}
                setMenuActive={setMenuActive}
                menuOptions={
                  <div className="absolute right-0 mt-2 p-4 !pb-0 w-[200px] h-[125px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="border-t border-gray-300 border-b border-gray-300 p-3">
                        <button
                          onClick={() => handleEditTemplate(template._id)}
                          className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 hover:rounded-[10px] text-left"
                        >
                          템플릿 수정
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template._id)}
                          className="w-full px-4 py-3 text-[14px] text-red-600 hover:bg-gray-100 hover:rounded-[10px] text-left"
                        >
                          템플릿 삭제
                        </button>
                      </div>
                    </div>
                  </div>
                }
                hideAuthor={true}
              />
            ))}
          </div>
        </article>
      )}

      {/* 무료 템플릿 섹션 */}
      <article className="page-list !mt-5 !min-h-[200px]">
        <div className="content-header">
          <div className="!inline-flex">
            <h1 className="!text-[19px]">무료 템플릿</h1>
            {freeTemplates.length > 6 && !showAllFreeTemplates && (
              <button
                onClick={() => setShowAllFreeTemplates(true)}
                className="!ml-3 text-gray-500"
              >
                더보기 ({freeTemplates.length - 6}개)
              </button>
            )}
          </div>
        </div>
        <div className="page-grid">
          {displayedFreeTemplates.map((template) => (
            <TemplateCard
              key={template._id}
              page={template}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </div>
      </article>
    </article>
  );
}
