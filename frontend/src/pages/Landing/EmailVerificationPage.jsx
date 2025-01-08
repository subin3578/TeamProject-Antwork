import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyUserEmail } from "../../api/userAPI";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("loading"); // 상태: loading, success, failure

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        console.error("토큰이 누락되었습니다.");
        setVerificationStatus("failure");
        return;
      }

      try {
        const response = await verifyUserEmail(token);
        if (response.status === 200) {
          console.log("이메일 인증 성공");
          setVerificationStatus("success");
        } else {
          throw new Error("이메일 인증 실패");
        }
      } catch (error) {
        console.error("이메일 인증 실패:", error);
        setVerificationStatus("failure");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div>
            <h1>이메일 인증 처리 중...</h1>
            <p>잠시만 기다려주세요.</p>
          </div>
        );
      case "success":
        return (
          <div>
            <h1>이메일 인증 성공!</h1>
            <p>이메일 인증이 성공적으로 완료되었습니다. 이 창을 닫아주세요.</p>
            <button onClick={() => window.close()} className="close-button">
              창 닫기
            </button>
          </div>
        );
      case "failure":
        return (
          <div>
            <h1>이메일 인증 실패</h1>
            <p>인증에 실패했습니다. 다시 시도해주세요.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="verification-container">{renderContent()}</div>;
};

export default EmailVerificationPage;
