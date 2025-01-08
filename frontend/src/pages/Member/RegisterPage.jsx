import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TermsModal from "../../components/common/modal/termsModal";
import { checkDuplicateId, verifyInviteToken } from "../../api/userAPI";
import useModalStore from "../../store/modalStore";
import { useFormState } from "./../../hooks/user/useFormState";
import { useTermsAgreement } from "./../../hooks/user/useTermsAgreement";
import { registerUser } from "./../../api/userAPI";

export default function RegisterPage() {
  const navigate = useNavigate();
  const openModal = useModalStore((state) => state.openModal);
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    profileImagePreview,
    validateInput,
    handleConfirmPasswordChange,
    handleProfileImageChange,
    confirmPassword,
    passwordError,
  } = useFormState();

  const { checkedItems, handleAllCheck, handleAgree, handleItemCheck } =
    useTermsAgreement();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // URL에서 token 읽기
  const [isDuplicateId, setIsDuplicateId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 초대 토큰 검증 상태
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 현재 단계 관리 (1: 약관 동의, 2: 회원가입)
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log("Current formData:", formData.joinDate);
  });
  // 초대 토큰 검증
  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        try {
          const data = await verifyInviteToken(token);

          // 사용자 데이터 설정
          setUserData(data);
          setFormData((prevFormData) => ({
            ...prevFormData,
            tokenid: data.id,
            email: data.email || "",
            role: data.role || "USER",
            position: data.position || "",
          }));
          setIsTokenValid(true);
          setErrorMessage("");
        } catch (error) {
          setErrorMessage(error.message || "초대 토큰이 유효하지 않습니다.");
          setIsTokenValid(false);
        } finally {
          setIsLoading(false); // 로딩 상태 해제
        }
      };

      validateToken();
    } else {
      setIsLoading(false); // 토큰이 없으면 로딩 종료
    }
  }, [token]);

  // 아이디 중복 확인 핸들러
  const handleCheckDuplicateId = async (
    formData,
    setIsDuplicateId,
    setErrors
  ) => {
    try {
      const response = await checkDuplicateId(formData.uid);
      const { isAvailable } = response;

      if (isAvailable) {
        setIsDuplicateId(false); // 사용 가능
        setErrors((prevErrors) => ({ ...prevErrors, uid: null }));
      } else {
        setIsDuplicateId(true); // 중복
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

  // 회원가입 핸들러
  const handleRegister = async (e) => {
    e.preventDefault(); // 기본 폼 전송 동작 방지

    // 유효성 검사
    if (!formData.uid || errors.uid) {
      alert("아이디를 올바르게 입력해주세요.");
      return;
    }
    if (isDuplicateId === true) {
      alert("중복된 아이디입니다. 다른 아이디를 사용해주세요.");
      return;
    }
    if (!formData.password || errors.password) {
      alert("비밀번호를 올바르게 입력해주세요.");
      return;
    }
    if (!formData.phoneNumber || errors.phoneNumber) {
      alert("전화번호를 올바르게 입력해주세요.");
      return;
    }

    // FormData 객체 생성
    const formDataToSend = new FormData();

    // 이미지 파일 추가
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    // JSON 데이터 추가
    const jsonData = {
      name: formData.name,
      uid: formData.uid,
      password: formData.password,
      nick: formData.nick,
      phoneNumber: formData.phoneNumber,
      tokenid: formData.tokenid,
      email: formData.email,
      role: formData.role,
      position: formData.position,
      joinDate: formData.joinDate,
    };
    formDataToSend.append(
      "formData",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    // 회원가입 요청
    try {
      const response = await registerUser(formDataToSend);

      if (response.success) {
        alert("회원가입이 성공적으로 완료되었습니다!");
        navigate("/login"); // 로그인 페이지로 이동
      } else {
        alert(response.message || "회원가입 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert(error.message || "회원가입 중 서버 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async () => {
    // 사용자 입력값 검증
    const validationError = validateInput(formData);
    if (validationError) {
      setErrors((prevErrors) => ({ ...prevErrors, uid: validationError }));
      return; // 유효하지 않은 입력값이면 종료
    }

    // 중복 확인 처리
    await handleCheckDuplicateId(formData, setIsDuplicateId, setErrors);
  };

  // 'Next' 버튼 클릭 시 검증 및 단계 이동
  const handleNextClick = () => {
    if (!checkedItems.agree1 || !checkedItems.agree2) {
      alert("모든 필수 항목에 동의해야 합니다.");
      return;
    }
    setCurrentStep(2);
  };

  // 회원가입 폼 렌더링
  const renderRegisterForm = () => {
    if (errorMessage) {
      return <p className="error-message">{errorMessage}</p>;
    }

    if (!isTokenValid) {
      return <p>토큰 검증 중...</p>;
    }

    return (
      <div
        id="container"
        className="min-h-screen flex items-center justify-center py-10 px-4"
      >
        <div
          id="register_div"
          className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 space-y-8"
        >
          {/* 로고 및 소개 */}
          <div className="text-center">
            <img
              id="register_img"
              src="images/Antwork/member/register.png"
              alt="Register"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-3xl font-extrabold text-gray-800">Register</h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>
          <form onSubmit={handleSubmit} className="register_form space-y-6">
            {/* 프로필 사진 */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                프로필이미지
              </label>
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <input
                type="file"
                id="profileImage"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                name="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </div>

            {/* 입력 필드 */}
            {/* 아이디 */}
            <div className="mb-6">
              <label
                htmlFor="uid"
                className="block text-gray-700 font-semibold mb-2"
              >
                아이디
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="uid"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 focus:outline-none"
                  name="uid"
                  placeholder="아이디를 입력하세요"
                  value={formData.uid || ""}
                  onChange={handleChange} // `handleChange` 호출
                />
                <button
                  type="button"
                  className={`${
                    isDuplicateId === false
                      ? "bg-green-500"
                      : isDuplicateId === true
                      ? "bg-red-500"
                      : "bg-gray-500"
                  } hover:bg-gray-600 w-40 text-white font-semibold h-10 py-2 px-4 rounded-md ml-2`}
                  onClick={async () => {
                    if (!formData.uid || errors.uid) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        uid: errors.uid || "아이디를 먼저 입력해 주세요.",
                      }));
                      return;
                    }

                    await handleCheckDuplicateId(
                      formData,
                      setIsDuplicateId,
                      setErrors
                    );
                  }}
                >
                  중복확인
                </button>
              </div>

              {/* 에러 메시지 출력 */}
              {errors.uid && (
                <p className="text-red-500 text-sm mt-1">{errors.uid}</p>
              )}

              {/* 중복 확인 결과 메시지 출력 */}
              {!errors.uid && isDuplicateId === false && (
                <p className="text-green-500 text-sm mt-1">
                  사용 가능한 아이디입니다.
                </p>
              )}
              {!errors.uid && isDuplicateId === true && (
                <p className="text-red-500 text-sm mt-1">
                  이미 사용 중인 아이디입니다.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your password"
                value={formData.password || ""}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 focus:outline-none"
                value={confirmPassword || ""}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            <div className="gap-6 sm:grid-cols-2">
              {/* 이름 */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 focus:outline-none"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleChange}
                />
              </div>

              {/* 닉네임 */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  id="nick"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 focus:outline-none"
                  name="nick"
                  placeholder="Enter your nickname"
                  onChange={handleChange}
                />
              </div>

              {/* 입사일 */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  입사일
                </label>
                <input
                  type="date"
                  id="joinDate"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 focus:outline-none"
                  name="joinDate"
                  placeholder="Select your joining date"
                  value={formData.joinDate || ""}
                  onChange={handleChange}
                />
              </div>

              {/* 전화번호 */}
              <div className="sm:col-span-2 mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  휴대폰번호
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 focus:outline-none"
                  name="phoneNumber"
                  placeholder="010-1234-5678"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-8 rounded-lg transition duration-200"
                onClick={handleRegister}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="member_body">
      {isLoading ? (
        <div className="loading-container">
          <p>검증 중입니다. 잠시만 기다려주세요...</p>
        </div>
      ) : errorMessage ? (
        <div className="error-container">
          <h1>초대 링크 오류</h1>
          <p>{errorMessage}</p>
        </div>
      ) : currentStep === 1 ? (
        // 약관 동의 단계
        <div className="terms-container">
          <div id="main">
            <img
              id="womanImg"
              src="images/Antwork/member/woman.png"
              alt="여자"
            />
            <img id="manImg" src="images/Antwork/member/man.png" alt="남자" />
            <div className="info-box">
              <div className="header">
                <h1>
                  약관 및 개인정보 수집, 이용 안내에 <br />
                  동의해주세요.
                </h1>
                <p>
                  Ant Work 플랫폼 이용을 위해 약관 및 개인정보 수집 및 이용 안내
                  동의가 필요합니다.
                </p>
              </div>
              <div className="terms-content">
                <div className="agreement-all">
                  <input
                    type="checkbox"
                    id="agreeAll"
                    checked={checkedItems.agreeAll}
                    onChange={handleAllCheck}
                  />
                  <label htmlFor="agreeAll">전체 동의</label>
                </div>
                <div className="agreement-item">
                  <input
                    type="checkbox"
                    id="agree1"
                    checked={checkedItems.agree1}
                    onChange={() => handleItemCheck("agree1")}
                  />
                  <label htmlFor="agree1">
                    <em className="em">[필수]</em> 서비스 이용 약관
                  </label>
                  <button
                    className="detail-btn"
                    onClick={() =>
                      openModal("terms", {
                        type: "agree1",
                        onAgree: () => handleAgree("agree1"),
                      })
                    }
                  >
                    전문 &gt;
                  </button>
                </div>
                <div className="agreement-item">
                  <input
                    type="checkbox"
                    id="agree2"
                    checked={checkedItems.agree2}
                    onChange={() => handleItemCheck("agree2")}
                  />
                  <label htmlFor="agree2">
                    <em className="em">[필수]</em> 개인 정보 수집 및 이용 안내
                  </label>
                  <button
                    className="detail-btn"
                    onClick={() =>
                      openModal("terms", {
                        type: "agree2",
                        onAgree: () => handleAgree("agree2"),
                      })
                    }
                  >
                    전문 &gt;
                  </button>
                </div>
                <div className="agreement-item">
                  <input
                    type="checkbox"
                    id="agree3"
                    checked={checkedItems.agree3}
                    onChange={() => handleItemCheck("agree3")}
                  />
                  <label htmlFor="agree3">[선택] 광고성 정보 수신</label>
                  <button
                    className="detail-btn"
                    onClick={() =>
                      openModal("terms", {
                        type: "agree3",
                        onAgree: () => handleAgree("agree3"),
                      })
                    }
                  >
                    전문 &gt;
                  </button>
                </div>
              </div>
              <button onClick={handleNextClick} className="next-btn">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 회원가입 단계
        renderRegisterForm()
      )}
      <TermsModal />
    </div>
  );
}
