import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProject, getProjects } from "../../../api/projectAPI";
import useAuthStore from "../../../store/AuthStore";

export default function ProjectMainSection() {
  const [projects, setProjects] = useState([]);
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("사용자 정보:", user);
        const projectData = await getProjects(user?.uid); // API 호출
        console.log("Fetched project data:", projectData); // 데이터 확인
        if (projectData == null) {
          return;
        }
        setProjects(projectData); // 상태에 데이터 저장
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("프로젝트 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchProjects(); // 컴포넌트 마운트 시 데이터 가져오기
  }, [user]); // UID 변경 시 데이터 다시 가져오기

  // 프로젝트 삭제 핸들러
  const handleDeleteProject = async (projectId) => {
    console.log("projectId : " + projectId);
    if (
      !window.confirm(
        "정말로 이 프로젝트를 삭제하시겠습니까? 이 프로젝트 관련한 모든 정보들이 함께 삭제됩니다."
      )
    )
      return;

    try {
      await deleteProject(projectId);

      // 삭제된 프로젝트를 프로젝트 목록에서 제거
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );

      alert("프로젝트가 성공적으로 삭제되었습니다!");
      // 프로젝트 목록 새로고침
      window.location.reload();
    } catch (error) {
      alert("프로젝트 삭제 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <article className="page-list">
        <div className="content-header">
          <div className="max-w-9xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-xl font-semibold">My Projects</h1>
              <p className="text-sm text-gray-500">내가 참여 중인 프로젝트</p>
            </div>
            <div className="space-y-4">
              {/* 프로젝트 리스트 렌더링 */}
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id} // 프로젝트 ID를 키로 사용
                    className="bg-white p-8 rounded-lg shadow flex items-center justify-between transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-8">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src="/images/Antwork/project/project.png"
                          alt="Project Icon"
                          className="w-full h-full object-cover mr-4"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Link
                          to={`/antwork/project/view?id=${project.id}`} // 상세 페이지 경로
                          className="font-medium text-[20px]"
                        >
                          {project.projectName}
                        </Link>
                        <span className="text-[14px] text-[#6b7280]">
                          {project.status === 0 ? "In Progress" : "Completed"}{" "}
                          {/* 상태 표시 */}
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-10 h-10 rounded-lg overflow-hidden bg-transparent border-none"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <img
                        src="/images/Antwork/project/project_delete.png"
                        alt="Delete"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No projects found</p>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
