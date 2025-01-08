import { addUser } from "../../api/userAPI";
import { addCompany } from "./../../api/companyAPI";

export const completeSetup = async (state, dispatch) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });

    // 회사 정보 저장
    const companyData = {
      name: state.companyName,
    };

    let companyResponse;
    try {
      console.log("회사 setup insert 요청 전송");
      companyResponse = await addCompany(companyData);
    } catch (error) {
      throw new Error(
        "회사 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }

    const companyId = companyResponse?.data; // 응답의 data 필드에서 companyId 추출
    if (!companyId || companyId <= 0) {
      throw new Error("회사 ID를 가져오지 못했습니다.");
    }

    // 사용자 정보 생성
    const userData = {
      uid: state.adminId,
      name: state.adminName,
      password: state.adminPassword,
      email: state.adminEmail,
      companyId,
      phoneNumber: state.phoneNumber,
      role: "ADMIN",
    };

    if (
      !userData.uid ||
      !userData.name ||
      !userData.password ||
      !userData.email ||
      !userData.companyId
    ) {
      throw new Error("사용자 정보에 필수 값이 누락되었습니다.");
    }

    try {
      await addUser(userData);
    } catch (error) {
      throw new Error(
        "사용자 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }

    // 성공 처리
    dispatch({ type: "RESET" });
    alert("설정이 완료되었습니다. 로그인 페이지로 이동합니다.");
    window.location.href = "/login";
  } catch (error) {
    console.error("설정 완료 중 오류:", error);
    dispatch({ type: "SET_ERROR", payload: error.message });
    alert(error.message);
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
};
