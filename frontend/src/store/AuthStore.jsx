import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeToken } from "./../utils/decodeToken";
import { refreshAccessToken } from "../api/userAPI";

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,

      // Access Token 설정
      setAccessToken: (token) => {
        if (!token || typeof token !== "string") {
          console.error("유효하지 않은 Access Token입니다:", token);
          return;
        }
        const user = decodeToken(token);
        if (user) {
          set({ accessToken: token, user });
        } else {
          console.error("Access Token 디코딩 실패:", token);
        }
      },

      // Access Token 초기화
      clearAccessToken: () => set({ accessToken: null, user: null }),

      // 새로고침 시 Access Token 갱신
      initializeAuth: async () => {
        try {
          console.log("Initializing Auth...");
          const currentAccessToken = get().accessToken;

          // 이미 저장된 Access Token이 있다면 상태 복구
          if (currentAccessToken) {
            const user = decodeToken(currentAccessToken);
            if (user) {
              console.log("Stored Access Token found. User:", user);
              set({ user });
              return;
            }
          }

          // Access Token이 없거나 유효하지 않으면 갱신
          const newAccessToken = await refreshAccessToken();
          console.log("토큰 갱신:", newAccessToken);
          if (newAccessToken) {
            const user = decodeToken(newAccessToken);
            set({ accessToken: newAccessToken, user });
            console.log("User Updated:", user);
          }
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          set({ accessToken: null, user: null });
        }
      },
    }),
    {
      name: "auth-store", // 저장될 localStorage 키 이름
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }), // 저장할 상태 선택
    }
  )
);

export default useAuthStore;
