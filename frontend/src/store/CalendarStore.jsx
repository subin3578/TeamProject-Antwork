import { create } from "zustand";

export const useCalendarStore = create((set) => ({
  selectedIds: [],
  toggleCheckbox: (calendarId) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(calendarId)
        ? state.selectedIds.filter((id) => id !== calendarId) // 체크 해제
        : [...state.selectedIds, calendarId], // 체크
    })),
  isModalOpen: false, // 모달의 상태 (열림/닫힘)
  openModal: () => set({ isModalOpen: true }), // 모달 열기
  closeModal: () => set({ isModalOpen: false }), // 모달 닫기
}));
