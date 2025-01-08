import { checkDuplicateId } from "@/api/userAPI";
import React, { useState } from "react";

const Step1 = ({ state, dispatch, handleNextStep, handleAutoGenerate }) => {
  const [isDuplicateId, setIsDuplicateId] = useState(null); // 중복 확인 상태
  const [errors, setErrors] = useState({}); // 에러 메시지 상태

  // 중복 확인 핸들러
  const handleCheckDuplicateId = async (adminId) => {
    try {
      const response = await checkDuplicateId(adminId);
      const { isAvailable } = response;

      if (isAvailable) {
        setIsDuplicateId(false); // 사용 가능
        setErrors((prevErrors) => ({ ...prevErrors, adminId: null }));
      } else {
        setIsDuplicateId(true); // 중복
        setErrors((prevErrors) => ({
          ...prevErrors,
          adminId: "이미 사용 중인 아이디입니다.",
        }));
      }
    } catch (error) {
      console.error("중복 확인 처리 실패:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        adminId: "중복 확인 실패: 서버 오류가 발생했습니다.",
      }));
    }
  };

  return (
    <div className="step-container flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen p-12">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          🎉 구매 완료
        </h1>
        <p className="text-gray-600 mb-6 text-center leading-relaxed">
          구매가 성공적으로 완료되었습니다. 아래에서 관리자 계정을 설정해주세요.
        </p>
        <hr className="mb-6" />

        {!state.manualInput ? (
          <div className="flex flex-col space-y-6">
            <div className="text-center">
              <button
                onClick={() =>
                  dispatch({ type: "SET_MANUAL_INPUT", payload: true })
                }
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                아이디와 비밀번호 직접 입력
              </button>
            </div>
            {state.generated && (
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-gray-700 font-semibold">
                  아이디: <span className="font-normal">{state.adminId}</span>
                </p>
                <p className="text-gray-700 font-semibold">
                  비밀번호:{" "}
                  <span className="font-normal">{state.adminPassword}</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <form
            className="flex flex-col space-y-6"
            onSubmit={(e) => {
              e.preventDefault(); // 기본 동작 방지
              if (isDuplicateId === true) {
                alert("중복된 아이디입니다. 다른 아이디를 사용해주세요.");
                return;
              }
              handleNextStep(); // 다음 단계로 이동
            }}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-2">
                <label className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>아이디</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={state.adminId}
                  onChange={(e) =>
                    dispatch({ type: "SET_ADMIN_ID", payload: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                  placeholder="아이디를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => handleCheckDuplicateId(state.adminId)}
                  className={`absolute right-3 top-2 px-4 py-2 rounded-md text-white ${
                    isDuplicateId === false
                      ? "bg-green-500 hover:bg-green-600"
                      : isDuplicateId === true
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  } transition`}
                >
                  중복 확인
                </button>
              </div>
              {errors.adminId && (
                <p className="text-red-500 text-sm mt-2">{errors.adminId}</p>
              )}
              {!errors.adminId && isDuplicateId === false && (
                <p className="text-green-500 text-sm mt-2">
                  사용 가능한 아이디입니다.
                </p>
              )}
              {!errors.adminId && isDuplicateId === true && (
                <p className="text-red-500 text-sm mt-2">
                  이미 사용 중인 아이디입니다.
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-700 font-medium">비밀번호</label>
              <input
                type="password"
                value={state.adminPassword}
                onChange={(e) =>
                  dispatch({
                    type: "SET_ADMIN_PASSWORD",
                    payload: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none shadow-sm mt-2"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mt-4 shadow-md"
            >
              다음 단계로 이동
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-600">
        <p className="text-sm">© 2023 AntWork. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Step1;
