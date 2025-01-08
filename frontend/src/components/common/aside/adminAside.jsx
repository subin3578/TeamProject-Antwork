import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToggle from "../../../hooks/useToggle";

export default function AdminAside({ asideVisible }) {
  const [toggles, toggleSection] = useToggle({
    basicManagement: true,
    organizationalManagement: true,
    securityManagement: true,
    menuManagement: true,
    RecentlyUsedList: true,
  });

  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const clickedLinks =
      JSON.parse(sessionStorage.getItem("clickedLinks")) || [];
    console.log("Clicked links:", clickedLinks);
    const log = clickedLinks.map((item) => {
      if (item === "멤버관리") {
        return {
          path: "/antwork/admin/member",
          label: "멤버관리",
          icon: "👨‍💻",
        };
      } else if (item === "팝업관리") {
        return {
          path: "/antwork/admin/popup",
          label: "팝업관리",
          icon: "🔔",
        };
      } else if (item === "알림관리") {
        return {
          path: "/antwork/admin/notification",
          label: "알림관리",
          icon: "📩",
        };
      } else if (item === "전자결제") {
        return {
          path: "/antwork/admin/approval",
          label: "전자결제",
          icon: "💻",
        };
      } else if (item === "부서 관리") {
        return {
          path: "/antwork/admin/department",
          label: "부서 관리",
          icon: "🏢",
        };
      } else if (item === "근태관리") {
        return {
          path: "/antwork/admin/attendance",
          label: "근태관리",
          icon: "🕒",
        };
      } else if (item === "멤버접근로그") {
        return {
          path: "/antwork/admin/access",
          label: "멤버접근로그",
          icon: "📄",
        };
      }
    });
    console.log(JSON.stringify(log));
    setLogs(log);
    console.log(JSON.stringify(logs));
  }, []);

  const handleLinkClick = (label) => {
    // 1. 기존의 기록을 localStorage에서 불러오기 (없으면 빈 배열로 초기화)
    const clickedLinks =
      JSON.parse(sessionStorage.getItem("clickedLinks")) || [];

    // 2. 중복된 항목이 있는지 확인
    const filteredLinks = clickedLinks.filter((link) => link !== label); // 기존에 있는 항목은 제외

    // 3. 새로운 클릭 기록 추가 (중복 방지)
    filteredLinks.push(label);

    // 4. 업데이트된 배열을 localStorage에 다시 저장
    sessionStorage.setItem("clickedLinks", JSON.stringify(filteredLinks));
    const lastClickedLink = sessionStorage.getItem("clickedLinks");
    console.log("Clicked item saved to localStorage:", lastClickedLink);
  };

  return (
    <>
      <aside className={`sidebar ${!asideVisible ? "hidden" : ""} table-cell`}>
        <div className="logo">
          <span className="sub-title">Admin Setting</span>

          <span className="title">Admin</span>
        </div>
        <ul className="lnb inline-grid">
          <li className="lnb-item !h-[auto]">
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_home_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link to="/antwork/admin" className="main-cate !text-[16px]">
                홈
              </Link>
            </div>
          </li>

          <li className="lnb-item !mt-[15px] !h-[500px] border-b border-[#ddd]">
            {/* 기본관리 */}
            <div
              className="lnb-header cursor-pointer "
              onClick={() => toggleSection("basicManagement")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex ">
                기본 관리{" "}
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
                  <Link
                    to="/antwork/admin/popup"
                    onClick={() => handleLinkClick("팝업관리")}
                  >
                    🔔&nbsp;&nbsp;팝업관리
                  </Link>
                </li>
                <li>
                  <Link
                    to="/antwork/admin/notification"
                    onClick={() => handleLinkClick("알림관리")}
                  >
                    📩&nbsp;&nbsp;알림관리
                  </Link>
                </li>
                <li className="">
                  <div onClick={toggleSubMenu} className="">
                    <Link
                      to="/antwork/admin/approval"
                      style={{
                        textDecoration: "none",
                        fontSize: "15px",
                        color: "#555",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#007BFF")}
                      onMouseLeave={(e) => (e.target.style.color = "#555")}
                      onClick={() => handleLinkClick("전자결제")}
                    >
                      💻&nbsp;&nbsp;전자결제
                    </Link>
                  </div>
                </li>
              </ol>
            )}
            {/* 조직관리*/}
            <div
              className="lnb-header cursor-pointer "
              onClick={() => toggleSection("organizationalManagement")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex !mt-[12px] ">
                조직 관리{" "}
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
                  <Link
                    to="/antwork/admin/member"
                    onClick={() => handleLinkClick("멤버관리")}
                  >
                    👨‍💻&nbsp;&nbsp;멤버관리
                  </Link>
                </li>
                <li>
                  <Link
                    to="/antwork/admin/department"
                    onClick={() => handleLinkClick("부서 관리")}
                  >
                    🏢&nbsp;&nbsp;부서 관리
                  </Link>
                </li>
                <li>
                  <Link
                    to="/antwork/admin/attendance"
                    onClick={() => handleLinkClick("근태관리")}
                  >
                    🕒&nbsp;&nbsp;근태 관리
                  </Link>
                </li>
              </ol>
            )}

            <div
              className="lnb-header cursor-pointer "
              onClick={() => toggleSection("securityManagement")}
            >
              <span className="main-cate !mt-[12px] !text-[14px] text-[#757575] cursor-pointer !inline-flex ">
                보안관리{" "}
                <img
                  src={
                    toggles.securityManagement
                      ? "/images/ico/page_dropup_20_999999.svg" // 열렸을 때 이미지
                      : "/images/ico/page_dropdown_20_999999.svg" // 닫혔을 때 이미지
                  }
                  alt="toggle"
                />
              </span>
            </div>
            {toggles.securityManagement && (
              <ol>
                <li>
                  <Link
                    to="/antwork/admin/access"
                    onClick={() => handleLinkClick("멤버접근로그")}
                  >
                    📄&nbsp;&nbsp;멤버접근로그
                  </Link>
                </li>
              </ol>
            )}
          </li>

          <li className="lnb-item">
            <div
              className="lnb-header !mb-[10px]"
              onClick={() => toggleSection("RecentlyUsedList")}
            >
              <img
                src="/images/ico/menu_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <button className="main-cate !text-[16px] text-[#757575]">
                최근사용목록
              </button>
            </div>
            {toggles.RecentlyUsedList &&
              logs &&
              Array.isArray(logs) &&
              logs.length > 0 && (
                <ol>
                  {logs
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((log, index) => (
                      <li key={index}>
                        <Link to={log?.path}>
                          {log?.icon}&nbsp;&nbsp;{log?.label}
                        </Link>
                      </li>
                    ))}
                </ol>
              )}
          </li>
        </ul>
      </aside>
    </>
  );
}
