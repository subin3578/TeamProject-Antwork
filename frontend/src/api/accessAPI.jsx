import axiosInstance from "@/utils/axiosInstance";
import { ACCESS_SELECT_URI, ACCESS_USERLOG_URI } from "./_URI";

// Logs 데이터를 가져오는 함수
export const fetchAccessLogs = async (searchTerm, currentPage, pageSize) => {
  try {
    const response = await axiosInstance.get(`${ACCESS_SELECT_URI}`, {
      params: {
        search: searchTerm,
        page: currentPage,
        size: pageSize,
      },
    });
    return response.data; // 데이터를 반환
  } catch (error) {
    console.error("Error fetching access logs:", error);

    if (error.response) {
      const errorMessage = error.response.data?.message || "서버 요청 실패";
      throw new Error(errorMessage);
    }

    throw new Error("네트워크 에러 또는 서버와의 연결 실패");
  }
};

// Logs 데이터를 가져오는 함수
export const userLogs = async (userId) => {
  try {
    const response = await axiosInstance.get(`${ACCESS_USERLOG_URI}/${userId}`);
    return response.data; // 데이터를 반환
  } catch (error) {
    console.error("Error fetching access logs:", error);

    if (error.response) {
      const errorMessage = error.response.data?.message || "서버 요청 실패";
      throw new Error(errorMessage);
    }

    throw new Error("네트워크 에러 또는 서버와의 연결 실패");
  }
};
