import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  type: null,
  props: {},
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Opens a modal with the specified type and properties.
   * @param {string} type - The type of the modal to be opened.
   * @param {Object} [props={}] - Optional properties to be passed to the modal.
   */

  /******  6179ce34-0cbe-43c9-a768-a61687bd8f7c  *******/ openModal: (
    type,
    props = {}
  ) => set({ isOpen: true, type, props: { ...props } }),
  closeModal: () => set({ isOpen: false, type: null, props: {} }),
  updateProps: (updatedProps) =>
    set((state) => ({
      props: { ...state.props, ...updatedProps }, // 새로운 객체 생성
    })),
}));

export default useModalStore;
