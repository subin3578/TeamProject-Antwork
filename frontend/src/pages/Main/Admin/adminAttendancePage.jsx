import AntWorkLayout from "@/layouts/AntWorkLayout";
import AdminAttendance from "@/components/main/admin/AdminAttendance";
import useAuthStore from "@/store/AuthStore";
import { useEffect } from "react";

export default function AdminAttendancePage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <AdminAttendance />
      </AntWorkLayout>
    </>
  );
}
