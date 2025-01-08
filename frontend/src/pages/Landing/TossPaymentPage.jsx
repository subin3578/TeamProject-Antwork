import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function TossPaymentPage() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title"); // URL에서 title 가져오기
  const price = searchParams.get("price"); // URL에서 price 가져오기

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1";
    script.async = true;
    script.onload = () => console.log("TossPayments SDK 로드 완료");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!window.TossPayments) {
      alert("결제 모듈이 로드되지 않았습니다.");
      return;
    }

    const tossPayments = window.TossPayments(
      "test_ck_oEjb0gm23PYZKJqweK14VpGwBJn5"
    );

    const amount = price ? Number(price.replace("$", "")) : 0;

    tossPayments.requestPayment("카드", {
      amount,
      orderId: `ORDER_ID_${new Date().getTime()}`,
      orderName: title || "기본 결제",
      successUrl: `${window.location.origin}/complete`,
      failUrl: `${window.location.origin}/pay`,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{title} 결제</h1>
      <p className="text-lg text-gray-600 mb-8">
        결제 금액: {price || "$0"} - 선택한 요금제로 결제를 진행하세요.
      </p>
      <button
        className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        onClick={handlePayment}
      >
        결제하기
      </button>
    </div>
  );
}
