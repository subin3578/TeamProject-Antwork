import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  checkInAPI,
  checkOutAPI,
  getAttendanceStatusAPI,
} from "@/api/attendanceAPI";

const AttendanceCard = ({ userId }) => {
  const [status, setStatus] = useState("AVAILABLE");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const MAX_WORK_HOURS = 9;
  const [workHours, setWorkHours] = useState("0H");
  const [progressWidth, setProgressWidth] = useState("0%");

  // API를 사용하여 초기 상태 동기화
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      setIsLoading(true);
      try {
        const data = await getAttendanceStatusAPI(userId);
        setStatus(data.status);
        setCheckInTime(data.checkInTime);
        setCheckOutTime(data.checkOutTime);
        setError(null);
        console.log("출근타임" + data.checkInTime);
        console.log("퇴근타임" + data.checkOutTime);
      } catch (err) {
        console.error("출퇴근 상태를 가져오는 중 오류 발생:", err);
        setError("출퇴근 상태를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchAttendanceStatus();
    }
  }, [userId]);

  // 현재 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const parseDateTime = (dateTime) => {
      if (!dateTime) return null; // 값이 없으면 null 반환

      try {
        // dateTime이 문자열이 아닌 경우 문자열로 변환
        const dateTimeStr =
          typeof dateTime === "string" ? dateTime : String(dateTime);

        // 쉼표로 분리하여 Date 객체 생성
        const parts = dateTimeStr.split(",");
        if (parts.length < 6) return null; // 필요한 값이 모두 없는 경우 null 반환

        const [year, month, day, hour, minute, second] = parts.map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
      } catch (error) {
        console.error("DateTime 파싱 실패:", error);
        return null;
      }
    };

    const calculateWorkProgress = () => {
      const startTime = checkInTime ? parseDateTime(checkInTime) : null;
      const endTime = checkOutTime ? parseDateTime(checkOutTime) : null;

      if (startTime && !endTime) {
        const now = new Date();
        const elapsedHours = Math.floor((now - startTime) / 3600000);
        setWorkHours(`${elapsedHours}H`);
        setProgressWidth(
          `${Math.min((elapsedHours / MAX_WORK_HOURS) * 100, 100)}%`
        );
      } else if (startTime && endTime) {
        const elapsedHours = Math.floor((endTime - startTime) / 3600000);
        setWorkHours(`${elapsedHours}H`);
        setProgressWidth(
          `${Math.min((elapsedHours / MAX_WORK_HOURS) * 100, 100)}%`
        );
      } else {
        setWorkHours("0H");
        setProgressWidth("0%");
      }
    };

    calculateWorkProgress();
  }, [checkInTime, checkOutTime]);

  const handleCheckIn = async () => {
    if (checkInTime || checkOutTime) {
      alert("이미 출근 처리되었습니다.");
      return;
    }

    try {
      const response = await checkInAPI(userId); // API 호출
      setCheckInTime(response.checkInTime); // API에서 반환된 checkInTime 설정
      setStatus("WORKING");
      alert(`출근 완료: ${formatDateTime(response.checkInTime)}`);
    } catch (error) {
      console.error("출근 처리 실패:", error);
      setError(error.message || "출근 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCheckOut = async () => {
    if (!checkInTime || checkOutTime) {
      alert("퇴근 처리할 수 없는 상태입니다.");
      return;
    }

    try {
      const response = await checkOutAPI(userId); // API 호출
      setCheckOutTime(response.checkOutTime); // API에서 반환된 checkOutTime 설정
      setStatus("COMPLETED");
      alert(`퇴근 완료: ${formatDateTime(response.checkOutTime)}`);
    } catch (error) {
      console.error("퇴근 처리 실패:", error);
      setError(error.message || "퇴근 처리 중 오류가 발생했습니다.");
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "--:--:--"; // 값이 없을 때 기본값 반환

    try {
      // dateTime이 문자열이 아니면 문자열로 변환
      const dateTimeStr =
        typeof dateTime === "string" ? dateTime : String(dateTime);

      // 쉼표로 분리하여 배열로 변환
      const parts = dateTimeStr.split(",");
      if (parts.length < 6) {
        // 필요한 부분이 모두 존재하지 않을 경우 기본값 반환
        return "--:--:--";
      }

      // 배열 값으로 Date 객체 생성
      const [year, month, day, hour, minute, second] = parts.map(Number);
      const date = new Date(year, month - 1, day, hour, minute, second);

      // Date 객체가 유효한지 확인
      if (isNaN(date.getTime())) {
        return "--:--:--";
      }

      // 날짜를 원하는 형식으로 변환
      return format(date, "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.error("날짜 변환 실패:", error);
      return "--:--:--";
    }
  };

  // 버튼 활성화 조건
  const isCheckInDisabled = !!checkInTime || !!checkOutTime;
  const isCheckOutDisabled = !!checkOutTime || !checkInTime;

  return (
    <div className="w-[260px] bg-white p-7 mt-[18px] border border-[#ddd] box-border rounded-[10px] h-[440px]">
      <div className="text-center mt-4 mb-10">
        <h1 className="text-[18px] font-semibold text-gray-800">근태관리</h1>
        <p className="text-[12.5px] text-gray-500 mt-3">
          {currentTime.toLocaleString()}
        </p>
      </div>

      <section className="mb-7">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold text-blue-600">{workHours}</span>
          <span className="text-sm text-gray-500">
            최대 {MAX_WORK_HOURS}시간
          </span>
        </div>
        <div className="relative w-full h-4 bg-gray-200 rounded-full mt-7">
          <div
            className="absolute h-4 bg-blue-500 rounded-full"
            style={{ width: progressWidth }}
          ></div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between text-gray-700">
          <span>출근시간</span>
          <span>
            {status === "AVAILABLE" || !checkInTime
              ? "기록 없음"
              : formatDateTime(checkInTime)}
          </span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>퇴근시간</span>
          <span>
            {status === "AVAILABLE" || !checkOutTime
              ? "기록 없음"
              : formatDateTime(checkOutTime)}
          </span>
        </div>
      </section>

      <hr className="border-t border-dashed border-gray-300 my-6" />

      <section className="flex justify-between mt-[30px] mb-[20px]">
        <button
          className={`w-[100px] h-[36px] font-medium rounded-3xl transition ${
            isCheckInDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleCheckIn}
          disabled={isCheckInDisabled}
        >
          출근하기
        </button>
        <button
          className={`w-[100px] h-[36px] font-medium rounded-3xl transition ${
            isCheckOutDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          onClick={handleCheckOut}
          disabled={isCheckOutDisabled}
        >
          퇴근하기
        </button>
      </section>

      {isLoading && (
        <p className="text-center text-blue-500 mt-4">처리 중...</p>
      )}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AttendanceCard;
