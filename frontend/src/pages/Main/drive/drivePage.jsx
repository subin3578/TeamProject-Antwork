import AntWorkLayout from "../../../layouts/AntWorkLayout";

import DriveSection from "../../../components/main/drive/driveSection";
import DriveAside from "../../../components/common/aside/driveAside";
import DriveModal from "../../../components/common/modal/driveModal";
import useAuthStore from "../../../store/AuthStore";
import { useEffect, useRef } from "react";

export default function DrivePage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const refreshUsage = useRef(null);
  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
      <DriveAside refreshUsage={refreshUsage} />
      <DriveSection refreshUsage={refreshUsage} />
        <DriveModal />
      </AntWorkLayout>
    </>
  );
}
