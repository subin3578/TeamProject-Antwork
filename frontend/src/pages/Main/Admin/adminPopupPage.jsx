import AdminMain from "../../../components/main/admin/AdminMain";
import AntWorkLayout from "../../../layouts/AntWorkLayout";
import useAuthStore from "../../../store/AuthStore";
import { useEffect } from "react";
import AdminPopup from "./../../../components/main/admin/AdminPopup";

export default function AdminPopPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <AdminPopup />
      </AntWorkLayout>
    </>
  );
}
