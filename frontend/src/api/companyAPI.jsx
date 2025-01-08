import { COMPANY_INSERT_URI, COMPANY_SELECT_URI } from "./_URI";
import axios from "axios";

export const addCompany = async (companyData) => {
  try {
    console.log("회사 insert 요청 전송");
    // 요청 전송
    const response = await axios.post(COMPANY_INSERT_URI, companyData, {
      headers: {
        "Content-Type":
          companyData instanceof FormData
            ? "multipart/form-data"
            : "application/json",
      },
    });

    // 응답 데이터 검증
    if (response.data.success) {
      console.log("Company added successfully:", response.data);
      return response.data;
    } else {
      throw new Error(
        response.data.message || "회사 정보 저장에 실패했습니다."
      );
    }
  } catch (error) {
    console.error("Error adding company:", error.message || error);
    throw new Error("회사 정보를 저장하는 중 문제가 발생했습니다."); // 사용자 친화적 메시지
  }
};

export const selectCompany = async (companyId) => {
  try {
    // 요청 전송
    const response = await axios.get(`${COMPANY_SELECT_URI}/${companyId}`);

    // 응답 데이터 검증
    return response.data;
  } catch (error) {
    console.error("Error selecting company:", error.message || error);
    throw new Error("회사 정보를 조회하는 중 문제가 발생했습니다."); // 사용자 친화적 메시지
  }
};
