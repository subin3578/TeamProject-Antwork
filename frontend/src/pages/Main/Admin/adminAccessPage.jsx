import AdminAccess from "@/components/main/admin/AdminAccess";
import AntWorkLayout from "@/layouts/AntWorkLayout";
import useAuthStore from "@/store/AuthStore";
import { useEffect } from "react";

export default function AdminAccessPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <AdminAccess />
      </AntWorkLayout>
    </>
  );
}
