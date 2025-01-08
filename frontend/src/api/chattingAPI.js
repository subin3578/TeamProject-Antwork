import {
  CHANNEL_URI,
  CHANNEL_LIST_URI,
  DM_GET_MESSAGES_URI,
  CHANNEL_GET_URI,
  CHANNEL_GET_MESSAGES_URI,
  CHANNEL_SEND_MESSAGE_URI,
  CHANNEL_LEAVE_URI,
  CHANNEL_ADD_MEMBER_URI,
  DM_LIST_URI,
  DM_CREATE_URI,
  DM_SEND_MESSAGE_URI,
  CHANNEL_GET_MEMBER_URI,
  CHANNEL_CHANGE_TITLE_URI,
  DM_GET_URI,
  DM_GET_MEMBER_URI,
  CHANNEL_ROOM_SEARCH_URI,
  DM_DELETE_MESSAGE_URI,
  CHANNEL_FILE_URI,
  CHANNEL_GET_UNREAD_COUNT_URI,
  CHANNEL_VISIT_URI,
  CHANNEL_GET_C_UNREAD_COUNT_URI,
  ADD_FORBIDDEN_WORD_URI,
  DELETE_FORBIDDEN_WORD_URI,
  FORBIDDEN_WORDS_URI,
} from "./_URI";

import axiosInstance from "./../utils/axiosInstance";
export const createChannel = async (channelData) => {
  try {
    console.log("[JS] channel create 요청 전송");
    // 요청 전송
    const response = await axiosInstance.post(CHANNEL_URI, channelData);

    return response.data;
  } catch (error) {
    console.error("[JS] Error adding company:", error.message || error);
    throw error;
  }
};

export const getChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(CHANNEL_GET_URI(channelId));
    return response.data;
  } catch (error) {
    console.error("채널 상세조회 오류:", error);
    throw error;
  }
};

export const getChannelMessages = async (channelId) => {
  try {
    const response = await axiosInstance.get(
      CHANNEL_GET_MESSAGES_URI(channelId)
    );
    return response.data;
  } catch (error) {
    console.error("채널 메시지 조회 오류:", error);
    throw error;
  }
};

export const sendChannelMessage = async ({ channelId, content, senderId }) => {
  try {
    const response = await axiosInstance.post(
      CHANNEL_SEND_MESSAGE_URI(channelId),
      {
        content,
        senderId,
      }
    );

    return response.data;
  } catch (error) {
    console.error("채널 메시지 전송 오류:", error);
    throw error;
  }
};

export const leaveChannel = async ({ channelId, userId }) => {
  try {
    await axiosInstance.put(CHANNEL_LEAVE_URI(channelId, userId));
  } catch (error) {
    console.error("채널 나가기 오류:", error);
    throw error;
  }
};

export const getAllChannels = async (memberId) => {
  try {
    const response = await axiosInstance.get(
      `${CHANNEL_LIST_URI}?memberId=${memberId}`
    );
    return response.data; // 채널 목록 데이터를 반환
  } catch (error) {
    console.error("채널 목록 조회 오류:", error);
    throw error; // 에러 발생 시 다시 던져서 호출한 곳에서 처리
  }
};

