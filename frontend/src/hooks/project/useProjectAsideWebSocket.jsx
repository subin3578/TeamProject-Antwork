import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { WS_URL } from "@/api/_URI";

const useProjectAsideWebSocket = () => {
  const stompClientRef = useRef(null);
  const [updatedProjectName, setUpdatedProjectName] = useState("");

  useEffect(() => {
    const client = new Client({
      brokerURL: WS_URL, // WebSocket 서버 URL
      reconnectDelay: 5000, // 재연결 딜레이
      heartbeatIncoming: 4000, // Heartbeat 설정 (수신)
      heartbeatOutgoing: 4000, // Heartbeat 설정 (송신)
      debug: (msg) => console.log("🔌 WebSocket Debug:", msg),
    });

    client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      stompClientRef.current = client;

      // 구독 설정
      const subscription = client.subscribe(
        `/topic/project/aside`,
        (message) => {
          try {
            const data = message.body;
            console.log("🔔 알림 메시지 수신:", data);

            // 상태 업데이트
            setUpdatedProjectName(data);
          } catch (error) {
            console.error("❌ 메시지 처리 중 에러:", error);
          }
        }
      );

      return () => subscription.unsubscribe();
    };

    client.onDisconnect = () => {
      console.log("🔴 WebSocket 연결 해제");
      stompClientRef.current = null;
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame.headers["message"], frame.body);
    };

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  return updatedProjectName;
};

export default useProjectAsideWebSocket;
