import axios from "axios";
import {
  DEPARTMENT_DELETE_URI,
  DEPARTMENT_INSERT_URI,
  DEPARTMENT_SELECT_URI,
  DEPARTMENT_UPDATE_URI,
  DEPARTMENT_USER_UPDATE_URI,
} from "./_URI";
import axiosInstance from "./../utils/axiosInstance";

// 부서 생성 함수
export const insertDepartment = async (departmentName, companyId) => {
  try {
    // 서버로 전송할 데이터
    const payload = {
      name: departmentName, // 부서 이름
      company_id: companyId, // 회사 ID
    };

    // 인증된 요청
    const response = await axiosInstance.post(DEPARTMENT_INSERT_URI, payload, {
      headers: {
        "Content-Type": "application/json", // JSON MIME 타입 설정
      },
    });

    console.log("부서 생성 성공:", response.data);

    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error("부서 생성 요청 실패:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "부서 생성 요청에 실패했습니다."
    );
  }
};

// 부서 조회
export const fetchDepartmentsByCompanyId = async (companyId) => {
  try {
    const response = await axiosInstance.get(
      `${DEPARTMENT_SELECT_URI}/${companyId}`
    );
    return response.data; // 부서 데이터 반환
  } catch (error) {
    console.error("부서 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 부서 수정 (step1: 이름)
export const updateDepartmentName = async (id, payload) => {
  const response = await fetch(`${DEPARTMENT_UPDATE_URI}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("부서 이름 수정 실패");
  }

  return response.json();
};

// 유저 부서 이동
export const moveUserToDepartment = async (userId, departmentId) => {
  try {
    const response = await axiosInstance.patch(
      `${DEPARTMENT_USER_UPDATE_URI}/${userId}`,
      {
        departmentId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("사용자 부서 이동 실패:", error.response || error.message);
    throw (
      error.response?.data?.message ||
      "사용자 부서 이동 중 오류가 발생했습니다."
    );
  }
};

// 부서 삭제
export const deleteDepartmentAPI = async (departmentId, payload) => {
  const response = await fetch(`${DEPARTMENT_DELETE_URI}/${departmentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text(); // 응답을 텍스트로 먼저 받음

  if (!response.ok) {
    throw new Error("부서 삭제 실패: " + text || "서버 오류");
  }

  // 응답 본문이 비어있지 않은 경우 JSON 파싱
  if (text) {
    return JSON.parse(text);
  } else {
    return { message: "부서가 성공적으로 삭제되었습니다." }; // 서버가 빈 응답을 보낸 경우
  }
};
