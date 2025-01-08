import React, { useEffect, useState } from "react";
import { fetchApprovalRequests, fetchApprovalDetails } from "@/api/approvalAPI";
import useAuthStore from "@/store/AuthStore";
import ApprovalModal from "@/components/common/modal/approvalModal";
import useModalStore from "@/store/modalStore";

export default function MyApproval() {
  const user = useAuthStore((state) => state.user);
  const { openModal, isOpen } = useModalStore();
  const [approvals, setApprovals] = useState([]);
  const [filters, setFilters] = useState({
    type: "전체",
    status: "전체",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadApprovals = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const response = await fetchApprovalRequests(user.id, page - 1, filters);
      setApprovals(response.data || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("결재 데이터 가져오기 실패:", error);
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    loadApprovals();
  }, [page, filters]);

  const handleSearch = () => setPage(1);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">기안문서</h1>

      {/* 필터 영역 */}
      <div className="bg-white shadow p-4 rounded-md mb-6 flex items-center gap-4">
        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option>전체</option>
          <option>출장신청서</option>
          <option>휴가신청서</option>
          <option>여비신청서</option>
        </select>
        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option>전체</option>
          <option>승인</option>
          <option>반려</option>
          <option>대기</option>
        </select>
        <input
          type="text"
          placeholder="검색 제목"
          className="border border-gray-300 rounded-md px-3 py-2 flex-grow"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          검색
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className="bg-white shadow p-4 rounded-md">
        {isLoading ? (
          <p className="text-center text-gray-600">로딩 중...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">No</th>
                <th className="border border-gray-300 p-2">문서유형</th>
                <th className="border border-gray-300 p-2">제목</th>
                <th className="border border-gray-300 p-2">작성자</th>
                <th className="border border-gray-300 p-2">작성일자</th>
                <th className="border border-gray-300 p-2">결재자</th>
                <th className="border border-gray-300 p-2">상태</th>
                <th className="border border-gray-300 p-2">보기</th>
              </tr>
            </thead>
            <tbody>
              {approvals.length > 0 ? (
                approvals.map((approval, index) => (
                  <tr key={approval.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-center">
                      {index + 1 + (page - 1) * 10}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {approval.type}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {approval.title}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {approval.userName}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {approval.approvalDate}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {approval.approver || "미지정"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${
                          approval.status === "승인"
                            ? "bg-green-100 text-green-600"
                            : approval.status === "반려"
                            ? "bg-red-100 text-red-600"
                            : approval.status === "대기"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {approval.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => handleOpenModal(approval.id)}
                        className="text-blue-500 underline"
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="border border-gray-300 p-4 text-center text-gray-500"
                  >
                    문서가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

       {/* 페이지네이션 */}
       <div className="mt-4 flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
        >
          처음
        </button>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
        >
          이전
        </button>
        <span className="px-4">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
        >
          다음
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
        >
          마지막
        </button>
      </div>


      {/* 모달 */}
      {isOpen && <ApprovalModal />}
    </div>
  );
}
