/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { isValidEmail } from "../../../utils/isValidEmail";

const Step2 = ({ state, dispatch, handleSendEmail }) => {
  console.log("Step2 컴포넌트에서 emailVerified 상태:", state.emailVerified);

  // 이메일 변경 핸들러
  const handleEmailChange = (e) => {
    const email = e.target.value;
    dispatch({ type: "SET_EMAIL", payload: email });

    // 에러 초기화
    if (state.error) {
      dispatch({ type: "SET_ERROR", payload: null });
    }
  };

  // 이메일 전송 핸들러
  const handleEmailSend = async () => {
    if (!isValidEmail(state.adminEmail)) {
      dispatch({
        type: "SET_ERROR",
        payload: "유효한 이메일 주소를 입력해주세요.",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await handleSendEmail();
      dispatch({ type: "SET_EMAIL_SENT", payload: true });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "이메일 전송에 실패했습니다." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // 사용자 정의 이동 버튼
  const handleManualNextStep = () => {
    if (state.step === 2 && !state.emailVerified) {
      dispatch({ type: "SET_ERROR", payload: "이메일 인증이 필요합니다." });
    } else {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  return (
    <div className="step-container flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">이메일 인증</h1>
      <p className="text-gray-600 mb-6 text-center">
        관리자 계정이 생성되었습니다. 이메일 인증을 진행해주세요.
      </p>
      <div className="w-full max-w-sm flex flex-col space-y-4">
        {/* 이메일 입력 필드 */}
        <label className="text-gray-700 font-medium">이메일 주소</label>
        <input
          type="email"
          value={state.adminEmail}
          onChange={handleEmailChange}
          disabled={state.loading}
          className={`px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none ${
            isValidEmail(state.adminEmail)
              ? "border-gray-300"
              : "border-red-500"
          } ${state.loading ? "bg-gray-200 cursor-not-allowed" : ""}`}
        />
        {!isValidEmail(state.adminEmail) && state.adminEmail && (
          <p className="text-red-500 text-sm mt-1">
            유효한 이메일 주소를 입력해주세요.
          </p>
        )}

        {/* 이메일 전송 버튼 */}
        {!state.emailSent && (
          <button
            onClick={handleEmailSend}
            disabled={state.loading || !isValidEmail(state.adminEmail)}
            className={`w-full px-6 py-3 rounded-lg transition ${
              state.loading || !isValidEmail(state.adminEmail)
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {state.loading ? "전송 중..." : "이메일 전송"}
          </button>
        )}

        {/* 인증 성공 메시지 */}
        {state.emailSent && !state.emailVerified && (
          <p className="text-green-500 text-center mt-4">
            인증 이메일이 전송되었습니다! 이메일을 확인하세요.
          </p>
        )}

        {/* 사용자 이동 제어 버튼 */}
        <button
          onClick={handleManualNextStep}
          disabled={!state.emailVerified}
          className={`w-full px-6 py-3 mt-4 rounded-lg transition ${
            state.emailVerified
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {state.emailVerified ? "다음 단계로 이동" : "이메일 인증 필요"}
        </button>

        {/* 전송 실패 메시지 */}
        {state.error && (
          <p className="text-red-500 text-center mt-4">{state.error}</p>
        )}
      </div>
    </div>
  );
};

export default Step2;
