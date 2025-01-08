import AntWorkLayout from "../../layouts/AntWorkLayout";
import MainSection from "./../../components/main/mainSection";
import useAuthStore from "./../../store/AuthStore";
import { useEffect } from "react";

export default function MainPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  return (
    <>
      z
      <AntWorkLayout>
        <MainSection />
      </AntWorkLayout>
    </>
  );
}
