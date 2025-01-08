import {
  PROJECT_ADD_URI,
  PROJECT_LIST_URI,
  PROJECT_DETAIL_URI,
  PROJECT_STATE_INSERT_URI,
  PROJECT_STATE_SELECT_URI,
  PROJECT_TASK_INSERT_URI,
  PROJECT_TASK_SELECT_URI,
  PROJECT_TASK_UPDATE_URI,
  PROJECT_TASK_DELETE_URI,
  PROJECT_TASK_UPDATE_POSITION_URI,
  PROJECT_STATE_UPDATE_URI,
  PROJECT_STATE_DELETE_URI,
  PROJECT_UPDATE_URI,
  PROJECT_COLLABORATOR_INSERT_URI,
  PROJECT_COLLABORATOR_SELECT_URI,
  PROJECT_COLLABORATOR_DELETE_URI,
  PROJECT_DELETE_URI,
  PROJECT_STATUS_UPDATE_URI,
  PROJECT_COUNT_USER_SELECT_URI,
  PROJECT_COLLABORATOR_SELECT_COUNT_URI,
  PROJECT_TASK_ATTRIBUTE_INSERT_URI,
  PROJECT_TASK_ATTRIBUTE_SELECT_URI,
  PROJECT_TASK_ATTRIBUTE_UPDATE_URI,
  PROJECT_TASK_ATTRIBUTE_DELETE_URI,
} from "./_URI";
import axiosInstance from "@/utils/axiosInstance";

// 프로젝트 등록
export const postProject = async (project, uid) => {
  try {
    const projectWithUid = { ...project, uid }; // 프로젝트 객체에 uid 추가
    const response = await axiosInstance.post(PROJECT_ADD_URI, projectWithUid, {
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
    });

    return response.data; // 서버 응답 데이터 반환
  } catch (error) {
    // 에러가 발생하면 상세 오류 처리
    if (error.response) {
      // 서버에서 반환된 오류 응답 처리
      console.error("Error response:", error.response);
      // 여기서 반환된 에러 메시지로 알림을 표시
      if (error.response.status === 403) {
        alert(`프로젝트 생성 실패: ${error.response.data}`);
      } else {
        alert("프로젝트 생성 중 다른 문제가 발생했습니다.");
      }
    } else if (error.request) {
      // 서버에 요청은 보냈지만 응답이 없을 때
      console.error("Error request:", error.request);
      alert("서버 응답이 없습니다. 다시 시도해 주세요.");
    } else {
      // 오류가 요청이나 응답에 관련되지 않은 경우
      console.error("Error message:", error.message);
      alert("프로젝트 생성 중 문제가 발생했습니다.");
    }
    throw error; // 예외를 다시 던져서 호출한 곳에서 처리하도록 합니다.
  }
};

