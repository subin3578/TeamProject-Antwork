import { useEffect } from "react";
import ProjectAside from "../../../components/common/aside/projectAside";
import ProjectMainSection from "../../../components/main/project/projectMainSection";
import AntWorkLayout from "../../../layouts/AntWorkLayout";
import useAuthStore from "../../../store/AuthStore";

export default function ProjectMainPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);

  return (
    <>
      <AntWorkLayout>
        <ProjectAside />
        <ProjectMainSection />
      </AntWorkLayout>
    </>
  );
}
