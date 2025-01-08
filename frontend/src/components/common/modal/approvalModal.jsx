import React from "react";
import useModalStore from "@/store/modalStore";

const ApprovalModal = () => {
  const { props, closeModal } = useModalStore();
  const { selectedApproval } = props;

  if (!selectedApproval) return null;

  const { type, companyName, submissionDate, approver, status, ...details } =
    selectedApproval;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md max-w-3xl w-full">
        {/* 모달 헤더 */}
        <div className="bg-white shadow-md px-6 py-4 flex border-b items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{type} 상세 정보</h1>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            닫기
          </button>
        </div>

        <div className="flex flex-grow">
          <div className="flex-grow bg-white shadow-lg p-8">
            {/* 제목 */}
            <h2 className="text-xl font-semibold mb-6 text-center border-b-2 pb-4 border-gray-300">
              {type} 상세 정보
            </h2>

            {/* 기본 정보 */}
            <div className="flex mb-6">
              <section className="flex-grow flex items-center">
                <table className="w-[300px] h-full border border-gray-300 text-sm text-center">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                        기안자
                      </td>
                      <td className="p-2 align-middle">{details.userName}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                        기안부서
                      </td>
                      <td className="p-2 align-middle">{companyName}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                        제출일자
                      </td>
                      <td className="p-2 align-middle">
                        {details.approvalDate}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                        승인일자
                      </td>
                      <td className="p-2 align-middle">
                        {submissionDate || "미승인"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* 승인 영역 */}
              <section className="w-48 border border-gray-300 ml-6 text-center">
                <div className="bg-gray-100 text-sm font-medium text-gray-700 py-2">
                  승인
                </div>
                <div className="border-t border-gray-300 py-4">
                  <p className="text-gray-700 font-medium">대표이사</p>
                </div>
                <div className="border-t border-gray-300 py-4">
                  <p className="text-gray-700">
                    {details.approverName || "미지정"}
                  </p>
                </div>
                {status === "승인" && (
                  <div className="border-t border-gray-300 py-1">
                    <img
                      src="/images/Antwork/admin/승인 이미지.png"
                      alt="Approved"
                      className="w-[80px] h-[50px] mx-auto mt-2"
                    />
                  </div>
                )}
                {status === "반려" && (
                  <div className="border-t border-gray-300 py-1">
                    <img
                      src="/images/Antwork/admin/반려이미지.jpg"
                      alt="Approved"
                      className="w-[80px] h-[50px] mx-auto mt-2"
                    />
                  </div>
                )}
              </section>
            </div>

            {/* 상세 정보 */}
            {type === "출장신청" && (
              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-4">출장 상세 정보</h3>
                <table className="w-full border border-gray-300 text-sm">
                  <tbody>
                    {/* 제목 */}
                    <tr className="border-b">
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        제목
                      </td>
                      <td className="p-3">{details.title || "N/A"}</td>
                    </tr>

                    {/* 소속 */}
                    <tr className="border-b">
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        소속
                      </td>
                      <td className="p-3">{details.organization || "N/A"}</td>
                    </tr>

                    {/* 성명 */}
                    <tr className="border-b">
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        성명
                      </td>
                      <td className="p-3">{details.userName || "N/A"}</td>
                    </tr>

                    {/* 출장 목적 */}
                    <tr className="border-b">
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        출장 목적
                      </td>
                      <td className="p-3">{details.purpose || "N/A"}</td>
                    </tr>

                    {/* 출장 기간 */}
                    <tr className="border-b">
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        출장 기간
                      </td>
                      <td className="p-3">
                        {details.startDate} ~ {details.endDate}
                      </td>
                    </tr>

                    {/* 출장 경비 */}
                    <tr>
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        출장 경비
                      </td>
                      <td className="p-3">{details.budget || 0} 원</td>
                    </tr>
                  </tbody>
                </table>

                {/* 방문 일정 */}
                <h3 className="text-lg font-semibold mb-4 mt-6">방문 일정</h3>
                <table className="w-full border border-gray-300 text-sm text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">날짜</th>
                      <th className="p-2">방문 회사</th>
                      <th className="p-2">부서</th>
                      <th className="p-2">담당자</th>
                      <th className="p-2">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.schedules && details.schedules.length > 0 ? (
                      details.schedules.map((schedule, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{schedule.date || "N/A"}</td>
                          <td className="p-2">{schedule.company || "N/A"}</td>
                          <td className="p-2">
                            {schedule.department || "N/A"}
                          </td>
                          <td className="p-2">{schedule.contact || "N/A"}</td>
                          <td className="p-2">{schedule.note || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-2 text-gray-500">
                          방문 일정이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            )}

            {type === "휴가신청" && (
              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-4">휴가 상세 정보</h3>
                <table className="w-full border border-gray-300 text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        휴가 종류
                      </td>
                      <td className="p-3">{details.vacationType || "N/A"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        휴가 기간
                      </td>
                      <td className="p-3">
                        {details.startDate} ~ {details.endDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                        사용 연차
                      </td>
                      <td className="p-3">{details.annualLeaveRequest || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
