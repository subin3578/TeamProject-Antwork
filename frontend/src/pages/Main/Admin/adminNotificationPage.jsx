import useAuthStore from "@/store/AuthStore";
import { useEffect } from "react";
import AntWorkLayout from "./../../../layouts/AntWorkLayout";
import AdminNotification from "@/components/main/admin/AdminNotification";

export default function AdminNotificationPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <AdminNotification />
      </AntWorkLayout>
    </>
  );
}
