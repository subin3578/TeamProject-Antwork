import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
} from "date-fns";
import useAuthStore from "@/store/AuthStore";
import { getAttendanceData } from "@/api/attendanceAPI";

export default function AdminAttendance() {
  const user = useAuthStore((state) => state.user);
  const [filter, setFilter] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  // Helper to format time into 'HH:mm'
  const formatToHHmm = (time) => {
    if (!time || time === "-") return "-";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  // Weekly record processing
  const processWeeklyRecords = (weeklyRecords = []) => {
    return weeklyRecords.map((record) => ({
      ...record,
      checkIn: formatToHHmm(record.checkIn),
      checkOut: formatToHHmm(record.checkOut),
    }));
  };

  // Generate weekly dates
  const getWeeklyDates = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).map((date) =>
      format(date, "MM-dd (E)")
    );
  };

  // Monthly record processing
  const processMonthlyRecords = (monthlyRecords = []) => {
    return monthlyRecords.map((weekRecord) => ({
      total: weekRecord.total || "-",
      basic: weekRecord.basic || "-",
      overtime: weekRecord.overtime || "-",
      night: weekRecord.night || "-",
    }));
  };

  // Generate monthly weeks
  const getMonthlyWeeks = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const weeks = [];
    let current = startOfWeek(start, { weekStartsOn: 1 });

    while (current <= end) {
      const weekStart = current;
      const weekEnd = endOfWeek(current, { weekStartsOn: 1 });
      weeks.push(`${format(weekStart, "MM-dd")} ~ ${format(weekEnd, "MM-dd")}`);
      current = addWeeks(current, 1);
    }

    return weeks;
  };

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    if (!user?.company) return;
    setLoading(true);

    const startDate =
      filter === "weekly"
        ? format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd")
        : format(startOfMonth(currentDate), "yyyy-MM-dd");
    const endDate =
      filter === "weekly"
        ? format(endOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd")
        : format(endOfMonth(currentDate), "yyyy-MM-dd");

    try {
      const response = await getAttendanceData(
        user.company,
        startDate,
        endDate,
        filter,
        currentPage - 1,
        itemsPerPage
      );

      const processedData = response.content.map((record) => ({
        ...record,
        weeklyRecords:
          filter === "weekly" ? processWeeklyRecords(record.weeklyRecords) : [],
        monthlyRecords:
          filter === "monthly"
            ? processMonthlyRecords(record.monthlyRecords)
            : [],
      }));

      setAttendanceData(processedData || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset state and fetch data when filters or pagination change
  useEffect(() => {
    setAttendanceData([]); // Clear stale data on filter change
    fetchAttendanceData();
  }, [currentDate, filter, currentPage]);

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Filter data based on search and department selection
  const filteredData = attendanceData.filter(
    (record) =>
      record.name.includes(searchTerm) &&
      (selectedDepartment === "" ||
        record.departmentName === selectedDepartment)
  );

  // Navigation handlers
  const handlePrev = () => {
    if (filter === "weekly") {
      setCurrentDate((prev) => subWeeks(prev, 1));
    } else if (filter === "monthly") {
      setCurrentDate((prev) => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (filter === "weekly") {
      setCurrentDate((prev) => addWeeks(prev, 1));
    } else if (filter === "monthly") {
      setCurrentDate((prev) => addMonths(prev, 1));
    }
  };

  const getCurrentPeriod = () => {
    if (filter === "weekly") {
      const start = format(
        startOfWeek(currentDate, { weekStartsOn: 1 }),
        "yyyy-MM-dd"
      );
      const end = format(
        endOfWeek(currentDate, { weekStartsOn: 1 }),
        "yyyy-MM-dd"
      );
      return `${start} ~ ${end}`;
    } else if (filter === "monthly") {
      const start = format(startOfMonth(currentDate), "yyyy-MM");
      return start;
    }
  };
  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-gray-800">
          🕒&nbsp;&nbsp;근태 관리
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFilter("weekly");
              setCurrentPage(1);
            }}
            className={`relative px-6 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out shadow-md focus:outline-none ${
              filter === "weekly"
                ? "bg-gray-600 text-white hover:bg-gray-700 ring-2 ring-gray-400 ring-offset-1"
                : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 hover:shadow-inner"
            }`}
          >
            주간
          </button>
          <button
            onClick={() => {
              setFilter("monthly");
              setCurrentPage(1);
            }}
            className={`relative px-6 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out shadow-md focus:outline-none ${
              filter === "monthly"
                ? "bg-gray-600 text-white hover:bg-gray-700 ring-2 ring-gray-400 ring-offset-1"
                : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 hover:shadow-inner"
            }`}
          >
            월간
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex items-center justify-between my-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="이름 검색"
          className="block w-60 px-4 py-2 text-sm border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Department Dropdown */}
        <select
          className="block w-40 px-4 py-2 text-sm border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">전체 부서</option>
          <option value="개발팀">개발팀</option>
          <option value="디자인팀">디자인팀</option>
          <option value="인사팀">인사팀</option>
          <option value="마케팅팀">마케팅팀</option>
        </select>
      </div>
      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 text-gray-700 my-4">
        <button
          onClick={handlePrev}
          className="text-gray-600 hover:text-gray-800 transition focus:outline-none text-2xl px-3"
        >
          &lt;
        </button>
        <span className="text-xl font-semibold text-gray-700">
          {getCurrentPeriod()}
        </span>
        <button
          onClick={handleNext}
          className="text-gray-600 hover:text-gray-800 transition focus:outline-none text-2xl px-3"
        >
          &gt;
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 bg-white shadow-lg overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-gray-500">로딩 중...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-center text-gray-600 font-semibold">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold">
                  누적 근무시간
                </th>
                {filter === "weekly" &&
                  getWeeklyDates().map((date) => <th key={date}>{date}</th>)}
                {filter === "monthly" &&
                  getMonthlyWeeks().map((week, i) => <th key={i}>{week}</th>)}
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    {/* 사용자 정보 */}
                    <td className="px-6 py-4 text-gray-800 flex items-center gap-4">
                      <img
                        src={record.profileImage}
                        alt={`${record.name} 프로필`}
                        className="w-12 h-12 rounded-full border"
                      />
                      <div>
                        <p className="font-medium">{record.name}</p>
                        <p className="text-sm text-gray-500">
                          {record.position}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.departmentName}
                        </p>
                      </div>
                    </td>

                    {/* 누적 근무시간 */}
                    <td className="px-6 py-4 text-gray-800">
                      <p className="font-medium">
                        {record.totalWorkHours || "-"}
                      </p>
                    </td>

                    {/* 주간 데이터 */}
                    {filter === "weekly" &&
                      getWeeklyDates().map((date, i) => {
                        const dayRecord = record?.weeklyRecords?.[i];
                        return (
                          <td
                            key={i}
                            className="px-4 py-4 text-center text-gray-800 border-l"
                          >
                            {dayRecord &&
                            dayRecord.checkIn &&
                            dayRecord.checkOut ? (
                              <>
                                <p>
                                  {dayRecord.checkIn} ~ {dayRecord.checkOut}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {dayRecord.workTime}
                                </p>
                              </>
                            ) : (
                              <p>-</p>
                            )}
                          </td>
                        );
                      })}

                    {/* 월간 데이터 */}
                    {filter === "monthly" &&
                      getMonthlyWeeks().map((week, i) => {
                        const weekRecord = record?.monthlyRecords?.[i];
                        return (
                          <td
                            key={i}
                            className="px-4 py-4 text-center text-gray-800 border-l"
                          >
                            {weekRecord ? (
                              <>
                                <p>{weekRecord.total}</p>
                                <p className="text-xs text-gray-500">
                                  기본: {weekRecord.basic}
                                </p>
                                <p className="text-xs text-gray-500">
                                  연장: {weekRecord.overtime}
                                </p>
                                <p className="text-xs text-gray-500">
                                  야간: {weekRecord.night}
                                </p>
                              </>
                            ) : (
                              <p>-</p>
                            )}
                          </td>
                        );
                      })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      filter === "weekly"
                        ? getWeeklyDates().length + 2
                        : getMonthlyWeeks().length + 2
                    }
                    className="text-center py-4 text-gray-500"
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-3 border-t">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            이전
          </button>
          <div className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
