import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PAGE_LIST_UID_URI, PAGE_LIST_DELETED_URI } from "../../../api/_URI";

import { usePageList } from "../../../hooks/paging/usePageList";
import { usePageActions } from "../../../hooks/paging/usePageActions";
import { PageCard } from "./PageCard";
import useAuthStore from "@/store/AuthStore";
import PageCollaboratorModal from "../../common/modal/pageCollaboratorModal";
import useModalStore from "../../../store/modalStore";
import { getSharedPages } from "../../../api/pageAPI";

// prettier-ignore
export default function PagingSection() {

  // 유저 정보 불러오기
  const user = useAuthStore((state) => state.user);
  const uid = user?.uid;

  // 개인 페이지 목록 불러오기
  const { pages: personalPageList, setPages: setPersonalPageList }
        = usePageList(`${PAGE_LIST_UID_URI}/${uid}`);
  // 삭제된 페이지 목록 불러오기
  const { pages: deletedPages, setPages: setDeletedPages } 
        = usePageList(`${PAGE_LIST_DELETED_URI}/${uid}`);

  // 지 메뉴 상태 관리
  const [personalActiveMenu, setPersonalActiveMenu] = useState(null);
  const [deletedActiveMenu, setDeletedActiveMenu] = useState(null);

  // 페이지 삭제, 복구, 영구 삭제 기능 
  const { handleDeletePage, handleRestorePage, handleHardDeletePage } = usePageActions();

  const openModal = useModalStore((state) => state.openModal);
  const { isOpen, type } = useModalStore();

  const [sharedPages, setSharedPages] = useState([]);
  const [showAllShared, setShowAllShared] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setPersonalActiveMenu(null);
        setDeletedActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen && type === "page-collaborator") {
      // 모달이 닫힐 때 selectedPageId를 초기화하지 않음
      // setSelectedPageId(null);  // 이 부분을 제거하거나 주석 처리
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (uid) {
      // 공유 페이지 가져오기
      const fetchSharedPages = async () => {
        try {
          const response = await getSharedPages(uid);
          setSharedPages(response);
        } catch (error) {
          console.error("공유 페이지 목록을 가져오는데 실패했습니다:", error);
        }
      };

      fetchSharedPages();
    }
  }, [uid]);

  const [showAllPersonal, setShowAllPersonal] = useState(false);
  const [showAllDeleted, setShowAllDeleted] = useState(false);

  // 개인 페이지 섹션 수정
  const displayedPersonalPages = showAllPersonal
    ? personalPageList
    : personalPageList.slice(0, 6);

  // 삭제된 페이지 섹션 수정
  const displayedDeletedPages = showAllDeleted
    ? deletedPages
    : deletedPages.slice(0, 3);

  // 페이지 ID 상태 추가
  const [selectedPageId, setSelectedPageId] = useState(null);

  // 공유 멤버 관리 버튼 클릭 핸들러
  const handleCollaboratorModal = (pageId) => {
    setSelectedPageId(pageId);
    openModal("page-collaborator");
    setPersonalActiveMenu(null);
  };

  // 표시할 공유 페이지 개수 제한
  const displayedSharedPages = showAllShared ? sharedPages : sharedPages.slice(0, 3);

  const [recentPages, setRecentPages] = useState([]);

  useEffect(() => {
    const fetchRecentPages = () => {
      // 개인 페이지와 공유 페이지를 합��서 정렬
      const allPages = [...personalPageList, ...sharedPages];

      // updatedAt 기준으로 정렬
      const sortedPages = allPages.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // 가장 최근 수정된 3개 페이지만 선택
      setRecentPages(sortedPages.slice(0, 3));
    };

    fetchRecentPages();
  }, [personalPageList, sharedPages]);

  return (
    <>
      <article className="page-list">
        <div className="content-header">
          <h1>Home</h1>
          <p> 페이지 Home 입니다.</p>

          <article className="page-list !mt-5 !min-h-[200px]">
            <div className="content-header">
              <div className="!inline-flex">
                <h1 className="!text-[19px]"> 나의 페이지</h1>
                {personalPageList.length > 3 && !showAllPersonal && (
                  <button
                    onClick={() => setShowAllPersonal(true)}
                    className="!ml-3 text-gray-500"
                  >
                    더보기 ({personalPageList.length - 3}개)
                  </button>
                )}
              </div>
              <p className="!text-[14px]">내가 만든 페이지 입니다.</p>
            </div>

            <div className="page-grid">
              {displayedPersonalPages.map((page) => (
                <PageCard
                  key={page._id}
                  page={page}
                  menuActive={personalActiveMenu}
                  setMenuActive={setPersonalActiveMenu}
                  menuOptions={
                    <div className="absolute right-0 mt-2 p-4 !pb-0 w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="border-t border-gray-300 border-b border-gray-300 p-3">
                          <button
                            onClick={() =>
                              handleDeletePage(page._id, {
                                personalPageList,
                                setPersonalPageList,
                                deletedPages,
                                setDeletedPages,
                              })
                            }
                            className="w-full px-4 py-3 text-[14px] text-red-600 hover:bg-gray-100 hover:rounded-[10px] text-left"
                          >
                            페이지 삭제
                          </button>
                          <button 
                            onClick={() => handleCollaboratorModal(page._id)}
                            className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 hover:rounded-[10px] text-left bt-black-200"
                          >
                            공유 멤버 관리
                          </button>
                        </div>
                        <div className="p-3">
                          <button className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 hover:rounded-[10px] text-left">
                            페이지 설정
                            <p className="!text-[11px] !text-slate-400 mt-[2px]">
                              &nbsp;설정페이지로 이동
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          </article>
          <article className="page-list !mt-5 !min-h-[200px]">
            <div className="content-header">
              <div className="!inline-flex">
                <h1 className="!text-[19px]"> 공유 페이지</h1>
                {sharedPages.length > 3 && !showAllShared && (
                  <button
                    onClick={() => setShowAllShared(true)}
                    className="!ml-3 text-gray-500"
                  >
                    더보기 ({sharedPages.length - 3}개)
                  </button>
                )}
              </div>
              <p className="!text-[14px]">내가 공유 멤버인 페이지 입니다.</p>
            </div>
            <div className="page-grid">
              {displayedSharedPages.map((page) => (
                <PageCard
                  key={page._id}
                  page={page}
                  menuActive={personalActiveMenu}
                  setMenuActive={setPersonalActiveMenu}
                  menuOptions={
                    <div className="absolute right-0 mt-2 p-4 !pb-0 w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="border-t border-gray-300 border-b border-gray-300 p-3">
                          <button 
                            onClick={() => handleCollaboratorModal(page._id)}
                            className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 hover:rounded-[10px] text-left bt-black-200"
                          >
                            공유 멤버 관리
                          </button>
                        </div>
                        <div className="p-3">
                          <button className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 hover:rounded-[10px] text-left">
                            페이지 설정
                            <p className="!text-[11px] !text-slate-400 mt-[2px]">
                              &nbsp;설정페이지로 이동
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          </article>

          <article className="page-list !mt-5 !min-h-[200px]">
            <div className="content-header">
              <div className="!inline-flex">
                <h1 className="!text-[19px]"> 최근 삭제된 페이지</h1>
                {deletedPages.length > 3 && !showAllDeleted && (
                  <button
                    onClick={() => setShowAllDeleted(true)}
                    className="!ml-3 text-gray-500"
                  >
                    더보기 ({deletedPages.length - 3}개)
                  </button>
                )}
              </div>
              <p className="!text-[14px]">최근 7일 내 삭제된 목록입니다.</p>
            </div>

            <div className="page-grid">
              {displayedDeletedPages.map((page) => (
                <PageCard
                  key={page._id}
                  page={page}
                  menuActive={deletedActiveMenu}
                  setMenuActive={setDeletedActiveMenu}
                  menuOptions={
                    <div className="absolute right-0 mt-2 p-4 !pb-0 w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="border-t border-gray-300 border-b border-gray-300 p-3 !mb-3">
                          <button
                            onClick={async () => {
                              const success = await handleRestorePage(page._id, uid, {
                                setDeletedPages,
                                setPersonalPageList,
                              });
                              if (success) {
                                setDeletedActiveMenu(null);
                              }
                            }}
                            className="w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-100 hover:rounded-[10px] text-left"
                          >
                            페이지 복구
                          </button>
                          <button
                            onClick={async () => {
                              const success = await handleHardDeletePage(page._id, uid, {
                                setDeletedPages
                              });
                              if (success) {
                                setDeletedActiveMenu(null);
                              }
                            }}
                            className="w-full px-4 py-3 text-[14px] text-red-600 hover:bg-gray-100 hover:rounded-[10px] text-left"
                          >
                            영구 삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          </article>
        </div>
      </article>
      <PageCollaboratorModal 
        pageId={selectedPageId}
        onCollaboratorsUpdate={(collaborators) => {
          console.log("Updated collaborators:", collaborators);
        }}
      />
    </>
  );
}
