import axios from "axios";
import {
  DRIVE_ALL_SIZE,
  DRIVE_COLLABORATOR_DELETE,
  DRIVE_COLLABORATOR_INSERT,
  DRIVE_COLLABORATOR_SELECT,
  DRIVE_FILES_INSERT_URI,
  DRIVE_FOLDER_FILE_INSERT_URI,
  DRIVE_FOLDER_INSERT_URI,
  DRIVE_FOLDER_NAME,
  DRIVE_FOLDER_TRASH,
  DRIVE_IS_STARED,
  DRIVE_MOVE_TO_FOLDER,
  MY_DRIVE_FILE_DOWNLOAD,
  MY_DRIVE_SELECT_URI,
  MY_DRIVE_URI,
  MY_TRASH_SELECT_URI,
  MY_TRASH_URI,
  ONE_DRIVE_FOLDER_TRASH,
  SHARE_DRIVE_SELECT_URI,
  SHARE_DRIVE_URI,
  TRASH_FOLDER_DRIVE,
} from "./_URI";
import axiosInstance from "@/utils/axiosInstance";

//드라이브 폴더 등록
export const driveFolderInsert = async (data) => {
  try {
    const response = await axiosInstance.post(
      `${DRIVE_FOLDER_INSERT_URI}`,
      data
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

//드라이브 폴더 등록
export const driveFolderNewNameUpDate = async (data) => {
  try {
    const response = await axiosInstance.post(`${DRIVE_FOLDER_NAME}`, data);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

//드라이브 휴지통 보내기
export const driveFolderTrashUpDate = async (
  driveFolderNameId,
  selectedDriveFileId
) => {
  try {
    const response = await axiosInstance.get(
      `${ONE_DRIVE_FOLDER_TRASH}/${driveFolderNameId || "null"}/${
        selectedDriveFileId || "0"
      }`
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// //드라이브 이름 바꾸기(폴더찾기)
// export const driveFolderFind = async (driveFolderNameId) => {
//   try {
//     const response = await axios.get(`${DRIVE_FOLDER_FIND}/${driveFolderNameId}`);
//     console.log("마이 드라이브 선택보기:", response.data);
//     return response;
//   } catch (error) {
//     console.error("Error verifying email:", error);
//     throw error; // 예외를 호출한 쪽으로 전달
//   }
// };

//드라이브 파일 등록
export const driveFilesInsert = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${DRIVE_FILES_INSERT_URI}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

//드라이브 폴더 등록
export const driveFolderFileInsert = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${DRIVE_FOLDER_FILE_INSERT_URI}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const driveFileDownload = async (driveFileId) => {
  try {
    const response = await axiosInstance.get(`${MY_DRIVE_FILE_DOWNLOAD}`, {
      params: { driveFileId }, //id전달
      responseType: "blob", // 바이너리 데이터로 응답 받음
    });

    console.log("파일 다운로드 응답:", response);
    return response;
  } catch (error) {
    console.error("파일 다운로드 중 오류 발생:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

//마이 드라이브 전체보기
export const MyDriveView = async (uid) => {
  try {
    const response = await axiosInstance.get(`${MY_DRIVE_URI}/${uid}`);
    console.log("내 드라이브 전체보기기:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

// 마이 드라이브 선택보기
export const MyDriveSelectView = async (driveFolderId, uid) => {
  try {
    const response = await axiosInstance.get(
      `${MY_DRIVE_SELECT_URI}/${driveFolderId}/${uid}`
    );
    console.log("마이 드라이브 선택보기:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

//마이 휴지통 전체보기
export const MyTrashView = async (uid) => {
  try {
    const response = await axiosInstance.get(`${MY_TRASH_URI}/${uid}`);
    console.log("내 휴지통 전체보기기:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

// 마이 드라이브 선택보기
export const MyTrashSelectView = async (driveFolderId) => {
  try {
    const response = await axiosInstance.get(
      `${MY_TRASH_SELECT_URI}/${driveFolderId}`
    );
    console.log("마이 드라이브 선택보기:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

//휴지통복원하기
export const ToMyDrive = async (driveFolderId, selectedDriveFileIds) => {
  try {
    console.log("오에에에엥? : " + driveFolderId, selectedDriveFileIds);
    const response = await axiosInstance.post(`${TRASH_FOLDER_DRIVE}`, {
      driveFolderId: driveFolderId || [],
      selectedDriveFileIds: selectedDriveFileIds || [],
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

//휴지통으로
export const ToMyTrash = async (driveFolderId, selectedDriveFileIds) => {
  try {
    console.log("오에에에엥? : " + driveFolderId, selectedDriveFileIds);
    const response = await axiosInstance.post(`${DRIVE_FOLDER_TRASH}`, {
      driveFolderId: driveFolderId || [],
      selectedDriveFileIds: selectedDriveFileIds || [],
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 폴더별 협업자 조회
export const selectDriveCollaborators = async (driveFolderNameId) => {
  console.log("백엔드로 들어오는 협업자조회 projectId :" + driveFolderNameId);
  try {
    const response = await axiosInstance.get(
      `${DRIVE_COLLABORATOR_SELECT}/${driveFolderNameId}`
    );

    console.log("백엔드에서 나온 response.data : " + response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching project collaborators:", error);
    throw error;
  }
};

// 폴더별 협업자 초대
export const addDriveCollaborators = async (driveFolderNameId, userIds) => {
  console.log(
    "백엔드로 가는 projectId, userIds : " + driveFolderNameId,
    userIds
  );

  try {
    const response = await axiosInstance.post(
      `${DRIVE_COLLABORATOR_INSERT}/${driveFolderNameId}`,
      userIds
    );

    console.log("response.data : " + response.data);

    return response.data;
  } catch (error) {
    console.error("협업자 추가 실패:", error);
    throw error;
  }
};

// 폴더별 협업자 삭제
export const removeDriveCollaborator = async (driveFolderNameId, userId) => {
  console.log(
    "백엔드로 가는 협업자 삭제 projectId, userId : " + driveFolderNameId,
    userId
  );
  try {
    const response = await axiosInstance.delete(
      `${DRIVE_COLLABORATOR_DELETE}/${driveFolderNameId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing collaborator:", error);
    throw error;
  }
};

//공유 드라이브 전체보기
export const ShareDriveView = async (userId, uid) => {
  try {
    const response = await axiosInstance.get(
      `${SHARE_DRIVE_URI}/${userId}/${uid}`
    );
    console.log("API의 공유드라이브:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

//공유 드라이브 선택보기
export const ShareDriveSelectView = async (driveFolderId, uid) => {
  try {
    const response = await axiosInstance.get(
      `${SHARE_DRIVE_SELECT_URI}/${driveFolderId}/${uid}`
    );
    console.log("마이 드라이브 선택보기:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

//드라이브 총용량구하기기
export const selectDriveAllSize = async (uid,rate) => {
  try {
    const response = await axiosInstance.get(`${DRIVE_ALL_SIZE}/${uid}/${rate}`);
    console.log("드라이브 총용량량:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};
//즐겨찾기 추가
export const driveIsStared = async ({ driveFolderId, userId, driveFileId }) => {
  try {
    console.log("오에에에엥? : " + driveFolderId, userId);
    const response = await axiosInstance.post(`${DRIVE_IS_STARED}`, {
      driveFolderId: driveFolderId,
      userId: userId,
      driveFileId: driveFileId,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
//폴더이동동
export const MoveToFolder = async ({
  driveFolderId,
  selectDriveFolderId,
  uid,
  driveFileId,
}) => {
  //이동 될 폴더
  //이동 할 폴더더
  try {
    console.log("오에에에엥? : " + driveFolderId, selectDriveFolderId);
    const response = await axiosInstance.post(`${DRIVE_MOVE_TO_FOLDER}`, {
      driveFolderId: driveFolderId,
      selectDriveFolderId: selectDriveFolderId,
      userId: uid,
      driveFileId: driveFileId,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
