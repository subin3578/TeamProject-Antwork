import React, { useEffect } from "react";
import useModalStore from "./../../../store/modalStore";

export default function TermsModal() {
  const { isOpen, type, props, closeModal, updateProps } = useModalStore();

  // 상태 변경 감지
  useEffect(() => {
    console.log("Modal Props Updated:", JSON.stringify(props));
  }, [props]); // props 변경 감지

  if (!isOpen || type !== "terms") return null;

  const handleAgree = () => {
    if (props && props.onAgree) {
      props.onAgree(type); // 부모 컴포넌트의 콜백 함수 호출
    }
    closeModal(); // 모달 닫기
  };

  const renderContent = () => {
    switch (type) {
      case "terms":
        return (
          <div id="termsModal" className="modal">
            <div className="modal-content">
              <span id="closeModalBtn" className="close">
                &times;
              </span>
              <h2>서비스 이용 약관</h2>
              <div id="modal_main">
                알려진 바와 같이 당신의 개인정보 네트워크와 내용입니다. 당신의
                이름과 연락처 정보가 포함되어 있습니다. 당신의 개인정보는
                안전하게 보호됩니다.알려진 바와 같이 당신의 개인정보 네트워크와
                내용입니다. 알려진 바와 같이 당신의 개인정보 네트워크와
                내용입니다. 당신의 이름과 연락처 정보가 포함되어 있습니다.
                당신의 개인정보는 안전하게 보호됩니다.알려진 바와 같이 당신의
                개인정보 네트워크와 내용입니다. 알려진 바와 같이 당신의 개인정보
                네트워크와 내용입니다. 당신의 이름과 연락처 정보가 포함되어
                있습니다. 당신의 개인정보는 안전하게 보호됩니다.알려진 바와 같이
                당신의 개인정보 네트워크와 내용입니다.
              </div>
              <button className="modal_check" onClick={handleAgree}>
                <i>&#x2713;&nbsp;&nbsp;</i> 동의하기
              </button>
            </div>
          </div>
        );
      default:
        return <div>모달 내용이 없습니다.</div>;
    }
  };

  return renderContent();
}
