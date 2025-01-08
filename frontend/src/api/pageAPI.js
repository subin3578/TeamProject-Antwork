import axiosInstance from "../utils/axiosInstance";
import {
  PAGE_FETCH_URI,
  PAGE_LIST_TEMPLATE_URI,
  PAGE_CREATE_URI,
} from "./_URI";

// 페이지 협업자 목록 조회
export const getPageCollaborators = async (pageId) => {
  try {
    console.log("Calling API with pageId:", pageId);
    const response = await axiosInstance.get(
      `${PAGE_FETCH_URI}/${pageId}/collaborators`
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch page collaborators:", error);
    throw error;
  }
};

// 페이지 협업자 추가
export const addPageCollaborators = async (pageId, collaborators) => {
  try {
    console.log("Collaborators 추가 :", collaborators);
    const response = await axiosInstance.post(
      `${PAGE_FETCH_URI}/${pageId}/collaborators`,
      {
        collaborators: collaborators.map((user) => ({
          // 새로운 협업자는 id가 0
          pageId: pageId,
          user_id: user.id,
          uidImage: null,
          invitedAt: null,
          isOwner: false,
          type: user.type,
          companyRate: user.companyRate,
        })),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add collaborators:", error);
    throw error;
  }
};
// 페이지 협업자 권한 수정
export const updateCollaboratorPermission = async (
  pageId,
  userId,
  permissionType
) => {
  try {
    const response = await axiosInstance.put(
      `${PAGE_FETCH_URI}/${pageId}/collaborators/${userId}`,
      { type: permissionType }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update collaborator permission:", error);
    throw error;
  }
};
// 페이지 협업자 제거
export const removePageCollaborator = async (pageId, userId) => {
  try {
    const response = await axiosInstance.delete(
      `${PAGE_FETCH_URI}/${pageId}/collaborators/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to remove collaborator:", error);
    throw error;
  }
};

export const getSharedPages = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `${PAGE_FETCH_URI}/shared/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("공유된 페이지 조회 실패:", error);
    throw error;
  }
};

export const getPageDetails = async (pageId) => {
  try {
    const response = await axiosInstance.get(`${PAGE_FETCH_URI}/${pageId}`);
    return response.data; // 페이지 세부정보 반환
  } catch (error) {
    console.error("페이지 세부정보 가져오기 실패:", error);
    throw new Error("페이지 세부정보를 가져오는 데 실패했습니다.");
  }
};

// 템플릿 목록 가져오기
export const getTemplates = async () => {
  try {
    console.log("템플릿 요청 URL:", PAGE_LIST_TEMPLATE_URI); // URL 확인용
    const response = await axiosInstance.get(PAGE_LIST_TEMPLATE_URI);
    console.log("템플릿 응답:", response); // 응답 확인용
    return response.data;
  } catch (error) {
    console.error(
      "템플릿 목록을 가져오는 중 오류 발생:",
      error.response || error
    );
    if (error.response?.status === 405) {
      console.error(
        "서버에서 GET 메소드를 허용하지 않습니다. API 엔드포인트를 확인해주세요."
      );
    }
    throw error;
  }
};

// 협업자 권한 업데이트
