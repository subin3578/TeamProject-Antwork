import { useState } from "react";
import { checkDuplicateId } from "../../api/userAPI";

export const useCheckDuplicateId = () => {
  const [isDuplicateId, setIsDuplicateId] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInput = (input) => {
    if (!input || input.trim() === "") {
      return "아이디를 입력해 주세요."; // 빈 입력값 처리
    }
    if (input.length < 3 || input.length > 20) {
      return "아이디는 3자 이상, 20자 이하로 입력해 주세요."; // 길이 제한
    }
    if (!/^[a-zA-Z0-9_]+$/.test(input)) {
      return "아이디는 영문자, 숫자, 밑줄(_)만 포함할 수 있습니다."; // 허용된 문자 패턴
    }
    return null; // 유효성 검증 성공
  };

  const handleCheckDuplicateId = async (formData) => {
    const validationError = validateInput(formData.uid);
    if (validationError) {
      setErrors((prevErrors) => ({ ...prevErrors, uid: validationError }));
      return false; // 유효하지 않은 입력값
    }

    try {
      const response = await checkDuplicateId(formData);
      const { isAvailable } = response;

      if (isAvailable) {
        setIsDuplicateId(false); // 사용 가능
        setErrors((prevErrors) => ({ ...prevErrors, uid: null })); // 에러 초기화
      } else {
        setIsDuplicateId(true);
        setErrors((prevErrors) => ({
          ...prevErrors,
          uid: "이미 사용 중인 아이디입니다.",
        }));
      }
    } catch (error) {
      console.error("중복 확인 처리 실패:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        uid: "중복 확인 실패: 서버 오류가 발생했습니다.",
      }));
    }
  };

  return { isDuplicateId, errors, handleCheckDuplicateId };
};