// 채널 멤버 추가 API 함수
export const addChannelMember = async (channelId, users) => {
  try {
    console.log(`[JS] 채널 멤버 추가 요청: 채널 ID ${channelId}`);

    // users 배열에서 ID만 추출
    // const userIds = users.map((user) => user.id);

    const response = await axiosInstance.post(
      CHANNEL_ADD_MEMBER_URI(channelId),
      {
        memberIds: users, // 서버로 ID만 전송
      }
    );

    console.log(`[JS] 멤버 추가 성공:`, response.data);
    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error(`[JS] 채널 멤버 추가 실패:`, error.message || error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export const getChannelMembers = async (channelId) => {
  try {
    console.log(`[JS] 채널 멤버 조회 요청: 채널 ID ${channelId}`);

    const response = await axiosInstance.get(CHANNEL_GET_MEMBER_URI(channelId));

    console.log(`[JS] 채널 멤버 조회 성공:`, response.data);
    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error(`[JS] 채널 멤버 조회 실패:`, error.message || error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export const changeChannelTitle = async ({ channelId, name }) => {
  try {
    console.log(`[JS] 채널 멤버 조회 요청: 채널 ID ${channelId}`);

    const response = await axiosInstance.patch(
      CHANNEL_CHANGE_TITLE_URI(channelId),
      {
        name,
      }
    );

    console.log(`[JS] 채널 이름 수정 성공:`, response.data);
    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error(`[JS] 채널 이름 수정 실패:`, error.message || error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export const getChannelUnreadCount = async ({ channelId, messageId }) => {
  try {
    console.log(
      `[JS] 채널 안읽은 멤버수 조회 요청: 채널 ID ${channelId}, messageId ${messageId}`
    );

    const response = await axiosInstance.get(
      CHANNEL_GET_UNREAD_COUNT_URI({ channelId, messageId }),
      {
        name,
      }
    );

    console.log(`[JS] 채널 안읽은 멤버수 조회 성공:`, response.data);
    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error(`[JS] 채널 안읽은 멤버수 조회 실패:`, error.message || error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};
export const getChannelCUnreadCount = async ({ channelId, userId }) => {
  try {
    console.log(
      `[JS] 채널 안읽은 메시지수 조회 요청: 채널 ID ${channelId}, userId ${userId}`
    );

    const response = await axiosInstance.get(
      CHANNEL_GET_C_UNREAD_COUNT_URI({ channelId, userId }),
      {
        name,
      }
    );

    console.log(`[JS] 채널 안읽은 메시지수 조회 성공:`, response.data);
    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error(
      `[JS] 채널 안읽은 메시지수 조회 실패:`,
      error.message || error
    );
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export const visitChannel = async ({ channelId, memberId }) => {
  try {
    console.log(
      `[JS] 채널 방문 요청: 채널 ID ${channelId}, memberId ${memberId}`
    );

    const response = await axiosInstance.post(
      CHANNEL_VISIT_URI({ channelId, memberId })
    );

    console.log(`[JS] 채널 방문 성공:`, response.data);
  } catch (error) {
    console.error(`[JS] 채널 방문 실패:`, error.message || error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export const getDmMessages = async (dmId) => {
  try {
    const response = await axiosInstance.get(DM_GET_MESSAGES_URI(dmId));
    return response.data; // 데이터 반환
  } catch (error) {
    console.error("디엠 메시지 조회 실패:", error);
    throw error; // 에러 발생 시 처리
  }
};

export const sendDmMessage = async ({ dmId, content, senderId }) => {
  try {
    const response = await axiosInstance.post(DM_SEND_MESSAGE_URI(dmId), {
      content,
      senderId,
    });

    return response.data;
  } catch (error) {
    console.error("디엠 메시지 전송 오류:", error);
    throw error;
  }
};

// 디엠 방 목록을 가져오는 함수 (user.id를 사용하여 디엠 방 목록을 가져옴)
export const getDmList = async (userId) => {
  try {
    const response = await axiosInstance.get(`${DM_LIST_URI}?userId=${userId}`);
    return response.data; // 디엠 방 목록 데이터 반환
  } catch (error) {
    console.error("디엠 방 목록 조회 실패:", error);
    throw error; // 에러 발생 시 처리
  }
};

export const getDmById = async (dmId) => {
  try {
    const response = await axiosInstance.get(DM_GET_URI(dmId));
    return response.data;
  } catch (error) {
    console.error("Failed to fetch DM data:", error);
    throw error;
  }
};

export const createDm = async ({ creatorId, receiverIds }) => {
  try {
    const response = await axiosInstance.post(`${DM_CREATE_URI}`, {
      creatorId,
      receiverIds,
    });
    return response.data; // 디엠 방 목록 데이터 반환
  } catch (error) {
    console.error("디엠 방 생성 실패:", error);
    throw error; // 에러 발생 시 처리
  }
};

export const getDmMembers = async (dmId) => {
  try {
    console.log(`[JS] 디엠 멤버 조회 요청: 채널 ID ${dmId}`);

    const response = await axiosInstance.get(DM_GET_MEMBER_URI(dmId));

    console.log(`[JS] 디엠 멤버 조회 성공:`, response.data);
    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error(`[JS] 디엠 멤버 조회 실패:`, error.message || error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export const searchChatRooms = async (memberId, searchName) => {
  try {
    const response = await axiosInstance.get(CHANNEL_ROOM_SEARCH_URI, {
      params: { memberId, channelName: searchName },
    });

    console.log("API 응답:", response.data); // 응답 데이터 확인
    if (!Array.isArray(response.data)) {
      console.error(
        "API에서 배열 형태의 데이터를 반환하지 않음:",
        response.data
      );
      return []; // 빈 배열 반환
    }
    return response.data; // 검색 결과 반환
  } catch (error) {
    console.error("채팅방 검색 실패:", error);
    throw error;
  }
};

export const deleteDmMessage = async (messageId, userId) => {
  try {
    const response = await axiosInstance.delete(
      DM_DELETE_MESSAGE_URI(messageId),
      {
        params: { userId }, // userId를 쿼리 파라미터로 전달
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 삭제 성공 시 반환
  } catch (error) {
    console.error("메시지 삭제 실패:", error);
    throw new Error(`삭제 실패: ${error.response?.status || error.message}`);
  }
};

// 파일 업로드 API
export const uploadFileToChannel = async ({
  channelId,
  file,
  content,
  senderId,
}) => {
  const formData = new FormData();

  // FormData에 필드 추가
  formData.append("file", file); // 파일
  formData.append("content", content || ""); // 메시지 내용
  formData.append("senderId", senderId); // 보낸 사람 ID

  // POST 요청
  return axiosInstance.post(
    `${CHANNEL_FILE_URI}/${channelId}/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// 금칙어 추가
export const addForbiddenWord = async (word) => {
  try {
    console.log("[JS] 금칙어 추가 요청:", word);
    const response = await axiosInstance.post(ADD_FORBIDDEN_WORD_URI, { word });
    console.log("[JS] 금칙어 추가 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[JS] 금칙어 추가 실패:", error.message || error);
    throw error;
  }
};

// 금칙어 삭제
export const deleteForbiddenWord = async (id) => {
  try {
    console.log(`[JS] 금칙어 삭제 요청: ID ${id}`);
    const response = await axiosInstance.delete(DELETE_FORBIDDEN_WORD_URI(id));
    console.log("[JS] 금칙어 삭제 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[JS] 금칙어 삭제 실패:", error.message || error);
    throw error;
  }
};

// 금칙어 목록 조회
export const getForbiddenWords = async () => {
  try {
    const response = await axiosInstance.get(FORBIDDEN_WORDS_URI);
    return response.data;
  } catch (error) {
    console.error("[API] 금칙어 목록 조회 실패:", error);
    throw error;
  }
};