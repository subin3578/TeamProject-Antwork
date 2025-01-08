import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToggle from "../../../hooks/useToggle";
import useModalStore from "../../../store/modalStore";
import ProjectModal from "../modal/projectModal";
import { getProjects } from "../../../api/projectAPI";
import useAuthStore from "../../../store/AuthStore";
import useProjectAsideWebSocket from "@/hooks/project/useProjectAsideWebSocket";

export default function ProjectAside({ asideVisible }) {
  // 모달 상태 관리를 위한 useState 추가
  const openModal = useModalStore((state) => state.openModal);

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const updatedProjectName = useProjectAsideWebSocket(); // 웹소켓에서 수신한 프로젝트 이름

  // 토글 상태
  const [toggles, toggleSection] = useToggle({
    ongoingProjects: true,
    completedProjects: true,
  });

  // 프로젝트 상태
  const [projects, setProjects] = useState({
    ongoing: [],
    completed: [],
  });

  const fetchProjects = async () => {
    try {
      console.log("사용자 정보:", user);
      const response = await getProjects(user?.uid);
      console.log("response : " + response);
      if (response == null) {
        return;
      }

      // 상태(진행, 완료)에 따라 데이터 분리
      const ongoing = response.filter((project) => project.status === 0);
      const completed = response.filter((project) => project.status === 1);
      console.log("ongoing :" + ongoing);
      console.log("completed :" + completed);

      setProjects({ ongoing, completed });
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("프로젝트 데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };
  useEffect(() => {
    fetchProjects(); // 컴포넌트 마운트 시 데이터 가져오기
  }, [user]); // UID 변경 시 데이터 다시 가져오기

  // 웹소켓에서 프로젝트 이름을 수신하면 목록을 새로고침
  useEffect(() => {
    if (updatedProjectName) {
      console.log("🔄 프로젝트 이름 업데이트:", updatedProjectName);
      fetchProjects();
    }
  }, [updatedProjectName]);

  return (
    <>
      {/* 모달 컴포넌트 추가 */}
      <ProjectModal />
      <aside className={`sidebar ${!asideVisible ? "hidden" : ""}`}>
        <div className="logo !border-b-0 !h-auto">
          <span className="sub-title">My Projects</span>
          <span className="title">Projects</span>
          <button
            onClick={() => openModal("project")}
            className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 mt-6 h-14"
            style={{ backgroundColor: "#D9E8FF" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xl">New Project</span>
          </button>
        </div>
        <ul className="lnb inline-grid">
          <li className="lnb-item">
            <div className="lnb-header !pb-[15px] border-b border-[#ddd]">
              <img
                src="/images/ico/page_home_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link
                to="/antwork/project/main"
                className="main-cate !text-[16px]"
              >
                홈
              </Link>
            </div>
          </li>
          <li className="lnb-item !h-auto">
            <div
              className="lnb-header cursor-pointer"
              onClick={() => toggleSection("ongoingProjects")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex ">
                진행중인 프로젝트{" "}
                <img
                  src={
                    toggles.ongoingProjects
                      ? "/images/ico/page_dropup_20_999999.svg"
                      : "/images/ico/page_dropdown_20_999999.svg"
                  }
                  alt="toggle"
                />
              </span>
            </div>
            {toggles.ongoingProjects && (
              <ol>
                {projects.ongoing.map((project) => (
                  <li key={project.id}>
                    <Link to={`/antwork/project/view?id=${project.id}`}>
                      📊&nbsp;&nbsp;{project.projectName}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </li>
          <li className="lnb-item !mt-[15px] !h-[500px] border-b border-[#ddd]">
            <div
              className="lnb-header cursor-pointer"
              onClick={() => toggleSection("completedProjects")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex !mt-[12px] ">
                완료된 프로젝트{" "}
                <img
                  src={
                    toggles.completedProjects
                      ? "/images/ico/page_dropup_20_999999.svg"
                      : "/images/ico/page_dropdown_20_999999.svg"
                  }
                  alt="toggle"
                />
              </span>
            </div>
            {toggles.completedProjects && (
              <ol>
                {projects.completed.map((project) => (
                  <li key={project.id}>
                    <Link to={`/antwork/project/view?id=${project.id}`}>
                      📊&nbsp;&nbsp;{project.projectName}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </li>
          <li className="lnb-item">
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_setting_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link
                to="/antwork/setting/project"
                className="main-cate !text-[16px] text-[#757575]"
              >
                설정
              </Link>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
}
