import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { WS_URL } from "@/api/_URI";

export const useAsideWebSocket = ({
  uid,
  handleWebSocketMessage,
  setStompClient,
  stompClientRef,
}) => {
  useEffect(() => {
    if (!uid) {
      console.log("❌ Missing uid");
      return;
    }

    console.log("🚀 Initializing Aside WebSocket connection for uid:", uid);
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: function (str) {
        console.log("🔌 Aside WebSocket Debug:", str);
      },
    });

    client.configure({
      onConnect: () => {
        console.log("✅ Aside Connected to WebSocket successfully");
        setStompClient(client);
        stompClientRef.current = client;

        // aside 전용 채널만 구독
        console.log("📩 Subscribing to aside channel: /topic/page/aside");
        const subscription = client.subscribe(
          "/topic/page/aside",
          (message) => {
            console.log("📨 Received raw message on aside channel:", message);
            console.log("📨 Message body:", message.body);
            console.log("📨 Message headers:", message.headers);

            try {
              const parsedData = JSON.parse(message.body);
              console.log("📨 Parsed message data:", parsedData);
              handleWebSocketMessage(message);
            } catch (error) {
              console.error("❌ Error parsing message:", error);
            }
          }
        );

        console.log("✅ Subscription successful. Details:", {
          id: subscription.id,
          destination: "/topic/page/aside",
        });
      },
      onDisconnect: () => {
        console.log("🔴 Aside WebSocket disconnected");
        setStompClient(null);
        stompClientRef.current = null;
      },
      onStompError: (frame) => {
        console.error("❌ Aside STOMP Error. Frame:", frame);
      },
    });

    try {
      console.log("🔌 Activating Aside WebSocket client...");
      client.activate();
    } catch (error) {
      console.error("❌ Error activating Aside WebSocket:", error);
    }

    return () => {
      if (client.active) {
        console.log("🔌 Cleaning up Aside WebSocket connection");
        client.deactivate();
      }
    };
  }, [uid]);
};
