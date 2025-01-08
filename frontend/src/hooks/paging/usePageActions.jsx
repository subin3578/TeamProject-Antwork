import { useCallback } from "react";
import axiosInstance from "@utils/axiosInstance";
import {
  PAGE_SAVE_URI,
  PAGE_SOFT_DELETE_URI,
  PAGE_RESTORE_URI,
  PAGE_HARD_DELETE_URI,
  PAGE_LIST_UID_URI,
} from "../../api/_URI";

export const usePageActions = () => {
  // 페이지 저장
  const savePage = useCallback(async (pageData) => {
    try {
      await axiosInstance.post(PAGE_SAVE_URI, pageData);
    } catch (error) {
      console.error("Error saving page:", error);
      throw error;
    }
  }, []);

  // 페이지 소프트 삭제 후 페이지 반영
  const handleDeletePage = async (
    pageId,
    {
      personalPageList,
      setPersonalPageList,
      latestPages,
      setLatestPages,
      deletedPages,
      setDeletedPages,
    }
  ) => {
    if (!pageId) return;

    if (window.confirm("정말로 이 페이지를 삭제하시겠습니까?")) {
      try {
        const response = await axiosInstance.delete(
          PAGE_SOFT_DELETE_URI.replace(":id", pageId)
        );

        if (response.status === 200) {
          alert("페이지가 삭제되었습니다.");

          const deletedPage =
            personalPageList?.find((page) => page._id === pageId) ||
            latestPages?.find((page) => page._id === pageId);

          setPersonalPageList?.((prev) =>
            prev.filter((page) => page._id !== pageId)
          );
          setLatestPages?.((prev) =>
            prev.filter((page) => page._id !== pageId)
          );

          if (deletedPage && setDeletedPages) {
            setDeletedPages((prev) => [deletedPage, ...prev]);
          }
        } else {
          alert("페이지 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting page:", error);
        alert("페이지 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 페이지 복구
  const handleRestorePage = async (
    pageId,
    uid,
    { setDeletedPages, setPersonalPageList, setLatestPages }
  ) => {
    if (!pageId) return;

    if (window.confirm("페이지를 복구하시겠습니까?")) {
      try {
        await axiosInstance.put(PAGE_RESTORE_URI.replace(":id", pageId));
        setDeletedPages((prev) => prev.filter((page) => page._id !== pageId));

        // 목록 다시 불러오기
        const [personalResponse, latestResponse] = await Promise.all([
          axiosInstance.get(`${PAGE_LIST_UID_URI}/${uid}`),
        ]);

        setPersonalPageList(personalResponse.data);

        alert("페이지가 복구되었습니다.");
      } catch (error) {
        console.error("Error restoring page:", error);
        alert("페이지 복구 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSoftDeletePage = async (pageId) => {
    try {
      console.log("Attempting to delete page with ID:", pageId);
      await axiosInstance.delete(PAGE_SOFT_DELETE_URI.replace(":id", pageId));
    } catch (error) {
      console.error("Error soft deleting page:", error);
    }
  };

  // 페이지 영구 삭제
  const handleHardDeletePage = async (pageId, uid, { setDeletedPages }) => {
    if (!pageId) return false;

    if (
      window.confirm(
        "이 페이지를 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        await axiosInstance.delete(PAGE_HARD_DELETE_URI.replace(":id", pageId));

        // 현재 목록에서 삭제된 페이지만 필터링
        setDeletedPages((prev) => prev.filter((page) => page._id !== pageId));

        alert("페이지가 영구적으로 삭제되었습니다.");
        return true;
      } catch (error) {
        console.error("Error permanently deleting page:", error);
        alert("페이지 영구 삭제 중 오류가 발생했습니다.");
        return false;
      }
    }
    return false;
  };

  return {
    savePage,
    handleDeletePage,
    handleRestorePage,
    handleHardDeletePage,
    handleSoftDeletePage,
  };
};
