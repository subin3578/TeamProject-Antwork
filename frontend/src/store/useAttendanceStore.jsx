import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  checkInAPI,
  checkOutAPI,
  getAttendanceStatusAPI,
  updateStatusAPI,
} from "./../api/attendanceAPI";

const useAttendanceStore = create(
  persist(
    (set, get) => ({
      userId: null,
      status: "AVAILABLE",
      checkInTime: null,
      checkOutTime: null,
      isLoading: false,
      error: null,

      // 사용자 상태 초기화 및 동기화
      initializeForUser: async (userId) => {
        if (!userId) throw new Error("User ID가 필요합니다.");
        set({ isLoading: true, error: null });

        try {
          const data = await getAttendanceStatusAPI(userId); // 서버에서 상태 가져오기
          set({
            userId,
            status: data.status || "AVAILABLE", // 기본 상태 처리
            checkInTime: data.checkInTime || null,
            checkOutTime: data.checkOutTime || null,
            isLoading: false,
          });
        } catch (error) {
          console.error("사용자 상태 초기화 실패:", error);
          set({
            userId,
            status: "AVAILABLE", // 기본 상태 처리
            checkInTime: null,
            checkOutTime: null,
            error: "상태 초기화 실패",
            isLoading: false,
          });
        }
      },

      // 사용자 로그인 시 초기화
      login: (userId) => {
        if (!userId) throw new Error("User ID가 필요합니다.");
        set({
          userId,
          status: "AVAILABLE",
          checkInTime: null,
          checkOutTime: null,
          isLoading: false,
          error: null,
        });
      },

      // 출근 처리
      checkIn: async (userId) => {
        try {
          if (!userId) throw new Error("User ID가 필요합니다.");
          set({ isLoading: true, error: null });

          const data = await checkInAPI(userId); // API 호출
          if (!data) {
            throw new Error("API 응답이 유효하지 않습니다.");
          }

          set({
            status: "CHECKED_IN",
            checkInTime: data.checkInTime, // JSON 데이터의 checkInTime 사용
            error: null,
          });

          return data.checkInTime; // 반환값 추가
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "출근 처리 중 오류 발생";
          console.error("출근 처리 실패:", errorMessage);
          set({ error: errorMessage });
          throw error; // 에러를 상위로 전달
        } finally {
          set({ isLoading: false });
        }
      },

      // 퇴근 처리
      checkOut: async (userId) => {
        try {
          if (!userId) throw new Error("User ID가 필요합니다.");
          set({ isLoading: true, error: null });

          const data = await checkOutAPI(userId); // API 호출
          if (!data || !data.checkOutTime) {
            throw new Error("API 응답이 유효하지 않습니다.");
          }

          set({
            status: "CHECKED_OUT",
            checkOutTime: data.checkOutTime, // API 응답 데이터 사용
            error: null,
          });

          return data.checkOutTime; // 반환값 추가
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "퇴근 처리 중 오류 발생";
          console.error("퇴근 처리 실패:", errorMessage);
          set({ error: errorMessage });
          throw error; // 에러를 상위로 전달
        } finally {
          set({ isLoading: false });
        }
      },

      // 상태 업데이트
      updateStatus: async (userId, newStatus) => {
        try {
          if (!userId || !newStatus) {
            throw new Error("User ID와 상태 값이 필요합니다.");
          }
          set({ isLoading: true, error: null });
          await updateStatusAPI(userId, newStatus);
          set({ status: newStatus, error: null });
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "상태 업데이트 중 오류 발생";
          console.error("상태 업데이트 실패:", errorMessage);
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },

      // 상태 초기화
      resetAttendance: () =>
        set({
          userId: null,
          status: "AVAILABLE",
          checkInTime: null,
          checkOutTime: null,
          isLoading: false,
          error: null,
        }),

      // 현재 상태 및 시간 정보 반환
      getAttendanceInfo: () => {
        const { status, checkInTime, checkOutTime } = get();
        return { status, checkInTime, checkOutTime };
      },
    }),
    {
      name: (set, get) => `attendance-store-${get().userId || "guest"}`, // 사용자별 저장소 키
      partialize: (state) => ({
        status: state.status,
        checkInTime: state.checkInTime,
        checkOutTime: state.checkOutTime,
      }),
    }
  )
);

export default useAttendanceStore;
