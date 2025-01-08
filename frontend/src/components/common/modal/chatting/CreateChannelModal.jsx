// src/components/modals/CreateChannelModal.js
import { useState } from "react";
import { channelStore } from "../../../../store/chattingStore";
import useAuthStore from "../../../../store/AuthStore";
import { createChannel } from "../../../../api/chattingAPI";

// eslint-disable-next-line react/prop-types
export default function CreateChannelModal({ closeModal }) {
  const [channelName, setChannelName] = useState("");
  const [channelPrivacy, setChannelPrivacy] = useState(false);
  const user = useAuthStore((state) => state.user);

  const addChannel = channelStore((state) => state.addChannel);
  const handleNameChange = (e) => {
    setChannelName(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (user === null) {
      return;
    }

    console.log("데이터 전송 전");
    // 채널 생성에 필요한 데이터
    const data = {
      name: channelName,
      userId: user?.id, // 예시로 고정된 userId 사용 (실제 상황에 맞게 수정)
      channelPrivacy: channelPrivacy ? 1 : 0, // channelPrivacy 사용
    };

    console.log("채널 생성 데이터 이름 들어와줘:", data);

    try {
      console.log("채널 생성 데이터:", data); // 데이터 로그 찍기
      // 채널 생성 API 호출
      const channelIdData = await createChannel(data);
      addChannel({
        ChannelPrivacy: channelPrivacy,
        id: channelIdData.data,
        name: channelName,
        ownerId: user?.id,
      });
      alert("채널이 성공적으로 생성되었습니다.");
      closeModal(); // 모달 닫기
    } catch (error) {
      console.error("채널 생성 실패:", error);
      alert("채널 생성에 실패했습니다. 다시 시도해주세요.");
      console.error(
        "에러의 상세 내용:",
        error.response || error.message || error
      );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">채널 생성</h2>
      <form className="flex flex-col space-y-4" onSubmit={submitHandler}>
        <div>
          <label htmlFor="channelName" className="text-sm font-medium">
            채널 이름
          </label>
          <input
            id="channelName"
            type="text"
            placeholder="채널 이름을 입력하세요"
            className="mt-2 p-2 border rounded w-full"
            value={channelName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label className="text-sm font-medium">채널 공개 여부</label>
          <div className="flex space-x-4 mt-2">
            <label>
              <input
                type="radio"
                name="channelPrivacy"
                checked={channelPrivacy}
                onChange={() => setChannelPrivacy(true)}
              />
              공개
            </label>
            <label>
              <input
                type="radio"
                name="channelPrivacy"
                checked={!channelPrivacy}
                onChange={() => setChannelPrivacy(false)}
              />
              비공개
            </label>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={submitHandler}
          >
            추가
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2 bg-gray-300 rounded-lg"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
