import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { WS_URL } from "@/api/_URI";

const useCalendarWebSocket = ({ userId, calendarRef }) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.error(
        "❌ User ID is not available. WebSocket will not be initialized."
      );
      return;
    }

    const client = new Client({
      brokerURL: WS_URL, // WebSocket 서버 URL
      reconnectDelay: 5000, // 재연결 딜레이
      heartbeatIncoming: 4000, // Heartbeat 설정 (수신)
      heartbeatOutgoing: 4000, // Heartbeat 설정 (송신)
      debug: (msg) => console.log("🔌 WebSocket Debug:", msg), // 디버그 로그
    });

    client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      stompClientRef.current = client;

      // 구독 설정
      const subscription = client.subscribe(
        `/topic/schedules/${userId}`,
        (message) => {
          try {
            const data = JSON.parse(message.body); // 메시지 파싱
            console.log("🔔 알림 메시지 수신:", data);

            const calendarApi = calendarRef.current.getApi();
            console.log("과연??" + data.id);
            const updateEvent = calendarApi.getEventById(data.id);

            // 메시지의 action에 따라 처리
            switch (data.action) {
              case "insert":
                calendarApi.addEvent(data); // 새 이벤트 추가
                console.log("✅ 이벤트 추가됨:", data.event);
                break;
              case "update":
                console.log("간다ㅏ라" + updateEvent.id);
                updateEvent.remove();
                calendarApi.addEvent(data);
                break;
              case "delete":
                updateEvent.remove();
                break;
              default:
                console.warn("⚠️ 알 수 없는 액션:", data.action);
                break;
            }
          } catch (error) {
            console.error("❌ 메시지 처리 중 에러:", error);
          }
        }
      );

      console.log("📩 Subscribed to: /topic/schedules/" + userId);

      return () => subscription.unsubscribe();
    };

    client.onDisconnect = () => {
      console.log("🔴 WebSocket 연결 해제");
      stompClientRef.current = null;
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame.headers["message"], frame.body);
    };

    try {
      client.activate();
      console.log("🔌 WebSocket 활성화 중...");
    } catch (error) {
      console.error("❌ WebSocket 활성화 중 에러:", error);
    }

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [userId, calendarRef]);

  return stompClientRef;
};

export default useCalendarWebSocket;
