import { createContext, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Client } from "@stomp/stompjs";

// Context 생성
const StompContext = createContext(null);

export function StompProvider({
    children,
    brokerURL,
    connectHeaders,
    onConnectCallback,
    onDisconnectCallback,
    onCloseCallback,
    onErrorCallback,
    reconnectDelay = 5000,
}) {
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // brokerURL에 소켓 엔드포인트를 적어줍니다. 예: http://localhost:8080/ws
        // 아래처럼 SockJS 인스턴스를 생성하도록 webSocketFactory에 전달
        const client = new Client({
            // brokerURL: "이 부분은 사용 안 함",
            brokerURL: brokerURL,
            connectHeaders,
            debug: (str) => {
                // console.log("[STOMP DEBUG]:", str);
            },
            reconnectDelay,
            onConnect: () => {
                setIsConnected(true);
                console.log("setIsConnected(true);");
                onConnectCallback && onConnectCallback();
            },
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers["message"]);
                console.error("Additional details: " + frame.body);
                onErrorCallback && onErrorCallback(frame);
            },
            onDisconnect: () => {
                setIsConnected(false);
                onDisconnectCallback && onDisconnectCallback();
            },
            onWebSocketClose: () => {
                setIsConnected(false);
                onCloseCallback && onCloseCallback();
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [
        brokerURL,
        connectHeaders,
        onConnectCallback,
        onDisconnectCallback,
        onCloseCallback,
        onErrorCallback,
        reconnectDelay,
    ]);

    const subscribe = (destination, callback, headers = {}) => {
        if (isConnected && stompClientRef.current) {
            const subscription = stompClientRef.current.subscribe(
                destination,
                callback,
                headers
            );
            return () => subscription.unsubscribe();
        } else {
            console.warn("STOMP not connected, cannot subscribe yet.");
            return () => { };
        }
    };

    const sendMessage = (destination, body = {}, headers = {}) => {
        if (isConnected && stompClientRef.current) {
            stompClientRef.current.publish({
                destination,
                body: JSON.stringify(body),
                headers,
            });
        } else {
            console.warn("STOMP not connected, cannot send message now.");
        }
    };

    return (
        <StompContext.Provider value={{ isConnected, subscribe, sendMessage }}>
            {children}
        </StompContext.Provider>
    );
}
StompProvider.propTypes = {
    children: PropTypes.node.isRequired,
    brokerURL: PropTypes.string.isRequired,
    connectHeaders: PropTypes.object,
    onConnectCallback: PropTypes.func,
    onDisconnectCallback: PropTypes.func,
    onCloseCallback: PropTypes.func,
    onErrorCallback: PropTypes.func,
    reconnectDelay: PropTypes.number,
};

// Context를 쉽게 사용하기 위한 커스텀 훅
export function useStomp() {
    const context = useContext(StompContext);
    if (!context) {
        throw new Error("useStomp must be used within a StompProvider");
    }
    return context;
}
