import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import useAuthStore from "@/store/AuthStore";
import axiosInstance from "@/utils/axiosInstance";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@/api/notificationAPI";
import { NOTIFICATION_MY_SELECT_URI, WS_URL } from "./../../api/_URI";
import { useMemo } from "react";

export default function Header({ onToggleAside }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const stompClientRef = useRef(null); // WebSocket 클라이언트 레퍼런스

  // 서버에서 초기 알림 데이터를 가져오기
  const loadNotifications = async () => {
    if (!user?.id) {
      console.error("❌ User ID is not available for fetching notifications.");
      return;
    }

    try {
      const data = await fetchNotifications(user.id); // 외부 함수를 사용하여 알림 조회
      setNotifications(data); // 조회된 알림 데이터 상태 업데이트
      setUnreadCount(data.filter((n) => !n.isRead).length); // 읽지 않은 알림 개수 계산
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    console.log("바뀌나?");
    loadNotifications(); // 컴포넌트 마운트 시 초기 알림 데이터를 가져옵니다.
  }, [user?.id]);

  // WebSocket 설정
  useEffect(() => {
    if (!user?.id) return;

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      stompClientRef.current = client;

      client.subscribe(`/topic/notifications/${user.id}`, (message) => {
        console.log("✅ WebSocket 구독 성공");
        const notification = JSON.parse(message.body);
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        setHighlight(true);
        setTimeout(() => setHighlight(false), 1000);
      });
    };

    client.onDisconnect = () => {
      console.log("🔴 WebSocket 연결 해제");
    };

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user?.id]);

  // 알림 드롭다운 열기
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    // 드롭다운을 열 때 읽음 처리하지 않음
    if (!showNotifications) {
      // 읽지 않은 알림 개수는 그대로 유지
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
    }
  };

  // 알림 읽음 처리 핸들러
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        console.log("알림읽음핸들러");
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        console.error("❌ Failed to mark notification as read:", error);
      }
    }

    if (notification.metadata?.url) {
      console.log("잇음");
      console.log("알림 메타데이터" + notification.metadata.url);
      navigate(notification.metadata.url);
    } else {
      alert(notification.message);
    }
  };

  // 로그아웃 처리
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Zustand 스토어에서 Access Token 및 사용자 정보 초기화
      useAuthStore.getState().clearAccessToken();

      // axiosInstance의 인증 헤더 제거
      delete axiosInstance.defaults.headers.common["Authorization"];

      // 로그인 페이지로 리다이렉트
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 처리 중 오류:", error.message);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 드롭다운 토글
  const toggleDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  // 알림 렌더링
  const renderedNotifications = useMemo(
    () =>
      notifications.map((notification) => (
        <li
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className={`p-3 cursor-pointer ${
            notification.isRead
              ? "text-gray-500 bg-gray-100"
              : "font-bold bg-white"
          } hover:bg-gray-200`}
        >
          {notification.message}
          <span className="block text-xs text-gray-400">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </li>
      )),
    [notifications]
  );

  return (
    <header className="z-[1000]">
      <div className="header leftside">
        <a
          href="#"
          id="openSidebarBtn"
          onClick={(e) => {
            e.preventDefault();
            onToggleAside();
          }}
        >
          <img
            src="/images/ico/menu_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            alt="menu"
          />
        </a>
        <h1 className="hlogo">
          <img
            className="mt-[10px]"
            src="/images/Landing/antwork_logo.png"
            alt=""
          />
        </h1>
      </div>
      <div className="header rightside">
        <div className="relative">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleNotifications();
            }}
          >
            <img
              src="/images/ico/notifications_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 copy.svg"
              alt="alarm"
              className={`transition-transform duration-300 ${
                highlight ? "animate-bounce" : ""
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </a>
          {showNotifications && (
            <div className="absolute top-full right-0 w-80 bg-white shadow-lg border rounded-md">
              <div className="p-3 border-b">
                <h3 className="text-lg font-semibold">알림</h3>
              </div>
              <ul className="max-h-64 overflow-y-auto">
                {renderedNotifications}
              </ul>
            </div>
          )}
        </div>
        <a href="#">
          <img src="/images/ico/nav_chat.svg" alt="message" />
        </a>
        <div className="user-info headeruser relative">
          <img
            src="/images/ico/account_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            alt="profile"
            className="avatar"
          />
          <div className="user-details">
            <h3>{user?.name || "사용자 이름"}</h3>
            <p>{user?.companyName || "소속 팀"}</p>
          </div>
          <a href="#" onClick={toggleDropdown}>
            <img
              src="/images/ico/keyboard_arrow_down_20dp_5F6368_FILL0_wght400_GRAD0_opsz20.svg"
              alt="arrow"
            />
          </a>
          {showDropdown && (
            <div className="dropdown-menu">
              <ul>
                <li className="p-3 hover:bg-gray-100">
                  <Link to="/antwork/setting/myinfo">나의 정보 수정</Link>
                </li>
                <li className="p-3 hover:bg-gray-100">
                  <Link to="/antwork/setting">설정 페이지</Link>
                </li>
                <li className="p-3 hover:bg-gray-100">
                  <Link to="/antwork/admin">관리자 페이지</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        <a href="#" onClick={handleLogout}>
          <img
            src="/images/ico/logout_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            alt="logout"
          />
        </a>
      </div>
    </header>
  );
}
