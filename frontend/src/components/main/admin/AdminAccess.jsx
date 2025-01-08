import { fetchAccessLogs } from "@/api/accessAPI";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

export default function AdminAccess() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageGroup, setPageGroup] = useState(0); // 페이지 그룹 상태

  useEffect(() => {
    loadLogs();
  }, [currentPage, pageSize]);

  const loadLogs = async () => {
    try {
      const data = await fetchAccessLogs(searchTerm, currentPage, pageSize);
      setLogs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading logs:", error);
      alert(error.message); // 오류 메시지를 사용자에게 표시
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadLogs();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1); // 사용자 UI는 1부터 표시, 내부는 0 기반
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const parseDateTime = (localDateTime) => {
    if (!localDateTime) return "Invalid Date";

    const dateTimeString = Array.isArray(localDateTime)
      ? `${localDateTime[0]}-${localDateTime[1]
          .toString()
          .padStart(2, "0")}-${localDateTime[2].toString().padStart(2, "0")}T` +
        `${localDateTime[3].toString().padStart(2, "0")}:${localDateTime[4]
          .toString()
          .padStart(2, "0")}:${localDateTime[5].toString().padStart(2, "0")}`
      : localDateTime;

    return new Date(dateTimeString);
  };

  return (
    <article className="page-list">
      {/* 헤더 */}
      <div className="content-header">
        <h1>접근 로그</h1>
        <p className="!mb-5">멤버 접근 로그를 관리하는 페이지입니다.</p>
      </div>

      {/* 검색 및 페이지 설정 */}
      <section className="mb-4 mx-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="사용자 ID, URL 경로 검색"
              className="border border-gray-300 rounded py-2 px-4 mr-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              검색
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">페이지당</span>
            <select
              className="border border-gray-300 rounded mx-2"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-gray-600">개</span>
          </div>
        </div>
      </section>

      {/* 로그 테이블 */}
      <section className="h-[800px] overflow-auto mx-4">
        <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">사용자</th>
              <th className="py-3 px-6 text-left">IP 주소</th>
              <th className="py-3 px-6 text-left">URL</th>
              <th className="py-3 px-6 text-left">HTTP 메소드</th>
              <th className="py-3 px-6 text-left">접근 시간</th>
              <th className="py-3 px-6 text-left">메서드 설명</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{log.userId}</td>
                  <td className="py-3 px-6">{log.ipAddress}</td>
                  <td className="py-3 px-6">{log.urlPath}</td>
                  <td className="py-3 px-6">{log.httpMethod}</td>
                  <td className="py-3 px-6">
                    {parseDateTime(log.accessTime).toLocaleString()}
                  </td>

                  <td className="py-3 px-6">{log.methodDescription}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  로그가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        {/* 페이지네이션 */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          {/* 처음으로 이동 */}
          {currentPage > 0 && (
            <button
              onClick={() => {
                setPageGroup(0);
                handlePageChange(1);
              }}
              className="text-gray-700 py-2 px-3 rounded hover:bg-gray-100"
            >
              «
            </button>
          )}

          {/* 이전 그룹 */}
          {pageGroup > 0 && (
            <button
              onClick={() => setPageGroup(pageGroup - 1)}
              className="text-gray-700 py-2 px-3 rounded hover:bg-gray-100"
            >
              ‹
            </button>
          )}

          {/* 페이지 번호 */}
          {Array.from(
            { length: Math.min(10, totalPages - pageGroup * 10) },
            (_, index) => pageGroup * 10 + index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`py-2 px-3 rounded ${
                currentPage === pageNumber - 1
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          {/* 다음 그룹 */}
          {totalPages > (pageGroup + 1) * 10 && (
            <button
              onClick={() => setPageGroup(pageGroup + 1)}
              className="text-gray-700 py-2 px-3 rounded hover:bg-gray-100"
            >
              ›
            </button>
          )}

          {/* 마지막으로 이동 */}
          {currentPage < totalPages - 1 && (
            <button
              onClick={() => {
                setPageGroup(Math.floor((totalPages - 1) / 10));
                handlePageChange(totalPages);
              }}
              className="text-gray-700 py-2 px-3 rounded hover:bg-gray-100"
            >
              »
            </button>
          )}
        </div>
      </section>
    </article>
  );
}
