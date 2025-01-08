import { useEffect, useState } from "react";
import { getAllUser } from "../../../../api/userAPI"; // API to get users
import { addChannelMember, createDm } from "../../../../api/chattingAPI";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "@/store/AuthStore";

export default function DmCreateModal({ closeModal }) {
  // 초대 가능한 사용자와 선택된 사용자 상태
  const [inviteableUsers, setInviteableUsers] = useState([]); // 초대 가능한 사용자
  const [selectedUsers, setSelectedUsers] = useState([]); // 선택된 사용자
  const { id: channelId } = useParams();
  const { id: userId } = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  // 1. 초대 가능한 사용자 목록 불러오기
  useEffect(() => {
    console.log(`channel Id : ${channelId}`)
    async function fetchAllUser() {
      try {
        const users = await getAllUser(); // 사용자 데이터 가져오기
        setInviteableUsers(users); // 초대 가능한 사용자 목록 업데이트
      } catch (error) {
        console.error("유저 데이터를 가져오는 데 실패했습니다.", error);
      }
    }
    fetchAllUser();
  }, []);

  // 2. 초대 가능한 사용자 추가
  const handleInvite = (user) => {
    if (!selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]); // 선택된 사용자 추가
    }
  };

  // 3. 선택된 사용자 제거
  const handleRemove = (user) => {
    setSelectedUsers((prev) =>
      prev.filter((selected) => selected.id !== user.id)
    );
  };

  // 4. 초대 버튼 클릭 시 호출
  const handleSendInvite = async () => {
    if (selectedUsers.length === 0) {
      alert("초대할 사용자를 선택하세요.");
      return;
    }

    try {
      console.log("초대 버튼 클릭 - 채널 ID:", channelId); // *** 채널 ID 로그 출력 ***

      // 사용자 ID 배열 전송
      const userIds = selectedUsers.map((user) => user.id);
      const DmResponse = await createDm({ creatorId: userId, receiverIds: userIds })
      navigate(`/antwork/chatting/dm/${DmResponse.data}`)
      setSelectedUsers([]); // 선택된 사용자 초기화

    } catch (error) {
      console.error("멤버 추가 실패:", error);
      alert("멤버 초대에 실패했습니다. 다시 시도해주세요.");
    } finally {
      closeModal(); // 모달 닫기
    }
  };


  return (
    <div className="flex flex-col h-full overflow-hidden p-6 bg-white rounded-lg shadow-lg">
      {/* 제목 */}
      <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">
        DM 생성하기
      </h2>
      {/* 검색 필드 */}
      <div className="mb-4 flex items-center border rounded-lg px-3 py-2 bg-gray-50">
        <input
          type="text"
          placeholder="사용자 검색"
          className="flex-1 border-none bg-transparent focus:outline-none text-gray-600"
        />
      </div>
      {/* 초대 가능한 사용자와 선택된 사용자 영역 */}
      <div className="flex flex-1 space-x-4 h-full overflow-auto">
        {/* 초대 가능한 사용자 */}
        <div className="w-1/2 border rounded-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold">DM 초대 가능한 사용자</h3>
          <ul className="space-y-3">
            {inviteableUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between p-2 bg-white rounded-md shadow-sm"
              >
                <span>{user.name}</span>
                <button
                  onClick={() => handleInvite(user)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  초대
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 선택된 사용자 */}
        <div className="w-1/2 border rounded-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold">선택한 사용자</h3>
          <ul className="space-y-3">
            {selectedUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between p-2 bg-white rounded-md shadow-sm"
              >
                <span>{user.name}</span>
                <button
                  onClick={() => handleRemove(user)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  제거
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 하단 버튼 */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={handleSendInvite} // 초대 버튼 동작
          className="px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          생성
        </button>
        <button
          onClick={closeModal} // 닫기 버튼
          className="px-6 py-2 bg-gray-300 rounded-lg"
        >
          취소
        </button>
      </div>
    </div>
  );
}
