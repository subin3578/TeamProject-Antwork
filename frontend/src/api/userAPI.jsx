import axios from "axios";
import useAuthStore from "../store/AuthStore";
import axiosInstance from "./../utils/axiosInstance";
import {
  USER_ADMIN_CREATE_URI,
  USER_CEO_URI,
  USER_CHECK_DUPLICATE_ID_URI,
  USER_DELETEUSER_URI,
  USER_DETAILS_URI,
  USER_FINDBYEMAIL_URI,
  USER_FINDDELETE_URI,
  USER_GET_ALL_URI,
  USER_INVITE_SEND_EMAIL_URI,
  USER_INVITE_URI,
  USER_INVITE_VERIFY_URI,
  USER_LIST_URI,
  USER_LOGIN_URI,
  USER_LOGOUT_URI,
  USER_REFRESH_URI,
  USER_REGISTER_URI,
  USER_SEARCHUSER_URI,
  USER_SELECT_URI,
  USER_SEND_EMAIL_URI,
  USER_UPDATEIMG_URI,
  USER_UPDATEINFO_URI,
  USER_UPDATEPASS_URI,
  USER_UPDATEPOSITION_URI,
  USER_VACATIONSELECT_URI,
  USER_VERIFY_CHECK_EMAIL_URI,
  USER_VERIFY_EMAIL_URI,
} from "./_URI";

// 유저 회원가입
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(USER_REGISTER_URI, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
    );
  }
};

// 유저 로그인
export const loginUser = async (uid, password) => {
  try {
    console.log("로그인 요청");
    const response = await axios.post(
      USER_LOGIN_URI,
      { uid, password },
      { withCredentials: true } // 쿠키 허용
    );
    const accessToken = response.data.data;
    console.log("로그인 응답: ", accessToken);

    // Zustand 상태 저장소에 accessToken 저장
    useAuthStore.getState().setAccessToken(accessToken);

    return accessToken; // { accessToken: "..." }
  } catch (error) {
    console.error("로그인 요청 중 오류:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "로그인 요청에 실패했습니다."
    );
  }
};

// 유저 UID로 유저 조회
export const getUserByUid = async (uid) => {
  try {
    const response = await axios.get(`${USER_DETAILS_URI}/${uid}`);
    return response.data; // 서버에서 받은 유저 데이터 반환
  } catch (error) {
    console.error(
      `유저 조회 실패 (UID: ${uid}):`,
      error.response || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "유저 정보를 가져오는 중 오류가 발생했습니다."
    );
  }
};

// 유저 리스트 조회 (회사별 + 페이징)
export const selectMembers = async (company, page = 1, size = 20) => {
  try {
    const response = await axios.get(USER_LIST_URI, {
      params: { company, page, size },
    });
    return response.data;
  } catch (error) {
    console.error("멤버 리스트 가져오기 실패:", error);
    throw error;
  }
};

// 유저 리스트 조회 (부서별)
export const fetchUsersByDepartmentId = async (departmentId) => {
  try {
    const response = await axiosInstance.get(
      `${USER_SELECT_URI}/${departmentId}`
    );
    return response.data; // 사용자 데이터 반환
  } catch (error) {
    console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 리프레시 토큰 검증
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(USER_REFRESH_URI, null, {
      withCredentials: true, // HTTP-Only 쿠키로 갱신
    });
    console.log("api? 토큰 " + response.data.data);
    return response.data.data; // 새로운 Access Token 반환
  } catch (error) {
    console.error("리프레시 토큰 갱신 실패:", error);
    throw new Error("리프레시 토큰 갱신에 실패했습니다.");
  }
};

// 토큰 초기화
export const clearAuthToken = () => {
  useAuthStore.getState().clearAccessToken();
};

