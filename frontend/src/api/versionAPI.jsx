import axiosInstance from "@/utils/axiosInstance";
import { VERSION_SELECT_URI } from "./_URI";

// 유저 회원가입
export const selectVersion = async () => {
  try {
    const response = await axiosInstance.get(VERSION_SELECT_URI);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
    );
  }
};