// 프로젝트 조회
export const getProjects = async (uid) => {
  try {
    console.log("백으로 가는 uid : " + uid);
    const response = await axiosInstance.get(`${PROJECT_LIST_URI}/${uid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched Projects:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response || error);
    throw error;
  }
};

// 프로젝트id로 상세 조회
export const getProjectById = async (id) => {
  console.log("Project Id로 프로젝트 조회 API");
  try {
    const response = await axiosInstance.get(`${PROJECT_DETAIL_URI}/${id}`, {
      headers: {
        "Content-Type": "application/json", // json 형식으로 보냄
      },
    });
    console.log("response.data:", response.data);
    return response.data; // 프로젝트 데이터 반환
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

// 프로젝트 상태 등록
export const postProjectState = async (stateData) => {
  console.log("프로젝트 상태 등록 API 들어옴");
  console.log("API 요청 데이터:", stateData); // 디버깅용
  try {
    const response = await axiosInstance.post(
      `${PROJECT_STATE_INSERT_URI}`,
      stateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 서버에서 반환된 상태 DTO
  } catch (error) {
    console.error("Error adding project state:", error);
    throw error;
  }
};

// 프로젝트 상태 조회
export const getProjectStates = async (id) => {
  console.log("projectState 조회 API");
  try {
    const response = await axiosInstance.get(
      `${PROJECT_STATE_SELECT_URI}/${id}`
    );
    return response.data; // 서버에서 반환된 전체 상태
  } catch (error) {
    console.error("Error fetching project states:", error);
    throw error;
  }
};

// 프로젝트 작업 생성
export const createTask = async (taskData) => {
  console.log("전달되는 taskData:", taskData); // 디버깅용
  try {
    const response = await axiosInstance.post(
      `${PROJECT_TASK_INSERT_URI}`,
      taskData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("서버 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "작업 생성 중 오류 발생:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 프로젝트 작업 조회
export async function getTasksByStateId(stateId) {
  console.log("프로젝트 작업조회 API 들어옴");
  console.log("stateId : " + stateId);
  const response = await fetch(`${PROJECT_TASK_SELECT_URI}/${stateId}`);
  console.log("프로젝트 작업조회 API 반환되는 값 : " + response);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

// 프로젝트 작업 수정
export const updateTask = async (taskId, updatedTask) => {
  console.log("수정 요청 데이터:", taskId, updatedTask);
  try {
    const response = await axiosInstance.put(
      `${PROJECT_TASK_UPDATE_URI}/${taskId}`,
      updatedTask,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 서버에서 반환된 상태 DTO
  } catch (error) {
    console.error("Error adding project state:", error);
    throw error;
  }
};

// 프로젝트 작업 개별 삭제
export const deleteTask = async (taskId) => {
  console.log("taskId : " + taskId);
  try {
    const response = await axiosInstance.delete(
      `${PROJECT_TASK_DELETE_URI}/${taskId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 삭제 성공 시 반환값 (필요 없으면 생략 가능)
  } catch (error) {
    console.error(
      "Task 삭제 중 오류 발생:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 드래그앤드랍시 작업 위치 update
export const updateTaskPosition = async (taskId, stateId, position) => {
  console.log(
    "백엔드로 들어오는 taskId, newStateId, newPosition : " + taskId,
    stateId,
    position
  );
  return await fetch(`${PROJECT_TASK_UPDATE_POSITION_URI}/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stateId, position }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
};

// 프로젝트 작업상태 수정
export const updateProjectState = async (stateId, updatedState) => {
  console.log(
    "백엔드로 들어오는 stateId, updatedState : " + stateId,
    updatedState
  );
  try {
    const response = await fetch(`${PROJECT_STATE_UPDATE_URI}/${stateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedState),
    });

    if (!response.ok) {
      throw new Error("Failed to update state");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 프로젝트 작업상태 삭제
export const deleteProjectState = async (stateId) => {
  try {
    await axiosInstance.delete(`${PROJECT_STATE_DELETE_URI}/${stateId}`);
  } catch (error) {
    console.error("Error deleting project state:", error);
    throw error;
  }
};

// 프로젝트 수정
export const updateProject = async (projectId, projectData) => {
  console.log(
    "백엔드로 들어오는 projectId, projectData : " + projectId,
    projectData
  );
  try {
    const response = await axiosInstance.put(
      `${PROJECT_UPDATE_URI}/${projectId}`,
      projectData
    );
    console.log("백엔드에서 반환된 데이터 : " + response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error; // 오류를 호출한 곳으로 전달
  }
};

// 프로젝트별 협업자 초대
export const addProjectCollaborators = async (projectId, userIds, id) => {
  console.log("백엔드로 가는 projectId, userIds : " + projectId, userIds, id);

  try {
    const response = await axiosInstance.post(
      `${PROJECT_COLLABORATOR_INSERT_URI}/${projectId}/${id}`,
      userIds
    );

    console.log("response.data : " + response.data);

    return response.data;
  } catch (error) {
    console.error("협업자 추가 실패:", error);
    throw error;
  }
};

// 프로젝트별 협업자 조회
export const getProjectCollaborators = async (projectId) => {
  console.log("백엔드로 들어오는 협업자조회 projectId :" + projectId);
  try {
    const response = await axiosInstance.get(
      `${PROJECT_COLLABORATOR_SELECT_URI}/${projectId}`
    );

    console.log("백엔드에서 나온 response.data : " + response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching project collaborators:", error);
    throw error;
  }
};

// 프로젝트별 협업자 삭제
export const removeProjectCollaborator = async (projectId, userId) => {
  console.log(
    "백엔드로 가는 협업자 삭제 projectId, userId : " + projectId,
    userId
  );
  try {
    const response = await axiosInstance.delete(
      `${PROJECT_COLLABORATOR_DELETE_URI}/${projectId}/${userId}`
    );

    console.log("백엔드에서 나온 삭제 response.data : " + response.data);
    return response.data;
  } catch (error) {
    console.error("Error removing collaborator:", error);
    throw error;
  }
};

// 프로젝트 삭제
export const deleteProject = async (projectId) => {
  console.log("백엔드로 들어오는 projectId : " + projectId);
  try {
    const response = await axiosInstance.delete(
      `${PROJECT_DELETE_URI}/${projectId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 삭제 성공 시 반환값 (필요 없으면 생략 가능)
  } catch (error) {
    console.error(
      "Project 삭제 중 오류 발생:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 프로젝트 상태 수정(진행중/완료)
export const updateProjectStatus = async (projectId, status) => {
  console.log(
    "상태변경 백엔드로 들어오는 projectId, status : " + projectId,
    status
  );

  try {
    const response = await axiosInstance.put(
      `${PROJECT_STATUS_UPDATE_URI}/${projectId}?status=${status}`,
      {}, // 요청 본문은 비워둡니다.
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("백엔드에서 반환된 데이터 : " + response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error; // 오류를 호출한 곳으로 전달
  }
};

// 사용자가 생성한 프로젝트 수를 가져오는 함수
export const getUserProjectCount = async (uid) => {
  try {
    const response = await axiosInstance.get(
      `${PROJECT_COUNT_USER_SELECT_URI}/${uid}`
    );
    console.log("프로젝트 수 백엔드에서 반환된 데이터 : " + response.data);
    return response.data;
  } catch (error) {
    console.error("프로젝트 수를 가져오는 중 오류 발생:", error);
    return 0; // 오류 발생 시 기본값으로 0 반환
  }
};

// 해당 프로젝트의 협업자 수를 가져오는 함수
export const getCurrentCollaboratorCount = async (projectId) => {
  try {
    const response = await axiosInstance.get(
      `${PROJECT_COLLABORATOR_SELECT_COUNT_URI}/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("협업자 수를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 프로젝트 작업 속성 추가 함수
export const addAttribute = async (attribute) => {
  console.log("속성추가 백엔드로 가는 attribute 정보 : " + attribute);

  try {
    const response = await axiosInstance.post(
      `${PROJECT_TASK_ATTRIBUTE_INSERT_URI}`,
      attribute
    );

    console.log("response.data : " + response.data);

    return response.data;
  } catch (error) {
    console.error("협업자 추가 실패:", error);
    throw error;
  }
};

// 프로젝트 작업 속성 조회 함수
export const fetchAttributes = async (type) => {
  console.log("속성추가 백엔드로 가는 type 정보 : " + type);

  try {
    const response = await axiosInstance.get(
      `${PROJECT_TASK_ATTRIBUTE_SELECT_URI}/${type}`
    );
    return response.data; // type에 따른 데이터 반환
  } catch (error) {
    console.error("작업속성 조회 실패:", error);
    throw error;
  }
};

// 프로젝트 작업 속성 수정 함수
export const updateAttribute = async (id, updatedData) => {
  console.log(
    "작업속성 수정 백엔드로 들어오는 id, updatedData : " + id,
    updatedData
  );
  try {
    const response = await axiosInstance.put(
      `${PROJECT_TASK_ATTRIBUTE_UPDATE_URI}/${id}`,
      updatedData
    );
    return response.data; // 수정된 데이터 반환
  } catch (error) {
    console.error("Error updating attribute:", error);
    throw error;
  }
};

// 프로젝트 작업 속성 삭제 함수
export const deleteAttribute = async (id) => {
  console.log("작업 속성 삭제 백엔드로 들어오는 id : " + id);
  try {
    const response = await axiosInstance.delete(
      `${PROJECT_TASK_ATTRIBUTE_DELETE_URI}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting attribute:", error);
    throw error;
  }
};
