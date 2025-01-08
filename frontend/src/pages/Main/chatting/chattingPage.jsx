import { useEffect } from "react";
import ChattingMain from "../../../components/main/chatting/chattingMain";
import AntWorkLayout from "../../../layouts/AntWorkLayout";
import ChattingModal from "../../../components/common/modal/chattingModal";
import ChattingModalController from "../../../components/common/modal/chatting/ChattingModalController";
import useAuthStore from "../../../store/AuthStore"; // 토큰 갱신을 위한 store import

export default function chattingPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth); // 토큰 갱신 함수 가져오기

  useEffect(() => {
    initializeAuth(); // 페이지에 들어갈 때마다 토큰 갱신
  }, [initializeAuth]);

  return (
    <>
      <AntWorkLayout>
        <ChattingMain />
        <ChattingModalController />
      </AntWorkLayout>
    </>
  );
}
