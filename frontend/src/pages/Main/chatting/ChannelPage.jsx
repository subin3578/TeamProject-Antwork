import AntWorkLayout from "../../../layouts/AntWorkLayout";
import ChattingModal from "../../../components/common/modal/chattingModal";
import ChannelMain from "../../../components/main/chatting/ChannelMain";
import ChattingModalController from "../../../components/common/modal/chatting/ChattingModalController";
import { StompProvider } from "@/provides/StompProvide";
import { WS_URL } from "@/api/_URI";
import { useEffect } from "react";
export default function ChannelPage() {

  return (
    <>
      <AntWorkLayout>
        <StompProvider brokerURL={WS_URL} onConnectCallback={() => { console.log("CONNECT") }}>
          <ChannelMain />
        </StompProvider>
        <ChattingModalController />
      </AntWorkLayout>
    </>
  );
}
