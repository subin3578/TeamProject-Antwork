import { Link } from "react-router-dom";
import useToggle from "../../../hooks/useToggle";
import { useEffect, useState } from "react";
import { userLogs } from "@/api/accessAPI";
import useAuthStore from "@/store/AuthStore";

export default function SettinngAside({ asideVisible }) {
  const [toggles, toggleSection] = useToggle({
    basicManagement: true,
    organizationalManagement: true,
    securityManagement: true,
    menuManagement: true,
    RecentlyUsedList: true,
  });

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await userLogs(user?.uid);
      console.log("12345" + response);
      if (response.includes("schedule") && response.includes("calendar")) {
        // 'schedule'이 앞에 있으면 'calendar'를 제거
        if (response.indexOf("schedule") < response.indexOf("calendar")) {
          response.splice(response.indexOf("calendar"), 1);
        }
        // 'calendar'가 앞에 있으면 'schedule'을 제거
        else {
          response.splice(response.indexOf("schedule"), 1);
        }
      }
      const log = response.map((item) => {
        if (item == "schedule") {
          item = "calendar";
        }
        if (item === "calendar" || item === "schedule") {
          return {
            path: "/antwork/calendar",
            label: "캘린더",
            icon: "🗓️",
          };
        } else if (item === "project") {
          return {
            path: "/antwork/project/main",
            label: "프로젝트",
            icon: "📊",
          };
        } else if (item === "page") {
          return {
            path: "/antwork/page",
            label: "페이지",
            icon: "📄",
          };
        } else if (item === "drive") {
          return {
            path: "/antwork/drive",
            label: "드라이브",
            icon: "☁️",
          };
        } else if (item === "chatting") {
          return {
            path: "/antwork/chatting",
            label: "채팅",
            icon: "📮",
          };
        } else if (item === "board") {
          return {
            path: "/antwork/board",
            label: "게시판",
            icon: "📋",
          };
        } else {
          return null; // 조건에 맞지 않는 경우 처리
        }
      });
      console.log("77777" + JSON.stringify(log));
      setLogs(log);
    };
    fetchData();
  }, []);

  return (
    <>
      <aside className={`sidebar ${!asideVisible ? "hidden" : ""} table-cell`}>
        <div className="logo">
          <span className="sub-title">Personal Setting</span>

          <span className="title">Setting</span>
        </div>
        <ul className="lnb inline-grid">
          <li className="lnb-item !mt-[10px] !h-[500px] border-b border-[#ddd]">
            {/* 기본관리 */}
            <div
              className="lnb-header cursor-pointer "
              onClick={() => toggleSection("basicManagement")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex ">
                마이페이지{" "}
                <img
                  src={
                    toggles.basicManagement
                      ? "/images/ico/page_dropup_20_999999.svg" // 열렸을 때 이미지
                      : "/images/ico/page_dropdown_20_999999.svg" // 닫혔을 때 이미지
                  }
                  alt="toggle"
                />
              </span>
            </div>
            {toggles.basicManagement && (
              <ol>
                <li>
                  <Link to="/antwork/setting/myinfo">
                    👤&nbsp;&nbsp;나의 정보수정
                  </Link>
                </li>
                <li className="lnb-item">
                  <div
                    className="lnb-header !mb-[10px]"
                    onClick={() => toggleSection("RecentlyUsedList")}
                  >
                    <button className="main-cate !text-[16px] text-[#757575]">
                      📌 최근사용목록
                    </button>
                  </div>
                  {toggles.RecentlyUsedList && (
                    <ol>
                      {logs.map((log, index) => (
                        <li key={index}>
                          <Link to={log.path}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{log.icon}&nbsp;&nbsp;
                            {log.label}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              </ol>
            )}
            {/* 조직관리*/}
            <div
              className="lnb-header cursor-pointer "
              onClick={() => toggleSection("organizationalManagement")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex !mt-[12px] ">
                메뉴 설정{" "}
                <img
                  src={
                    toggles.organizationalManagement
                      ? "/images/ico/page_dropup_20_999999.svg" // 열렸을 때 이미지
                      : "/images/ico/page_dropdown_20_999999.svg" // 닫혔을 때 이미지
                  }
                  alt="toggle"
                />
              </span>
            </div>
            {toggles.organizationalManagement && (
              <ol>
                <li>
                  <Link to="/antwork/setting/calendar">
                    🗓️&nbsp;&nbsp;캘린더 설정
                  </Link>
                </li>
                <li>
                  <Link to="/antwork/setting/chatting">
                    📮&nbsp;&nbsp;채팅 설정
                  </Link>
                </li>
                <li>
                  <Link to="/admin/member-integration">
                    📄&nbsp;&nbsp;페이지 설정
                  </Link>
                </li>

                <li>
                  <Link to="/antwork/setting/project">
                    📊&nbsp;&nbsp;프로젝트 설정
                  </Link>
                </li>
                <li>
                  <Link to="/admin/member-integration">
                    📋&nbsp;&nbsp;게시판 설정
                  </Link>
                </li>
                <li>
                  <Link to="/antwork/setting/drive">
                    ☁️&nbsp;&nbsp;드라이브 설정
                  </Link>
                </li>
              </ol>
            )}
          </li>
        </ul>
      </aside>
    </>
  );
}
