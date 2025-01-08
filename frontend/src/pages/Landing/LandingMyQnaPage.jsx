import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LandingLayout from "../../layouts/LandingLayout";
import Modal from "../../components/Modal";
import axios from "axios";
import {
  LANDING_ANSWER_URI,
  LANDING_QNA_MODIFY_URI,
  LANDING_QNA_URI,
} from "@/api/_URI";

export default function LandingMyQnaPage() {
  const location = useLocation();
  const inquiries = location.state?.inquiries || [];
  const isAdmin = location.state?.isAdmin || false;
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: "",
    businessType: "",
    name: "",
    contactNumber: "",
    inquiryDetails: "",
  });

  const handleInquiryClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);

    setTimeout(() => {
      setEditForm({
        companyName: inquiry.companyName,
        businessType: inquiry.businessType,
        name: inquiry.name,
        contactNumber: inquiry.contactNumber,
        inquiryDetails: inquiry.inquiryDetails,
      });
      setAnswer(inquiry.answer || "");
      setIsEditing(false);
    }, 0);
  };

  const handleEditSubmit = async () => {
    try {
      const saveButton = document.querySelector('button[type="submit"]');
      if (saveButton) saveButton.disabled = true;

      const response = await axios.put(
        `${LANDING_QNA_MODIFY_URI}/${selectedInquiry.id}`,
        {
          ...editForm,
          email: selectedInquiry.email,
          tempPassword: selectedInquiry.tempPassword,
        }
      );

      if (response.status === 200) {
        alert("문의가 수정되었습니다.");
        const updatedInquiries = inquiries.map((inquiry) =>
          inquiry.id === selectedInquiry.id
            ? { ...inquiry, ...response.data }
            : inquiry
        );
        location.state.inquiries = updatedInquiries;
        setSelectedInquiry({ ...selectedInquiry, ...response.data });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error modifying inquiry:", error);
      alert("문의 수정에 실패했습니다.");
    } finally {
      const saveButton = document.querySelector('button[type="submit"]');
      if (saveButton) saveButton.disabled = false;
    }
  };

  const handleAnswerSubmit = async () => {
    try {
      console.log("Saving answer:", { id: selectedInquiry.id, answer });
      const response = await axios.post(
        `${LANDING_ANSWER_URI}/${selectedInquiry.id}`,
        {
          answer: answer,
        }
      );

      if (response.status === 200) {
        alert("답변이 저장되었습니다.");
        const updatedInquiries = inquiries.map((inquiry) =>
          inquiry.id === selectedInquiry.id
            ? {
                ...inquiry,
                answer: response.data.answer,
                answeredAt: response.data.answeredAt,
              }
            : inquiry
        );
        setIsModalOpen(false);
        location.state.inquiries = updatedInquiries;
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      alert("답변 저장에 실패했습니다.");
    }
  };

  return (
    <LandingLayout>
      <div className="flex w-[1200px] mx-auto h-screen">
        <div className="w-1/2 bg-[#A0C3F7] bg-cover flex justify-center items-center relative">
          <div className="absolute top-[80px] left-[40px] transform -translate-x-1/2 -translate-y-1/2">
            <img
              src="/images/Landing/support1.png"
              alt="Confused person"
              className="w-full h-auto max-w-[890px] max-h-[670px] object-contain mt-[57.75rem] ml-[21.5rem]"
            />
          </div>
        </div>

        <div className="w-1/2 h-auto bg-white flex flex-col justify-start items-start p-8">
          <div className="mb-[30px] flex items-center">
            <div>
              <h2 className="text-4xl text-gray-800">
                {isAdmin ? "답변 하기" : "문의 하기"}
              </h2>
              <p className="text-gray-400 mb-[2rem] mt-[20px] text-[15px]">
                {isAdmin
                  ? "문의 내역에 대한 답변을 작성할 수 있습니다."
                  : "AntWork를 이용시면서 궁금하신 점이 있으시면 언제든 물어보세요!"}
              </p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            {isAdmin ? "전체 문의 내역" : "문의 내역"}
          </h2>
          <p className="text-gray-400 mb-[2rem] mt-[20px] text-[15px]">
            {isAdmin
              ? "등록된 모든 문의 내역입니다."
              : "해당하는 email과 비밀번호로 조회하신 나의 문의내역입니다."}
          </p>
          {inquiries.length === 0 ? (
            <p className="text-gray-600 text-center mt-6">
              현재 등록된 문의 내역이 없습니다.
            </p>
          ) : (
            <InquiryTable
              inquiries={inquiries}
              onInquiryClick={handleInquiryClick}
            />
          )}
        </div>
      </div>

      {isModalOpen && selectedInquiry && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-8 w-[600px] mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              문의 상세 내역
            </h2>
            <div className="space-y-8">
              <div className="border-b pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">회사 정보</h3>
                  {!selectedInquiry.answer && !isAdmin && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {isEditing ? "취소" : "수정"}
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        회사명
                      </label>
                      <input
                        type="text"
                        value={editForm.companyName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            companyName: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        업종
                      </label>
                      <input
                        type="text"
                        value={editForm.businessType}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            businessType: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이름
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        연락처
                      </label>
                      <input
                        type="text"
                        value={editForm.contactNumber}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        문의 내용
                      </label>
                      <textarea
                        value={editForm.inquiryDetails}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            inquiryDetails: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded h-32"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleEditSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mb-3 text-lg">
                      문의 ID: {selectedInquiry.id}
                    </p>
                    <p className="mb-3 text-lg">
                      회사명: {selectedInquiry.companyName}
                    </p>
                    <p className="text-lg">
                      업종: {selectedInquiry.businessType}
                    </p>
                  </>
                )}
              </div>
              <div className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-4">담당자 정보</h3>
                <p className="mb-3 text-lg">이름: {selectedInquiry.name}</p>
                <p className="mb-3 text-lg">이메일: {selectedInquiry.email}</p>
                <p className="text-lg">
                  연락처: {selectedInquiry.contactNumber}
                </p>
              </div>
              {!isEditing && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">문의 내역</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm text-gray-500">
                        작성일:{" "}
                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap text-lg">
                      {selectedInquiry.inquiryDetails}
                    </p>
                  </div>
                </div>
              )}
              {!isEditing && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">답변 내용</h3>
                  {isAdmin && !selectedInquiry.answer ? (
                    <div className="space-y-4">
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full p-4 border rounded-lg h-32"
                        placeholder="답변을 입력하세요"
                      />
                      <button
                        onClick={handleAnswerSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        답변 저장
                      </button>
                    </div>
                  ) : (
                    <div>
                      {selectedInquiry.answer ? (
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-gray-500">답변 완료</p>
                            <p className="text-sm text-gray-500">
                              답변일:{" "}
                              {selectedInquiry.answeredAt
                                ? new Date(
                                    selectedInquiry.answeredAt
                                  ).toLocaleString()
                                : "답변 시간 정보 없음"}
                            </p>
                          </div>
                          <p className="whitespace-pre-wrap text-lg">
                            {selectedInquiry.answer}
                          </p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap bg-yellow-50 p-6 rounded-lg text-lg text-yellow-800">
                          답변 대기중입니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </LandingLayout>
  );
}

const InquiryTable = ({ inquiries, onInquiryClick }) => (
  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
    <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
      <tr>
        <th className="py-3 px-6 text-left" style={{ width: "110px" }}>
          회사명
        </th>
        <th className="py-3 px-6 text-left" style={{ width: "90px" }}>
          업종
        </th>
        <th className="py-3 px-6 text-left" style={{ width: "90px" }}>
          이름
        </th>
        <th className="py-3 px-6 text-left">문의사항</th>
        <th className="py-3 px-6 text-center" style={{ width: "90px" }}>
          답변상태
        </th>
      </tr>
    </thead>
    <tbody className="text-gray-600 text-sm font-light">
      {inquiries.map((inquiry, index) => (
        <tr
          key={index}
          className="border-b border-gray-200 hover:bg-gray-100 transition cursor-pointer"
          onClick={() => onInquiryClick(inquiry)}
        >
          <td className="py-3 px-6">{inquiry.companyName}</td>
          <td className="py-3 px-6">{inquiry.businessType}</td>
          <td className="py-3 px-6">{inquiry.name}</td>
          <td className="py-3 px-6">
            {inquiry.inquiryDetails.length > 40
              ? `${inquiry.inquiryDetails.substring(0, 40)}...`
              : inquiry.inquiryDetails}
          </td>
          <td className="py-3 px-6 text-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                inquiry.answer
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {inquiry.answer ? "답변완료" : "답변대기"}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
