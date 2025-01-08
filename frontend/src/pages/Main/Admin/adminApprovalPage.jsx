import AdminApproval from "@/components/main/admin/AdminApproval";
import AntWorkLayout from "@/layouts/AntWorkLayout";

import useAuthStore from "@/store/AuthStore";
import { useEffect } from "react";

export default function AdminApprovalPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <AdminApproval />
      </AntWorkLayout>
    </>
  );
}