// 유저 로그아웃
export const logoutUser = async () => {
  try {
    // 서버에 로그아웃 요청 (쿠키 삭제)
    await axios.post(USER_LOGOUT_URI, null, { withCredentials: true });

    // Zustand에서 Access Token 삭제
    useAuthStore.getState().clearAccessToken();
  } catch (error) {
    console.error("로그아웃 요청 실패:", error.response || error.message);
    throw new Error("로그아웃 요청에 실패했습니다.");
  }
};

// 이메일 발송
export const sendUserEmail = async (data) => {
  console.log(data);
  try {
    const response = await axios.post(`${USER_SEND_EMAIL_URI}`, data);
    console.log("이메일 전송 성공:", response.data);
    return response.data;
  } catch (err) {
    console.error("이메일 전송 실패:", err);
  }
};

// 인증 요청
export const verifyUserEmail = async (token) => {
  try {
    const response = await axios.get(`${USER_VERIFY_EMAIL_URI}?token=${token}`);
    console.log("Email verification response:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

// 초대 인증 확인 (회원)
export const verifyInviteToken = async (token) => {
  try {
    console.log("토큰" + token);
    const response = await axios.get(
      `${USER_INVITE_VERIFY_URI}?token=${token}`
    );
    return response.data.data; // 사용자 정보 반환
  } catch (error) {
    console.error("토큰 검증 실패:", error.response?.data || error.message);
    throw new Error("유효하지 않은 초대 토큰입니다.");
  }
};

// 아이디 중복 확인
export const checkDuplicateId = async (uid) => {
  try {
    console.log("전달된 UID:", uid);
    // POST 요청을 통해 uid를 JSON 객체로 전달
    const response = await axios.post(
      USER_CHECK_DUPLICATE_ID_URI,
      { uid }, // JSON 객체로 전달
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("아이디 중복 확인 응답:", response.data);
    return response.data; // 필요한 데이터만 반환
  } catch (error) {
    console.error("아이디 중복 확인 실패:", error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 이메일 인증 확인 (관리자)
export const verifyUserCheckEmail = async (token) => {
  try {
    const response = await axios.get(
      `${USER_VERIFY_CHECK_EMAIL_URI}?token=${token}`
    );
    console.log("Email verification response:", response.data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

// 관리자 이메일 인증
export const verifyUserInviteEmail = async (email, companyName) => {
  try {
    const response = await axios.post(USER_INVITE_SEND_EMAIL_URI, {
      email,
      companyName,
    });

    console.log("Email verification response:", response.data);

    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

// 초기 관리자 멤버 추가
export const addUser = async (userData) => {
  console.log("유저 insert 요청 전송");
  try {
    const response = await axios.post(USER_ADMIN_CREATE_URI, userData);

    if (response.data.success) {
      console.log("User added successfully:", response.data);
      return response.data;
    } else {
      throw new Error(
        response.data.message || "사용자 정보 저장에 실패했습니다."
      );
    }
  } catch (error) {
    console.error("Error adding user:", error);
    throw error; // 예외를 호출한 쪽으로 전달
  }
};

// 회원 초대 API 호출 함수
export const inviteUser = async (userData) => {
  try {
    console.log("초대 요청 전송");
    console.log("롤" + userData.role);
    const response = await axiosInstance.post(USER_INVITE_URI, userData);

    if (response.data.success) {
      console.log("초대 성공:", response.data);
      return response.data;
    } else {
      throw new Error(
        response.data.message || "초대 요청 처리에 실패했습니다."
      );
    }
  } catch (error) {
    console.error("초대 요청 실패:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "초대 요청 중 문제가 발생했습니다."
    );
  }
};

// 모든 유저 조회
export const getAllUser = async () => {
  try {
    const response = await axiosInstance.get(USER_GET_ALL_URI);
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};

// 유저 정보 수정하기
export const updateInfo = async (info, uid, type) => {
  try {
    const response = await axiosInstance.put(
      `${USER_UPDATEINFO_URI}/${info}/${uid}/${type}`
    );
    const newAccessToken = await refreshAccessToken(); // 토큰 갱신
    useAuthStore.getState().setAccessToken(newAccessToken); // Zustand 업데이트
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};

// 유저 정보 수정하기
export const updateImg = async (info, uid) => {
  try {
    const response = await axiosInstance.put(
      `${USER_UPDATEIMG_URI}/${uid}`,
      info,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const newAccessToken = await refreshAccessToken(); // 토큰 갱신
    useAuthStore.getState().setAccessToken(newAccessToken); // Zustand 업데이트
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};

// 유저 정보 수정하기
export const updatePassword = async (pass, uid, type) => {
  console.log("hmmmmmmmmmmmm" + pass + "hmmmmmmmmmmmm" + uid);
  try {
    const response = await axiosInstance.post(
      `${USER_UPDATEPASS_URI}/${type}`,
      {
        password: pass,
        uid: uid,
      }
    );
    const newAccessToken = await refreshAccessToken(); // 토큰 갱신
    useAuthStore.getState().setAccessToken(newAccessToken); // Zustand 업데이트
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
  }
};

// 회사의 대표이사 조회
export const fetchUsersByCompanyAndPosition = async (companyId, position) => {
  try {
    console.log("들어옴?");
    const response = await axios.get(`${USER_CEO_URI}`, {
      params: {
        companyId: companyId,
        position: position,
      },
    });
    return response.data; // 필터링된 사용자 목록 반환
  } catch (error) {
    console.error("Error fetching users by company and position:", error);

    throw error;
  }
};

// 유저 아이디 찾기
export const findIdByEmail = async (info, email, type) => {
  console.log("이름?" + info + "메일?" + email + "타입?" + type);
  try {
    const response = await axios.get(`${USER_FINDBYEMAIL_URI}`, {
      params: {
        info: info,
        email: email,
        type: type,
      },
    });
    return response.data; // 필터링된 사용자 목록 반환
  } catch (error) {
    console.error("Error fetching users by company and position:", error);

    throw error;
  }
};

// 멤버 검색해서 찾기
export const searchUser = async (formData, company, page, size) => {
  console.log("hhh" + page + "bbb" + size);
  try {
    const response = await axios.get(`${USER_SEARCHUSER_URI}`, {
      params: {
        type: formData.get("type"),
        keyword: formData.get("keyword"),
        company: company,
        page: page,
        size: size,
      },
    });
    return response.data; // 필터링된 사용자 목록 반환
  } catch (error) {
    console.error("Error fetching users by company and position:", error);

    throw error;
  }
};

// 회사 유저 조회
export const getAllUserCompany = async (companyId) => {
  console.log(`${USER_GET_ALL_URI}/company/${companyId}`);
  try {
    const response = await axiosInstance.get(
      `${USER_GET_ALL_URI}/company/${companyId}`
    );
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};

// 유저 직위 변경
export const updatePosition = async (data) => {
  console.log(data);
  try {
    const response = await axiosInstance.put(
      `${USER_UPDATEPOSITION_URI}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};

// 유저 delete 처리
export const deleteUser = async (checkUser, type) => {
  console.log(checkUser);
  try {
    const response = await axiosInstance.put(
      `${USER_DELETEUSER_URI}/${type}`,
      checkUser
    );
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};

// delete 유저 찾기
export const findDeleteUser = async (
  companyId,
  currentPage,
  pageSize,
  status
) => {
  try {
    const response = await axiosInstance.get(
      `${USER_FINDDELETE_URI}/${companyId}/${currentPage}/${pageSize}/${status}`
    );
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};

// vacation 유저 찾기
export const findVacationUser = async () => {
  try {
    const response = await axiosInstance.get(`${USER_VACATIONSELECT_URI}`);
    return response.data;
  } catch (error) {
    console.error("유저 가져오기 요청 실패:", error);
    throw error;
  }
};
