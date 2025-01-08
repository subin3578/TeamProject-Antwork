import axios from "axios";
import {
  POPUP_URI,
} from "./_URI";
import axiosInstance from "@/utils/axiosInstance";

// 회사별 팝업 데이터를 가져오는 함수
export const fetchPopups = async (companyId) => {
  try {
    const response = await axiosInstance.get(`${POPUP_URI}?companyId=${companyId}`);
    return response.data; // 회사별 필터링된 팝업 데이터를 반환
  } catch (error) {
    console.error("Error fetching popups:", error);
    throw error; // 호출한 컴포넌트가 에러를 처리하도록 전달
  }
};

// 팝업 추가 함수
export const addPopup = async (popup) => {
  try {
    const response = await axiosInstance.post(POPUP_URI, popup);
    return response.data; // 추가된 팝업 데이터를 반환
  } catch (error) {
    console.error("Error adding popup:", error);
    throw error; // 호출한 컴포넌트가 에러를 처리하도록 전달
  }
};

// 팝업 업데이트 함수
export const updatePopup = async (id, updatedPopup) => {
  try {
    const response = await axiosInstance.put(`${POPUP_URI}/${id}`, updatedPopup);
    return response.data; // 업데이트된 팝업 데이터를 반환
  } catch (error) {
    console.error("Error updating popup:", error);
    throw error; // 호출한 컴포넌트가 에러를 처리하도록 전달
  }
};

// 팝업 삭제 함수
export const deletePopup = async (id) => {
  try {
    await axiosInstance.delete(`${POPUP_URI}/${id}`);
    return id; // 삭제된 팝업 ID를 반환
  } catch (error) {
    console.error("Error deleting popup:", error);
    throw error; // 호출한 컴포넌트가 에러를 처리하도록 전달
  }
};

// 사용자 ID를 기반으로 표시 가능한 팝업 데이터를 가져오는 함수
export const fetchVisiblePopups = async (userId) => {
  try {
    const response = await axiosInstance.get(`${POPUP_URI}/visible/${userId}`);
    return response.data; // 표시 가능한 팝업 데이터를 반환
  } catch (error) {
    console.error("Error fetching visible popups:", error);
    throw error; // 호출한 컴포넌트가 에러를 처리하도록 전달
  }
};

// 특정 팝업을 7일간 숨김 처리하는 함수
export const hidePopupForUser = async (popupId, userId) => {
  try {
    await axiosInstance.post(
      `${POPUP_URI}/${popupId}/hide`,
      { userId }, // JSON 객체로 전달
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error hiding popup for user:", error);
    throw error;
  }
};