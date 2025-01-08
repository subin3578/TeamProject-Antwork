import { createVacationRequest } from "@/api/approvalAPI";
import { fetchUsersByCompanyAndPosition } from "@/api/userAPI";
import useAuthStore from "@/store/AuthStore";
import { useEffect } from "react";
import { useState } from "react";

export default function Vacation() {
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("연차 신청서"); // 제목 기본값 설정
  const [dragActive, setDragActive] = useState(false);
  const [todayDate, setTodayDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("연차"); // 기본값 연차
  const [requestedDays, setRequestedDays] = useState(0);
  const [halfDay, setHalfDay] = useState(""); // 반차 선택값
  const [approver, setApprover] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const companyId = user?.company;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // 오늘 날짜 가져오기
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    setTodayDate(formattedDate);
  }, []);

  // 대표이사 조회
  useEffect(() => {
    const fetchApprover = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUsersByCompanyAndPosition(
          companyId,
          "대표이사"
        );
        if (response && response.length > 0) {
          setApprover(response[0]);
        } else {
          setApprover(null);
        }
      } catch (error) {
        console.error("Error fetching approver:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) fetchApprover();
  }, [companyId]);

  // 연차 신청일 계산
  useEffect(() => {
    if (leaveType === "반차") {
      setRequestedDays(0.5);
      setEndDate(startDate); // 반차는 시작일과 종료일이 동일
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        alert("시작일은 종료일보다 이전이어야 합니다.");
        setEndDate("");
        return;
      }

      // 날짜 차이 계산
      const diffDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
      );
      setRequestedDays(diffDays);
    }
  }, [startDate, endDate, leaveType]);

  // 드롭다운 변경 시 제목 업데이트
  const handleLeaveTypeChange = (value) => {
    setRequestedDays(0);
    setEndDate(startDate);
    setLeaveType(value);
    setTitle(`${value} 신청서`);
  };

  // 휴가 신청
  const handleSubmit = async () => {
    if (!title) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 입력하세요.");
      return;
    }

    if (new Date(startDate) < new Date(todayDate)) {
      alert("휴가는 오늘 이후 날짜부터 신청 가능합니다.");
      return;
    }

    if (requestedDays <= 0) {
      alert("신청 연차를 입력하세요.");
      return;
    }

    if (requestedDays > (user?.annualLeaveTotal ?? 0)) {
      alert("잔여 연차를 초과할 수 없습니다.");
      return;
    }

    const requestData = {
      userId: user.id,
      userName: user.name,
      department: user.department,
      title,
      companyName: user.companyName,
      startDate,
      endDate,
      annualLeaveRequest: requestedDays,
      type: leaveType,
      approver: { id: approver?.id },
      halfDay: leaveType === "반차" ? halfDay : null, // 반차 여부 저장
    };

    // FormData를 handleSubmit에서 생성
    const formData = new FormData();
    formData.append(
      "formData",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );
    if (selectedFile) {
      formData.append("proofFile", selectedFile, selectedFile.name);
    }

    try {
      // FormData를 그대로 전달
      const response = await createVacationRequest(formData);
      alert("휴가 신청이 완료되었습니다.");
      console.log("Response:", response);
    } catch (error) {
      console.error("Error in vacation request:", error);
      alert(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-white shadow-md px-6 py-4 flex border-b items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">휴가신청서</h1>
        <div className="flex items-center space-x-3">
          <button
            className="flex items-center px-3 py-2 bg-blue-100 rounded-md text-blue-700 hover:bg-blue-200"
            onClick={handleSubmit}
          >
            📝 <span className="ml-2">결재요청</span>
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">
            💾 <span className="ml-2">임시저장</span>
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">
            👁️ <span className="ml-2">미리보기</span>
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">
            ❌ <span className="ml-2">취소</span>
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">
            ℹ️ <span className="ml-2">결재 정보</span>
          </button>
        </div>
      </div>

      <div className="flex flex-grow">
        {/* 메인 컨텐츠 */}
        <div className="flex-grow bg-white shadow-lg p-8">
          {/* 제목 */}
          <h2 className="text-xl font-semibold mb-6 text-center border-b-2 pb-4 border-gray-300">
            연차 신청서
          </h2>

          <div className="flex mb-6 ">
            {/* 신청자 정보 */}
            <section className="flex-grow flex items-center ">
              <table className="w-[300px] h-full border border-gray-300 text-sm text-center">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                      기안자
                    </td>
                    <td className="p-2 align-middle">{user?.name || "OOO"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                      기안부서
                    </td>
                    <td className="p-2 align-middle">
                      {user?.companyName || "OOO"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                      기안일
                    </td>
                    <td className="p-2 align-middle">{todayDate}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-gray-100 font-medium text-gray-700 align-middle">
                      문서번호
                    </td>
                    <td className="p-2 align-middle">2024-001</td>
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
                {/* 대표이사 정보 표시 */}
                {isLoading ? (
                  <p className="text-gray-500">로딩 중...</p>
                ) : approver ? (
                  <p className="text-gray-700">{approver.name}</p>
                ) : (
                  <p className="text-gray-500">정보 없음</p>
                )}
              </div>
              <div className="border-t border-gray-300 py-6"></div>
            </section>
          </div>

          {/* 휴가 정보 */}
          <section className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="leaveType"
                  className="block text-gray-600 font-medium mb-2"
                >
                  휴가 종류
                </label>
                <select
                  id="leaveType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={leaveType}
                  onChange={(e) => handleLeaveTypeChange(e.target.value)}
                >
                  <option value="연차">연차</option>
                  <option value="반차">반차</option>
                  <option value="병가">병가</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-gray-600 font-medium mb-2"
                >
                  시작일
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              {leaveType !== "반차" && (
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-gray-600 font-medium mb-2"
                  >
                    종료일
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </section>

          {leaveType === "반차" && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                반차 여부
              </h3>
              <div className="flex items-center gap-4">
                <label>
                  <input
                    type="radio"
                    name="halfDay"
                    value="start"
                    className="mr-2 accent-blue-500"
                    checked={halfDay === "start"}
                    onChange={(e) => setHalfDay(e.target.value)}
                  />
                  오전
                </label>
                <label>
                  <input
                    type="radio"
                    name="halfDay"
                    value="end"
                    className="mr-2 accent-blue-500"
                    checked={halfDay === "end"}
                    onChange={(e) => setHalfDay(e.target.value)}
                  />
                  오후
                </label>
              </div>
            </section>
          )}

          {/* 연차 일수 */}
          <section className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="remainingDays"
                  className="block text-gray-600 font-medium mb-2"
                >
                  잔여 연차
                </label>
                <input
                  type="number"
                  id="remainingDays"
                  value={user?.annualLeaveTotal ?? 0}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="requestedDays"
                  className="block text-gray-600 font-medium mb-2"
                >
                  신청 연차
                </label>
                <input
                  type="number"
                  id="requestedDays"
                  value={requestedDays}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>
            </div>
            {user?.annualLeaveTotal !== undefined && (
              <p className="mt-2 text-sm text-red-500">
                ⚠️ 신청 가능한 일수를 초과하였습니다.
              </p>
            )}
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              파일 첨부
            </h3>
            <div
              className={`border border-gray-300 rounded-md p-4 ${
                dragActive ? "bg-gray-100" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileUpload"
                className="text-gray-500 text-sm cursor-pointer"
              >
                {selectedFile
                  ? `파일: ${selectedFile.name} (${(
                      selectedFile.size / 1024
                    ).toFixed(2)} KB)`
                  : "이 곳에 파일을 드래그 하세요. 또는 파일선택"}
              </label>
            </div>
          </section>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="w-64 bg-white border-l border-gray-300 p-8">
          <h3 className="text-xl font-semibold mb-6 text-center border-b-2 pb-4 border-gray-300">
            결재선
          </h3>
          <div className="space-y-4">
            {approver ? (
              <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={
                      approver.profileImageUrl ||
                      "https://via.placeholder.com/48"
                    }
                    alt={`${approver.name} 사진`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{approver.name}</p>
                  <p className="text-sm text-gray-500">{approver.position}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs text-white bg-blue-500 rounded">
                    승인 대기
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-center text-gray-500">
                결재자 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
