import { createBusinessTrip } from "@/api/approvalAPI";
import { fetchUsersByCompanyAndPosition } from "@/api/userAPI";
import useAuthStore from "@/store/AuthStore";
import { useEffect, useState } from "react";

export default function BusinessTrip() {
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const [todayDate, setTodayDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const companyId = user?.company;
  const [approver, setApprover] = useState(null);
  const [formData, setFormData] = useState({
    userId: user?.id || "", // 기본값 설정
    userName: user?.name || "",
    department: user?.department || "",
    companyName: user?.companyName || "",
    submissionDate: todayDate || "",
    title: "", // 출장 제목
    organization: "", // 방문 기관
    purpose: "", // 출장 목적
    startDate: "", // 출장 시작 날짜
    endDate: "", // 출장 종료 날짜
    budget: "", // 출장 경비
  });

  const [schedule, setSchedule] = useState([
    { date: "", company: "", department: "", contact: "", note: "" },
  ]);

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

  // 오늘 날짜 가져오기
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    setTodayDate(formattedDate);
  }, []);

  // 스케줄 상태 모니터링
  useEffect(() => {
    console.log("현재 스케줄 상태:", schedule);
  }, [schedule]);

  // 데이터 핸들링
  const handleInputChange = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  const addRow = () => {
    setSchedule([
      ...schedule,
      { date: "", company: "", department: "", contact: "", note: "" },
    ]);
  };

  const removeRow = (index) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 데이터 전송

  const submitRequest = async () => {
    try {
      // 요청 데이터 구성
      const requestData = {
        ...formData,
        approver: {
          id: approver?.id,
          name: approver?.name,
          position: approver?.position,
          status: "대기",
        },
        schedules: schedule.map((item) => ({
          date: item.date,
          company: item.company,
          department: item.department,
          contact: item.contact,
          note: item.note,
        })),
      };

      // createBusinessTrip API 호출
      const response = await createBusinessTrip(requestData);

      // 성공 시 처리
      alert("출장 신청이 성공적으로 저장되었습니다.");
      console.log("응답 데이터:", response);
    } catch (error) {
      // 실패 시 에러 메시지 표시
      console.error("출장 신청 중 에러:", error);
      alert(`에러 발생: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-white shadow-md px-6 py-4 flex border-b items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">출장 신청서</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={submitRequest}
            className="flex items-center px-3 py-2 bg-blue-100 rounded-md text-blue-700 hover:bg-blue-200"
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
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-grow">
        <div className="flex-grow bg-white shadow-lg p-8">
          {/* 제목 */}
          <h2 className="text-xl font-semibold mb-6 text-center border-b-2 pb-4 border-gray-300">
            출장 신청서
          </h2>

          {/* 신청자 정보 */}
          <div className="flex mb-6">
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

          {/* 출장 정보 */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              출장 정보
            </h3>
            <table className="w-full border border-gray-300 text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                    제목
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      placeholder="제목 입력"
                      className="w-full px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                    소속
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        handleFormChange("organization", e.target.value)
                      }
                      placeholder="소속 입력"
                      className="w-full px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                    성명
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder="성명 입력"
                      className="w-full px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                    기간
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleFormChange("startDate", e.target.value)
                        }
                        className="w-1/2 px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                      <span className="text-gray-600">~</span>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          handleFormChange("endDate", e.target.value)
                        }
                        className="w-1/2 px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                    출장 목적
                  </td>
                  <td className="p-3">
                    <textarea
                      value={formData.purpose}
                      onChange={(e) =>
                        handleFormChange("purpose", e.target.value)
                      }
                      placeholder="출장 목적 입력"
                      rows="2"
                      className="w-full px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="w-1/5 bg-gray-100 font-medium text-gray-700 p-3">
                    출장 경비
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        handleFormChange("budget", e.target.value)
                      }
                      placeholder="₩0"
                      className="w-full px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 방문 일정 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              방문 일정
            </h3>
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
                {schedule.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) =>
                          handleInputChange(index, "date", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.company}
                        onChange={(e) =>
                          handleInputChange(index, "company", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.department}
                        onChange={(e) =>
                          handleInputChange(index, "department", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.contact}
                        onChange={(e) =>
                          handleInputChange(index, "contact", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => removeRow(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addRow}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              + 일정 추가
            </button>
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
