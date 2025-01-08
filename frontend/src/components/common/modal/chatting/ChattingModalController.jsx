// src/components/ChattingModalController.js
import InviteModal from "./InviteModal";
import CreateChannelModal from "./CreateChannelModal";
import useModalStore from "../../../../store/modalStore";
import DmCreateModal from "./DmCreateModal";

export default function ChattingModalController() {
  const { isOpen, type, closeModal } = useModalStore();

  if (!isOpen) return null;

  const renderModalContent = () => {
    switch (type) {
      case "invite":
        return <InviteModal closeModal={closeModal} />;
      case "createChannel":
        return <CreateChannelModal closeModal={closeModal} />;
      case "createDm":
        return <DmCreateModal closeModal={closeModal} />;
      default:
        return <div>모달 내용이 없습니다.</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 h-[80vh] flex flex-col">
        {renderModalContent()}
      </div>
    </div>
  );
}
