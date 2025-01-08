import AdminService from "@/components/main/admin/AdminService";
import AntWorkLayout from "@/layouts/AntWorkLayout";
import useAuthStore from "@/store/AuthStore";
import { useEffect } from "react";

export default function AdminServicePage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <AdminService />
      </AntWorkLayout>
    </>
  );
}
