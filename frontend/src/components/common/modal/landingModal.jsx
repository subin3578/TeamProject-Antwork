import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useModalStore from "../../../store/modalStore";
import axios from "axios";
import { LANDING_QNA_SEARCH_URI, LANDING_QNA_URI } from "@/api/_URI";

export default function LandingModal() {
  const { isOpen, type, props, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    name: "",
    email: "",
    tempPassword: "",
    inquiryDetails: "",
    contactNumber: "",
  });

  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrivacyCheck = (e) => {
    setIsPrivacyChecked(e.target.checked);
  };

  // 문의 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPrivacyChecked) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    try {
      console.log("📄 formData:", formData);
      const response = await axios.post(`${LANDING_QNA_URI}`, formData);

      if (response.status !== 201) {
        throw new Error("문의 등록에 실패했습니다.");
      }

      console.log("문의 등록 성공:", response.data);
      alert("문의가 성공적으로 등록되었습니다.");
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("문의 등록 중 오류가 발생했습니다.");
    }
  };

  // 문의 조회
  const handleInquirySearch = async (e) => {
    e.preventDefault();
    try {
      console.log("📄 email :", formData.email);
      console.log("📄 tempPassword :", formData.tempPassword);
      const response = await axios.post(`${LANDING_QNA_SEARCH_URI}`, {
        email: formData.email,
        tempPassword: formData.tempPassword,
      });
      console.log("문의 내역 조회 성공:", response.data);

      // 관리자 여부와 문의 내역을 분리하여 전달
      navigate("/support/my", {
        state: {
          inquiries: response.data.inquiries,
          isAdmin: response.data.isAdmin,
        },
      });
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 404) {
        alert("문의하신 내역이 없습니다.");
      } else {
        alert("문의 내역 조회 중 오류가 발생했습니다.");
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  const renderContent = () => {
    console.log("Rendering content for type:", type);
    console.log("Current formData:", formData);

    switch (type) {
      case "support":
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-lg mx-4 rounded-lg shadow-xl p-8 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                문의 하기
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    회사명
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="회사명을 입력해주세요"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    업종
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="업종을 입력해주세요"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="이름"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      연락처
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="010-0000-0000"
                      pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이메일을 입력해주세요"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    임시비밀번호
                  </label>
                  <input
                    type="password"
                    id="tempPassword"
                    name="tempPassword"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="문의 내역 조회 시 필요한 비밀번호 입니다."
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="inquiryDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    문의사항
                  </label>
                  <textarea
                    id="inquiryDetails"
                    name="inquiryDetails"
                    value={formData.inquiryDetails}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="문의사항을 자세히 작성해주세요"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    checked={isPrivacyChecked}
                    onChange={handlePrivacyCheck}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="privacyConsent"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    개인정보 수집 및 이용에 동의합니다.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                >
                  문의 제출
                </button>
              </form>
            </div>
          </div>
        );
      // 문의 내역 조회 - 이메일, 패스워드
      case "inquirySearch":
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                문의 내역 조회
              </h2>

              <form onSubmit={handleInquirySearch} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    이메일
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이메일을 입력해주세요"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="tempPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    임시 비밀번호
                  </label>
                  <input
                    type="password"
                    id="tempPassword"
                    name="tempPassword"
                    value={formData.tempPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="임시 비밀번호를 입력해주세요"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                >
                  조회하기
                </button>
              </form>
            </div>
          </div>
        );
      // 문의 내역 상세 조회 모달
      case "inquiryDetail":
        console.log("Modal Data:", props); // 데이터 확인용
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl p-8 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                문의 상세 내역
              </h2>

              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    회사 정보
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium mr-2">회사명:</span>
                      {props?.companyName}
                    </p>
                    <p>
                      <span className="font-medium mr-2">업종:</span>
                      {props?.businessType}
                    </p>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    담당자 정보
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium mr-2">이름:</span>
                      {props?.name}
                    </p>
                    <p>
                      <span className="font-medium mr-2">이메일:</span>
                      {props?.email}
                    </p>
                    <p>
                      <span className="font-medium mr-2">연락처:</span>
                      {props?.contactNumber}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    문의 내용
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {props?.inquiryDetails}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    다변 내용
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">답변이 없습니다</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>모달 용이 없습니다.</div>;
    }
  };

  return renderContent();
}
