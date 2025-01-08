// import { create } from "zustand";

// const useDriveStore = create((set) => ({
//   usedSpace: 0, // 현재 사용량
//   totalSpace: 0, // 총 용량
//   updateDriveUsage: async (fetchDriveUsage) => {
//     try {
//       const response = await fetchDriveUsage();
//       set({
//         usedSpace: response.data.driveFileSize, // 서버에서 받은 사용량
//         totalSpace: response.data.driveFileLimitSize, // 서버에서 받은 총 용량
//       });
//     } catch (error) {
//       console.error("용량 갱신 중 오류:", error);
//     }
//   },
// }));

// export default useDriveStore;
