import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale"; // 한국어 지원

/**
 * 입력된 날짜를 기준으로 상대 시간 또는 날짜/시간을 반환합니다.
 * @param {string | Date} date - ISO 형식의 날짜 문자열 또는 Date 객체
 * @returns {string} - 상대 시간 (몇 분 전) 또는 날짜/시간 (YYYY-MM-DD HH:mm)
 */

function formatChatTime(date) {
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);

    // 현재 시간과의 차이를 초 단위로 계산
    const now = new Date();
    const timeDifference = (now - parsedDate) / 1000; // 초 단위 차이
    const diffInMinutes = Math.floor(timeDifference / 60); // 분 단위 차이
    const diffInHours = Math.floor(diffInMinutes / 60); // 시간 단위 차이

    // 상대 시간 조건
    if (timeDifference < 60) {
      return "방금"; // 1분 미만
    } else if (timeDifference < 60 * 60) {
      return `${diffInMinutes}분 전`; // 1시간 미만
    } else if (timeDifference < 24 * 60 * 60) {
      return `${diffInHours}시간 전`; // 24시간 미만
    }

    // 날짜/시간 포맷 (1일 이상)
    return format(parsedDate, "a hh:mm", { locale: ko }); // 오전/오후 hh:mm 형식
  } catch (error) {
    console.error("Invalid date:", date);
    return "날짜를 확인해주세요.";
  }
}

export default formatChatTime;
