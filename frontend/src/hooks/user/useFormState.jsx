import { useState } from "react";

export const useFormState = () => {
  const [formData, setFormData] = useState({
    name: "",
    uid: "",
    password: "",
    nick: "",
    phoneNumber: "",
    profileImage: null,
    profileImageUrl: "",
    tokenid: "",
    email: "",
    role: "",
    position: "",
    joinDate: "",
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 검증 에러
  const [errors, setErrors] = useState({});

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "phoneNumber") {
      handlePhoneValidation(value); // 전화번호 유효성 검사
    } else if (name === "uid") {
      const validationError = validateUid(value);
      setErrors((prevErrors) => ({ ...prevErrors, uid: validationError }));
    } else if (name === "password") {
      // 비밀번호 변경 시 검증
      handlePasswordValidation(value, confirmPassword);
    }
  };

  // 비밀번호 확인 핸들러
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    handlePasswordValidation(formData.password, value);
  };

  // 비밀번호 검증 로직
  const handlePasswordValidation = (password, confirmPassword) => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "비밀번호가 일치하지 않습니다.",
      }));
    } else {
      setPasswordError(false);
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: null }));
    }
  };

  // UID 유효성 검사
  const validateUid = (input) => {
    if (!input || input.trim() === "") {
      return "아이디를 입력해 주세요.";
    }
    if (input.length < 3 || input.length > 20) {
      return "아이디는 3자 이상, 20자 이하로 입력해 주세요.";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(input)) {
      return "아이디는 영문자, 숫자, 밑줄(_)만 포함할 수 있습니다.";
    }
    return null;
  };

  // 전화번호 유효성 검사
  const handlePhoneValidation = (value) => {
    const cleaned = value.replace(/\D/g, ""); // 숫자만 남기기
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);

    const formatted = match ? `${match[1]}-${match[2]}-${match[3]}` : cleaned;

    setFormData((prev) => ({ ...prev, phoneNumber: formatted })); // 포맷팅된 전화번호 설정

    // 유효성 검사
    if (
      !/^(\d{3})-(\d{3,4})-(\d{4})$/.test(formatted) &&
      formatted.length > 0
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "올바른 전화번호 형식이 아닙니다.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: null })); // 에러 초기화
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0]; // 업로드된 파일 가져오기
    if (file) {
      const reader = new FileReader(); // FileReader 객체 생성
      reader.onload = () => {
        setProfileImagePreview(reader.result); // Base64 URL로 미리보기 설정
        setFormData((prevFormData) => ({
          ...prevFormData,
          profileImage: file, // 실제 파일 저장
        }));
      };
      reader.readAsDataURL(file); // 파일을 Base64 URL로 변환
    } else {
      setProfileImagePreview(null); // 파일이 없으면 미리보기 초기화
      setFormData((prevFormData) => ({
        ...prevFormData,
        profileImage: null, // 프로필 이미지 초기화
      }));
    }
  };

  return {
    formData,
    setFormData,
    confirmPassword,
    setConfirmPassword,
    profileImagePreview, // 미리보기 URL
    errors,
    setErrors,
    passwordError,
    handleChange,
    handleConfirmPasswordChange,
    handleProfileImageChange,
  };
};
