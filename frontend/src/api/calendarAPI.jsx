import axios from "axios";
import {
  CALENDAR_CALENDARLANGUAGE_URI,
  CALENDAR_DELETE_URI,
  CALENDAR_DELETESHARE_URI,
  CALENDAR_INSERT_URI,
  CALENDAR_SELECT_URI,
  CALENDAR_SELECTMODAL_URI,
  CALENDAR_SELECTSHARE_URI,
  CALENDAR_SHARE_URI,
  CALENDAR_UPDATE_URI,
  SCHEDULE_DELETE_URI,
  SCHEDULE_DETAIL_URI,
  SCHEDULE_INSERT_URI,
  SCHEDULE_SELECT_URI,
  SCHEDULE_SELECTDEPART_URI,
  SCHEDULE_UPDATE_URI,
  SCHEDULE_UPDATEDETAIL_URI,
} from "./_URI";
import axiosInstance from "../utils/axiosInstance";

// 캘린더 insert
export const insertCalendar = async (calendar) => {
  console.log(calendar);
  try {
    // JSON 데이터로 전송
    const response = await axiosInstance.post(CALENDAR_INSERT_URI, calendar, {
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
    });
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("Error submitting calendar:", error);
    throw error; // 에러를 상위 호출로 전달
  }
};

// 캘린더 select
export const getCalendar = async (uid) => {
  try {
    const response = await axiosInstance.get(`${CALENDAR_SELECT_URI}/${uid}`, {
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
    });
    console.log("데이터 들어오는값이?" + response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 캘린더 모달 select
export const getCalendarModal = async (uid) => {
  try {
    const response = await axiosInstance.get(
      `${CALENDAR_SELECTMODAL_URI}/${uid}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 캘린더 모달 select
export const getCalendarShare = async (id) => {
  console.log("캘린더api 모달에서 사용하는 공유캘린더 사용 아이디 ::" + id);
  try {
    const response = await axiosInstance.get(
      `${CALENDAR_SELECTSHARE_URI}/${id}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 캘린더 update
export const updateCalendar = async (no, newName, color) => {
  console.log("555555::" + newName);
  console.log("555555::" + color);
  try {
    const response = await axiosInstance.put(
      `${CALENDAR_UPDATE_URI}/${no}/${newName}/${encodeURIComponent(color)}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 캘린더 delete
export const deleteCalendar = async (no) => {
  try {
    const response = await axiosInstance.delete(
      `${CALENDAR_DELETE_URI}/${no}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 캘린더 delete
export const shareCalendar = async (id, userIds) => {
  console.log("가는값이???" + id);
  console.log("가는값이???" + userIds);
  try {
    const response = await axiosInstance.put(
      `${CALENDAR_SHARE_URI}/${id}`,
      userIds,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 일정 insert
export const insertSchedule = async (schedule) => {
  console.log("55555555555" + JSON.stringify(schedule));
  try {
    // JSON 데이터로 전송
    const response = await axiosInstance.post(SCHEDULE_INSERT_URI, schedule, {
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
    });
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("Error submitting schedule:", error);
    console.error(
      "Error submitting schedule:",
      error.response?.data || error.message
    );
  }
};

// 부서원 select
export const getUser = async (department) => {
  try {
    const response = await axiosInstance.get(
      `${SCHEDULE_SELECTDEPART_URI}/${department}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response?.data;
  } catch (err) {
    console.log(err);
  }
};

// 스케줄 select
export const getSchedule = async (uid) => {
  console.log("유아이디값값값값" + uid);
  try {
    const response = await axiosInstance.get(`${SCHEDULE_SELECT_URI}/${uid}`, {
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 스케줄 select
export const getScheduleDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`${SCHEDULE_DETAIL_URI}/${id}`, {
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 일정 drag로 update
export const updateScheduleDrag = async (no, start, end) => {
  try {
    const response = await axiosInstance.put(
      `${SCHEDULE_UPDATE_URI}/${no}/${start}/${end}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 일정 상세update
export const updateSchedule = async (formData) => {
  console.log(formData);
  try {
    const response = await axiosInstance.put(
      SCHEDULE_UPDATEDETAIL_URI,
      formData,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 일정 delete
export const deleteSchedule = async (no) => {
  try {
    const response = await axiosInstance.delete(
      `${SCHEDULE_DELETE_URI}/${no}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 공유멤버 삭제하기
export const deleteShare = async (cId, userId) => {
  try {
    const response = await axiosInstance.delete(
      `${CALENDAR_DELETESHARE_URI}/${cId}/${userId}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 공유멤버 삭제하기
export const calendarLanguage = async (userId, language) => {
  try {
    const response = await axiosInstance.put(
      `${CALENDAR_CALENDARLANGUAGE_URI}/${userId}/${language}`,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
