import { useEffect, useState } from "react";
import DmMain from "../../../components/main/chatting/DmMain"; // 디엠 메시지를 보여줄 컴포넌트
import AntWorkLayout from "../../../layouts/AntWorkLayout"; // 레이아웃
import ChattingModal from "../../../components/common/modal/chattingModal"; // 모달 (필요한 경우)
import ChattingModalController from "../../../components/common/modal/chatting/ChattingModalController"; // 모달 컨트롤러
import { useParams } from "react-router-dom"; // URL 파라미터를 사용해 DM ID를 가져옴
import { getDmMessages } from "../../../api/chattingAPI"; // 디엠 메시지를 가져오는 API 함수
import { StompProvider } from "@/provides/StompProvide";
import { WS_URL } from "@/api/_URI";

export default function DmChattingPage() {
  const { id: dmId } = useParams(); // URL에서 디엠 채팅방 ID를 가져옴
  const [messages, setMessages] = useState([]); // 메시지 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 디엠 메시지를 가져오는 useEffect
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getDmMessages(dmId); // 디엠 메시지 가져오기
        setMessages(response.data); // 메시지 상태에 저장
      } catch (error) {
        console.error("디엠 메시지 불러오기 오류:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchMessages();
  }, [dmId]); // dmId가 변경될 때마다 메시지 재요청

  return (
    <AntWorkLayout>
      {/* <StompProvider brokerURL={WS_URL}
        onConnectCallback={() => { console.log("CONNECT") }}
        onCloseCallback={() => { console.log("CLOSE") }}
      > */}
      <DmMain
        messages={messages} // 가져온 디엠 메시지
        loading={loading} // 로딩 상태
      />
      {/* </StompProvider> */}
      <ChattingModalController /> {/* 모달 컨트롤러 */}
    </AntWorkLayout>
  );
}
