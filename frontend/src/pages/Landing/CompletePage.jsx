import React, { useEffect } from "react";
import LandingLayout from "../../layouts/LandingLayout";

import Step1 from "../../components/landing/pay/Step1";
import Step2 from "../../components/landing/pay/Step2";
import Step3 from "../../components/landing/pay/Step3";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { sendUserEmail, verifyUserCheckEmail } from "../../api/userAPI";
import { useCompletePage } from "../../hooks/Lending/completePageReducer";
import axios from "axios";
import { verifyUserEmail } from "./../../api/userAPI";
const CompletePage = () => {
  const { state, dispatch } = useCompletePage();

  // 폴링 방식으로 이메일 인증 상태 확인
  useEffect(() => {
    let intervalId;

    const checkEmailVerification = async () => {
      const token = localStorage.getItem("authToken"); // Token 가져오기
      if (!token) {
        console.error("Token not found in localStorage.");
        clearInterval(intervalId); // Token이 없으면 폴링 중단
        return;
      }

      try {
        const response = await verifyUserCheckEmail(token); // API 호출
        if (response.status === 200 && response.data.verified) {
          console.log("이메일 인증 완료");
          dispatch({ type: "SET_EMAIL_VERIFIED", payload: true }); // 인증 상태 업데이트
          clearInterval(intervalId); // 인증 완료 시 폴링 중단
        }
      } catch (error) {
        console.error("이메일 인증 상태 확인 실패:", error);
      }
    };

    if (state.emailSent) {
      console.log("폴링 시작: 이메일 인증 상태 확인 중...");
      intervalId = setInterval(checkEmailVerification, 5000); // 5초 간격
    }

    return () => {
      clearInterval(intervalId); // 컴포넌트 언마운트 시 폴링 중단
    };
  }, [dispatch, state.emailSent]);

  const handleNextStep = () => {
    if (state.step === 2 && !state.emailVerified) {
      dispatch({
        type: "SET_ERROR",
        payload: "이메일 인증이 완료되지 않았습니다.",
      });
    } else {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "NEXT_STEP" });
    }
  };
  const handleSendEmail = async () => {
    try {
      // 로딩 상태 시작
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // 이메일 데이터 준비
      const data = {
        to: state.adminEmail,
        subject: "이메일 인증 요청",
        body: "이메일 인증을 위해 링크를 클릭하세요.",
      };

      // 이메일 요청 API 호출
      const response = await sendUserEmail(data);

      // 백엔드 응답 확인
      console.log("Response from backend:", response);

      // 올바른 경로로 토큰 확인 및 저장
      const token = response?.token; // response.data 안에 token 확인
      if (token) {
        console.log("Received token:", token);

        // 토큰을 로컬 스토리지 또는 상태에 저장
        localStorage.setItem("authToken", token);

        // 이메일 전송 성공 상태 업데이트
        dispatch({ type: "SET_EMAIL_SENT", payload: true });

        // 사용자에게 알림
        alert("이메일이 성공적으로 전송되었습니다. 인증 링크를 확인하세요.");
      } else {
        throw new Error("Token is missing in the response.");
      }
    } catch (error) {
      // 예외 처리
      console.error("Error sending email:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "이메일 전송 중 문제가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      // 로딩 상태 종료
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <LandingLayout>
      <TransitionGroup className="step-transition">
        <CSSTransition key={state.step} timeout={300} classNames="fade">
          <div className=" bg-white">
            {state.step === 1 && (
              <Step1
                state={state}
                dispatch={dispatch}
                handleNextStep={handleNextStep}
              />
            )}
            {state.step === 2 && (
              <Step2
                state={state}
                dispatch={dispatch}
                handleSendEmail={handleSendEmail}
              />
            )}
            {state.step === 3 && (
              <Step3
                state={state}
                dispatch={dispatch}
                handleNextStep={handleNextStep}
              />
            )}
          </div>
        </CSSTransition>
      </TransitionGroup>

      {/* 상태 메시지 */}
      {state.emailVerified && (
        <div className="bg-green-100 text-green-800 p-4 rounded mt-4">
          이메일 인증이 성공적으로 완료되었습니다!
        </div>
      )}
      {state.error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mt-4">
          {state.error}
        </div>
      )}
    </LandingLayout>
  );
};

export default CompletePage;
