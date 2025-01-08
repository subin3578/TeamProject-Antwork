import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FileTextIcon,
  CreditCardIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
} from "lucide-react";
import useAuthStore from "@/store/AuthStore";
import {
  fetchApprovalDetails,
  fetchApprovalRequestsByApprover,
  updateApprovalStatus,
} from "@/api/approvalAPI";
import ApprovalModal from "@/components/common/modal/approvalModal";
import useModalStore from "@/store/modalStore";

export default function AdminApproval() {
  const user = useAuthStore((state) => state.user); // Approver ID 가져오기
  const { openModal, isOpen } = useModalStore();
  const [filter, setFilter] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApprovalRequestsByApprover(
          user?.id,
          filter === "전체" ? null : filter,
          typeFilter === "전체" ? null : typeFilter,
          currentPage - 1, // 백엔드는 0-based pagination
          itemsPerPage
        );

        setApprovalRequests(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error loading approval requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadRequests();
    }
  }, [user?.id, filter, typeFilter, currentPage]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "출장":
        return <CreditCardIcon className="h-5 w-5 text-blue-600" />;
      case "휴가":
        return <CalendarIcon className="h-5 w-5 text-green-600" />;
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "대기":
        return <ClockIcon className="h-4 w-4 mr-1 text-blue-600" />;
      case "승인":
        return <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />;
      case "반려":
        return <XCircleIcon className="h-4 w-4 mr-1 text-red-600" />;
      default:
        return null;
    }
  };

  const handleApprovalAction = async (id, action) => {
    try {
      const result = await updateApprovalStatus(id, action);
      alert(`${action} 처리되었습니다.`);
      // 리스트 갱신
      setApprovalRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === id ? { ...req, status: action } : req
        )
      );
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const handleOpenModal = async (id) => {
    try {
      console.log("아이디" + id);
      const approvalDetails = await fetchApprovalDetails(id);
      console.log("dd" + approvalDetails);
      openModal("approval", { selectedApproval: approvalDetails });
    } catch (error) {
      console.error("모달 열기 실패:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredRequests =
    filter === "전체"
      ? approvalRequests
      : approvalRequests.filter((request) => request.status === filter);
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">전자결재 관리</h1>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="전체">전체 상태</option>
            <option value="대기">대기 중</option>
            <option value="승인">승인됨</option>
            <option value="반려">반려됨</option>
          </select>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-6 flex flex-col flex-grow">
        <div className="flex-grow bg-white border border-gray-200 rounded-lg shadow-md flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              결재 요청 목록
            </h2>
          </div>

          <div className="flex-grow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청자
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    부서
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상세보기
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center text-sm">
                      <div className="flex items-center">
                        {getTypeIcon(request.type)}
                        <span className="ml-2 text-gray-600">
                          {request.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {request.title}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {request.userName}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {request.department}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {request.approvalDate}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {getStatusIcon(request.status)}
                      {request.status}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {request.status === "대기" ? (
                        <div className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            onClick={() =>
                              handleApprovalAction(request.id, "승인")
                            }
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-l-md text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            승인
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleApprovalAction(request.id, "반려")
                            }
                            className="-ml-px inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            반려
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center rounded-md">
                          <button
                            disabled
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-l-md text-gray-500 bg-gray-100 cursor-not-allowed"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            승인
                          </button>
                          <button
                            disabled
                            className="-ml-px inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-r-md text-gray-500 bg-gray-100 cursor-not-allowed"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            반려
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenModal(request.id)}
                        className="text-blue-600 hover:underline"
                      >
                        <EyeIcon className="inline h-5 w-5 mr-1" />
                        보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              총 {filteredRequests.length}개 중 {indexOfFirstItem + 1}-{" "}
              {Math.min(indexOfLastItem, filteredRequests.length)}개 표시
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              해당 상태의 결재 요청이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {isOpen && <ApprovalModal />}
    </div>
  );
}
