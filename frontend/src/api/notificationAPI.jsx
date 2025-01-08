import {
  NOTIFICATION_MY_SELECT_URI,
  NOTIFICATION_READ_URI,
  NOTIFICATION_SEND_URI,
  NOTIFICATION_SENDER_SELECT_URI,
} from "./_URI";
import axiosInstance from "./../utils/axiosInstance";

export const sendNotification = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${NOTIFICATION_SEND_URI}`,
      payload
    );
    return response.data; // 성공적인 응답 데이터 반환
  } catch (error) {
    console.error("알림 전송 실패:", error.response || error);
    throw new Error("알림 전송에 실패했습니다. 서버 상태를 확인하세요.");
  }
};

// 본인 알림 조회
export const fetchNotifications = async (targetId) => {
  if (!targetId) {
    throw new Error("Target ID is required for fetching notifications.");
  }
  try {
    const response = await axiosInstance.get(
      `${NOTIFICATION_MY_SELECT_URI}?targetId=${targetId}`
    );
    return response.data; // 서버에서 받은 데이터를 그대로 반환
  } catch (error) {
    console.error("❌ Failed to fetch notifications:", error.response || error);
    throw new Error(
      "Failed to fetch notifications. Please check the server status."
    );
  }
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required for marking as read.");
  }
  try {
    console.log("아이디" + notificationId);
    await axiosInstance.patch(
      `${NOTIFICATION_READ_URI}/${notificationId}/read`
    );
    return true; // 성공 시 true 반환
  } catch (error) {
    console.error(
      "❌ Failed to mark notification as read:",
      error.response || error
    );
    throw new Error("Failed to mark notification as read. Please try again.");
  }
};

// 보내는사람 알림 조회
export const fetchNotificationsBySenderId = async (senderId) => {
  if (!senderId) {
    throw new Error("Sender ID is required for fetching sent notifications.");
  }
  try {
    console.log("조회");
    const response = await axiosInstance.get(
      `${NOTIFICATION_SENDER_SELECT_URI}/${senderId}`
    );
    console.log("✅ 보낸 알림 조회 성공:", response.data);
    return response.data; // 알림 목록 반환
  } catch (error) {
    console.error(
      "❌ Failed to fetch sent notifications:",
      error.response || error
    );
    throw new Error("Failed to fetch sent notifications. Please try again.");
  }
};
