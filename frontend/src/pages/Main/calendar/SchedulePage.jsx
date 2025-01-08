import AntWorkLayout from "../../../layouts/AntWorkLayout";
import Schedule from "../../../components/main/Calendar/Schedule";
import useAuthStore from "../../../store/AuthStore";
import { useEffect } from "react";

export default function SchedulePage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <Schedule />
      </AntWorkLayout>
    </>
  );
}
