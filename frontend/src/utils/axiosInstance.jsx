import axios from "axios";
import useAuthStore from "./../store/AuthStore";
import { refreshAccessToken } from "../api/userAPI"; // 토큰 갱신 API

const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_SERVER_HOST,
  timeout: 20000, // 요청 타임아웃 설정
  withCredentials: true, // 쿠키 포함 요청
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    const userId = useAuthStore.getState().userId; // Zustand에서 userId 가져오기
    if (token) {
      console.log("Access Token 포함:", token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (userId) {
      console.log("User ID 포함:", userId);
      config.headers.userId = userId; // userId를 추가
    }
    return config;
  },
  (error) => {
    console.error("요청 인터셉터 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 재시도를 방지
      try {
        console.log("401 Unauthorized 발생. 리프레시 토큰 사용.");
        const newAccessToken = await refreshAccessToken();

        console.log("새로운 Access Token:", newAccessToken);

        // Zustand 스토어에 새 토큰 저장
        useAuthStore.getState().setAccessToken(newAccessToken);

        // 갱신된 토큰으로 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // 요청 재시도
      } catch (refreshError) {
        console.error("리프레시 토큰 갱신 실패:", refreshError);

        // 새 토큰 갱신 실패 시 Zustand 스토어에서 토큰 초기화
        useAuthStore.getState().clearAccessToken();

        throw refreshError;
      }
    }

    console.error("응답 인터셉터 오류:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
