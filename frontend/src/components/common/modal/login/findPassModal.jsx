import { findIdByEmail, sendUserEmail, updatePassword } from "@/api/userAPI";
import { useCompletePage } from "@/hooks/Lending/completePageReducer";
import { useState } from "react";

export default function FindPassModal({ isOpen, setIsOpen }) {
  const [showNumber, setShowNumber] = useState(false); // 이메일이 맞다면 나오는 인증번호 input
  const [pass, setPass] = useState(); // input에 적은 비밀번호
  const [passCheck, setPassCheck] = useState(); // input에 적은 비밀번호 확인
  const [uid, setUid] = useState(); // 유아이디 값
  const [email, setEmail] = useState(""); // 입력값 상태 관리
  const [error, setError] = useState(""); // 에러 메시지 상태 관리
  const [error2, setError2] = useState(""); // 에러 메시지 상태 관리
  const [checkNumber, setCheckNumber] = useState(); // 실제 인증번호
  const [inputNumber, setInputNumber] = useState(); // input에 적은 인증번호
  const [errorMessage, setErrorMessage] = useState(""); // 에러메시지
  const [passChange, setPassChange] = useState(false); // 비밀번호 바꾸는게 나오기 위함
  const { dispatch } = useCompletePage();
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

  const handleClose = () => {
    setIsOpen(false);
    resetStates();
  };

  const resetStates = () => {
    setShowNumber(false);
    setPass("");
    setUid("");
    setEmail("");
    setError("");
    setCheckNumber("");
    setInputNumber("");
    setPassChange(false);
  };

  const handleSendEmail = async () => {
    try {
      // 로딩 상태 시작
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // 이메일 데이터 준비
      const data = {
        to: email,
        subject: "비밀번호 찾기",
        body: "이메일 인증을 위해 받은 번호를 입력하세요.",
      };

      // 이메일 요청 API 호출
      const response = await sendUserEmail(data);

      // 백엔드 응답 확인
      console.log("Response from backend:", response);

      // 올바른 경로로 토큰 확인 및 저장
      const number = response?.number; // response.data 안에 token 확인
      setCheckNumber(number);
    } catch (error) {
      // 예외 처리
      console.error("Error sending email:", error);
    }
  };

  const handleNumber = async () => {
    if (!email) {
      setError("E-mail을 입력하세요."); // 에러 메시지 설정
      return;
    }
    setError(""); // 에러 초기화
    if (emailRegEx.test(email)) {
      const type = "pass";
      const response = await findIdByEmail(uid, email, type);
      console.log(response);
      if (response == "해당 정보가 없습니다.") {
        setError("해당 아이디에 대한 email이 없습니다.");
        return;
      } else {
        setShowNumber(true);
        console.log(email);
        handleSendEmail();
      }
    } else {
      setError("email이 형식에 맞지 않습니다. ");
    }
    console.log(showNumber);
  };

  const checkEmail = () => {
    if (inputNumber == checkNumber) {
      console.log("일치!");
      setError2("");
      setPassChange(true);
      return;
    }
    setError2("인증번호가 일치하지 않습니다.");
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setPassCheck(value);

    // 비밀번호 비교
    if (value !== pass) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMessage("");
    }
  };

  const saveNewPass = async () => {
    console.log(pass);
    const type = "update";
    const response = await updatePassword(pass, uid, type);
    if (response) {
      alert("비밀번호가 재설정되었습니다.");
    } else {
      alert("변경 실패!");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] max-w-full mx-4 overflow-hidden animate-fade-in">
        {/* 모달 헤더 */}
        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">비밀번호 찾기</h2>
          <button
            className="text-gray-600 hover:text-gray-900 transition duration-300"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6 space-y-4">
          {/* 아이디 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="아이디를 입력하세요"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
          </div>

          <div>
            {/* Label은 위에 위치 */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            {/* Input과 Button을 한 줄로 배치 */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="E-mail을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // 입력값 업데이트
                required
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                onClick={handleNumber}
              >
                인증번호 받기
              </button>
            </div>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}{" "}
            {/* 에러 메시지 표시 */}
            {showNumber && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  인증번호
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    placeholder="인증번호를 입력하세요"
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    onClick={checkEmail}
                  >
                    확인
                  </button>
                </div>
                {error2 && (
                  <p className="text-red-500 mt-2 text-sm">{error2}</p>
                )}{" "}
              </div>
            )}
          </div>

          {passChange && (
            <>
              <div className="flex items-center mx-[15px]">
                <label className="w-1/3 text-gray-700 font-medium">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center mx-[15px]">
                <label className="w-1/3 text-gray-700 font-medium">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passCheck}
                  onChange={handleConfirmPasswordChange}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {/* 경고 메시지 */}
              {errorMessage && (
                <div className="mx-[15px] mt-2 text-sm text-red-500">
                  {errorMessage}
                </div>
              )}
            </>
          )}

          {/* 버튼들 */}
          <div className="flex space-x-3 mt-6">
            {passChange && !errorMessage && (
              <button
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold"
                onClick={saveNewPass}
              >
                비밀번호 저장
              </button>
            )}
            <button
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold"
              onClick={handleClose}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
