import AdminDepartment from "../../../components/main/admin/AdminDepartment";
import AntWorkLayout from "./../../../layouts/AntWorkLayout";
import useAuthStore from "./../../../store/AuthStore";
import { useEffect } from "react";

export default function AdminDepartmentPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      <AntWorkLayout>
        <AdminDepartment />
      </AntWorkLayout>
    </>
  );
}
