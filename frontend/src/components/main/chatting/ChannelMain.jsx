import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
  useCallback,
} from "react";
import {
  getChannel,
  getChannelMessages,
  getDmMessages,
  leaveChannel,
  sendChannelMessage,
  getChannelMembers,
  addChannelMember,
  changeChannelTitle,
  uploadFileToChannel,
  visitChannel,
} from "../../../api/chattingAPI";
import useToggle from "./../../../hooks/useToggle";
import useModalStore from "./../../../store/modalStore";
import { useParams } from "react-router-dom";
import useAuthStore from "../../../store/AuthStore";
// import { Client } from "@stomp/stompjs"; // 제거
// import { WS_URL } from "@/api/_URI"; // 제거
import formatChatTime from "@/utils/chatTime";
import MessageItem from "./MessageItem";

// ---- 추가: useStomp 훅 불러오기
import { useStomp } from "@/provides/StompProvide";
import { filterMessage } from "@/utils/messageUtils"; // 금칙어 필터링 함수

export default function ChannelMain() {
  const [zoomLevel, setZoomLevel] = useState(1); // 초기 확대 비율은 1 (100%)
  const { id: channelId } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [messages, setMessages] = useState([]); // 메시지 상태
  const user = useAuthStore((state) => state.user);
  const chatBoxRef = useRef(null); // 채팅창 Ref

  // ---- stompClientRef 제거
  // const stompClientRef = useRef(null);
  // ---- useStomp 훅 사용
  const { isConnected, subscribe, sendMessage } = useStomp();
  const [members, setMembers] = useState([]);
  const [isMyChannel, setIsMyChannel] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const [searchText, setSearchText] = useState("");
  const [highlightedId, setHighlightedId] = useState(null);
  const chatRefs = useRef([]);
  const [isChangeTitleMode, setIsChangeTitleMode] = useState(false);
  const [titleChangeText, setTitleChangeText] = useState("");
  const [file, setFile] = useState(null); // 첨부된 파일 상태
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // 현재 채널의 이미지 메시지 필터링
  const imageMessages = messages.filter((message) =>
    message.fileType?.startsWith("image")
  );


  // WebSocket 연결 설정
  useEffect(() => {
    if (!user?.id || !channelId || !isConnected) {
      console.error("❌ User ID 또는 Channel ID가 없어요.");
      return;
    }

    const unsubscribe = subscribe(`/topic/chatting/channel/${channelId}/messages`,
      async (message) => {
        try {
          const newMessage = JSON.parse(message.body);
          if (newMessage.senderId === user?.id) {
            return;
          }
          console.log("📩 새 메시지 수신:", newMessage); // 메시지 수신 확인
          setMessages((prevMessages) => {
            return [...prevMessages, newMessage];
          });
          await visitChannel({ channelId, memberId: user.id });
          sendMessage(`/app/chatting/channel/${channelId}/visit`)
        } catch (error) {
          console.error("❌ 메시지 처리 중 에러:", error);
        }
      }
    )

    return () => {
      unsubscribe();
    };
  }, [user?.id, channelId, isConnected]); // 의존성 배열

  useEffect(() => {
    // (1) define within effect callback scope
    if (!isConnected) {
      return;
    }
    const visitChannelAsync = async () => {
      if (!channelId || !user?.id) return;

      try {
        await visitChannel({ channelId, memberId: user?.id });
        console.log("[ChannelMain] : 방문 소켓 날리기 전")
        sendMessage(`/app/chatting/channel/${channelId}/visit`)
        // TODO: 소켓 날림 : channelId
      } catch (error) {
        console.log(error);
      }
    };

    visitChannelAsync();
    // TODO: 소켓 날림 : channelId
  }, [channelId, isConnected]);

  // 이미지 모달
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => Math.max(0, prev - 1));
      } else if (
        e.key === "ArrowRight" &&
        currentImageIndex < imageMessages.length - 1
      ) {
        setCurrentImageIndex((prev) =>
          Math.min(imageMessages.length - 1, prev + 1)
        );
      } else if (e.key === "Escape") {
        setIsModalOpen(false); // ESC로 모달 닫기
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImageIndex, imageMessages.length]);

  // useToggle 훅 사용
  const [toggleStates, toggleState] = useToggle({
    isSidebarOpen: false, // 오른쪽 사이드바 토글
    isAlarmOn: true, // 알림 상태 토글
    isContactOpen: true, // 대화 상대 토글
    isPhotoOpen: false, // 사진 파일 토글
    isFileOpen: false, // 첨부 파일 토글
    isSearchOpen: false, // 검색창 토글
  });

  useEffect(() => {
    if (highlightedId !== null) {
      const targetElement = chatRefs.current[highlightedId];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedId]);

  useEffect(() => {
    if (toggleStates.isSearchOpen === false) {
      setHighlightedId(null);
    }
  }, [toggleStates.isSearchOpen]);

  const handleSearch = () => {
    const foundChat = messages.find((chat) =>
      chat.content.toLowerCase().includes(searchText.toLowerCase())
    );
    if (foundChat) {
      setHighlightedId(foundChat.id);
    } else {
      setHighlightedId(null);
      alert("검색 결과가 없습니다.");
    }
  };

  const scrollToBottom = useCallback(() => {
    if (chatBoxRef.current !== null) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatBoxRef]);

  useEffect(() => {
    setMessageInput("");
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const [loading, setLoading] = useState(true); // 로딩 상태



  // 최초 데이터 로딩
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channel = await getChannel(channelId);
        setChannelData(channel);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const msgs = await getChannelMessages(channelId);
        setMessages(msgs);
        console.log(msgs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchChannelMembers = async () => {
      try {
        const mem = await getChannelMembers(channelId);
        console.log(`members : `, mem);
        setMembers(mem);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChannelMembers();
    fetchChannel();
    fetchMessages();
  }, [channelId]);

  const { openModal } = useModalStore(); // 모달 열기 함수 가져오기


  // 파일 전송 핸들러
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      try {
        const response = await uploadFileToChannel({
          channelId,
          file: selectedFile,
          content: `[파일] ${selectedFile.name}`,
          senderId: user?.id,
        });

        // 서버에서 반환된 메시지 데이터 활용
        const fileMessage = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
        };

        // ---- 로컬에서도 메시지 목록에 추가
        setMessages((prev) => [...prev, fileMessage]);

        // ---- STOMP 메시지 전송 (sendMessage 사용)
        sendMessage(`/app/chatting/channel/${channelId}/send`, {
          id: fileMessage.id,
          senderId: fileMessage.senderId,
          userName: fileMessage.userName,
          content: fileMessage.content,
          createdAt: fileMessage.createdAt.toISOString(),
          fileUrl: fileMessage.fileUrl,
          fileType: selectedFile.type,
        });

        fileInputRef.current.value = "";
      } catch (error) {
        console.error("파일 전송 실패:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      alert("메시지를 입력하세요.");
      return;
    }

    const filteredContent = filterMessage(messageInput.trim()); // 금칙어 필터링 적용


    const newMessage = {
      content: messageInput.trim(),
      senderId: user?.id,
      userName: user?.name,
      channelId,
      createdAt: new Date(),
    };

    try {
      const result = await sendChannelMessage(newMessage); // 서버 전송
      console.log(`메시지 보내기 성공 : `, result);

      const msg = {
        id: result.id,
        senderId: result.senderId,
        userName: result.userName,
        channelId: result.channelId,
        content: result.content, // 필터링된 내용 저장
        createdAt: result.createdAt,
      };

      // ---- 로컬 메시지 목록에 즉시 반영
      setMessages((prevMessages) => [...prevMessages, msg]);

      // ---- STOMP 메시지 전송
      sendMessage(`/app/chatting/channel/${channelId}/send`, msg);

      setMessageInput(""); // 입력 초기화
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  const handleJoin = async () => {
    if (!confirm("해당 방에 참여하시겠습니까")) {
      return;
    }

    try {
      const addMembers = await addChannelMember(channelId, [user]);
      console.log("채널 참여 성공 : ", addMembers);
      setMembers((prev) => [...prev, ...addMembers]);
    } catch (error) {
      console.error("채널 참여 실패");
    }
  };

  useEffect(() => {
    setIsMyChannel(members.some((member) => member.userId === user.id));
  }, [members, user.id]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };


  function onClickLeaveButton() {
    return async () => {
      if (user === null) return;

      const proceed = confirm("정말 방에서 나가시겠습니까?");
      if (proceed) {
        console.log(user?.id);
        await leaveChannel({ channelId, userId: user?.id });
        console.log("나가기 성공");
      }
    };
  }

  return (
    <div className="w-[100%] rounded-3xl shadow-md z-20 overflow-hidden max-w-9xl">
      <div className="flex h-full">
        {/* 메인 채팅 영역 */}
        <div
          className={`flex flex-col h-full transition-all duration-300 w-full min-w-[300px] max-h-[670px]`}
        >
          {/* 채팅 헤더 */}
          <div className="flex-none px-6 py-4 bg-white border-b border-white-200 rounded-t-3xl shadow flex items-center justify-between">
            {/* 프로필 섹션 */}
            <div className="flex items-stretch">
              {isChangeTitleMode ? (
                <div className="flex items-stretch ml-4 text-[22.5px]">
                  <input
                    type="text"
                    value={titleChangeText}
                    onChange={(e) => {
                      setTitleChangeText(e.target.value);
                    }}
                  />
                  <button
                    className="font-semibold text-blue-500 text-[12px]"
                    onClick={async () => {
                      try {
                        await changeChannelTitle({
                          channelId,
                          name: titleChangeText,
                        });
                        setChannelData((prev) => ({
                          ...prev,
                          name: titleChangeText,
                        }));
                        setIsChangeTitleMode((prev) => !prev);
                      } catch (err) {
                        console.error("이름 수정 실패 : ", err);
                      }
                    }}
                  >
                    변경
                  </button>
                </div>
              ) : (
                <div className="flex items-center ml-4 gap-2">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                    {channelData?.name}
                  </h1>
                  {channelData?.ownerId === user.id ? (
                    <button
                      className="font-semibold text-blue-500"
                      onClick={() => {
                        setIsChangeTitleMode((prev) => !prev);
                        setTitleChangeText(channelData?.name);
                      }}
                    >
                      편집
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            {/* 아이콘 섹션 */}
            <div className="flex items-center space-x-4">
              {/* 고정핀 아이콘 */}
              <button
                className="p-2 rounded-full hover:bg-gray-300 focus:outline-none "
                onClick={() => {
                  console.log("고정핀 기능 실행");
                }}
              >
                <img
                  src="/images/ico/고정핀.svg"
                  alt="Pin"
                  className="w-8 h-8"
                />
              </button>

              {/* 검색 아이콘 및 입력창 */}
              <div className="relative flex items-center">
                {/* 검색 입력창 */}
                {toggleStates.isSearchOpen && (
                  <div className="relative flex items-center ml-2">
                    <input
                      type="text"
                      value={searchText}
                      placeholder="검색어를 입력하세요."
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition-all duration-300"
                      style={{ width: "200px" }}
                    />
                    {/* 입력 지우기 버튼 */}
                    {searchText && (
                      <button
                        className="absolute right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                        onClick={() => setSearchText("")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 001.414 1.414L11 12.414l3.293 3.293a1 1 0 001.414-1.414L12.414 11l3.293-3.293a1 1 0 00-1.414-1.414L11 9.586 7.707 6.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                <button
                  className="p-2 rounded-full hover:bg-gray-300 focus:outline-none transition"
                  onClick={() => toggleState("isSearchOpen")}
                >
                  <img
                    src="/images/ico/돋보기.svg"
                    alt="Search"
                    className="w-8 h-8"
                  />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-300 focus:outline-none transition"
                  onClick={onClickLeaveButton()}
                >
                  <img
                    src="/images/ico/outchat.svg"
                    alt="Search"
                    className="w-8 h-8"
                  />
                </button>
                <button
                  className="p-2 rounded-full focus:outline-none "
                  onClick={() => toggleState("isSidebarOpen")}
                >
                  <img
                    src="/images/ico/menu_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                    alt="Menu"
                    className="w-8 h-8"
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50"
            ref={chatBoxRef}
          >
            {loading ? (
              <div>로딩 중...</div>
            ) : messages.length === 0 ? (
              <div>채팅 본문이 없습니다.</div>
            ) : (
              messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  index={index}
                  messages={messages}
                  user={user}
                  highlightedId={highlightedId}
                  chatRefs={chatRefs}
                  imageMessages={imageMessages}
                  setCurrentImageIndex={setCurrentImageIndex}
                  setIsModalOpen={setIsModalOpen}
                  isModalOpen={isModalOpen}
                  formatChatTime={formatChatTime}
                  channelId={channelId}
                  // stompClientRef 제거
                  currentImageIndex={currentImageIndex}
                />
              ))
            )}
          </div>

          {/* 입력창 */}
          <div className="flex-none px-6 py-4 bg-white border-t border-gray-200 rounded-b-3xl">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                disabled={!isMyChannel}
                placeholder={
                  isMyChannel
                    ? "메시지를 입력하세요."
                    : "💡채널에 참여하면 바로 메시지를 보낼 수 있습니다. '참여' 버튼을 눌러 함께 대화해보세요! "
                }
                className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              {/* 파일 첨부 버튼 */}
              <button
                className="p-3 rounded-full hover:bg-gray-200 focus:outline-none"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src="/images/ico/file.svg" alt="Attach" />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange} // 파일 변경 시 자동 전송
                />
              </button>

              {/* 전송 버튼 */}
              {isMyChannel ? (
                <button
                  className="ml-4 px-6 py-3 text-lg font-semibold rounded-full shadow-md"
                  style={{ backgroundColor: "#eff6ff", color: "gray-800" }}
                  onClick={handleSendMessage}
                >
                  전송
                </button>
              ) : (
                <button
                  className="ml-4 px-6 py-3 text-lg font-semibold rounded-full shadow-md"
                  style={{ backgroundColor: "#eff6ff", color: "gray-800" }}
                  onClick={handleJoin}
                >
                  참여
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 토글 패널 */}
        <div
          className={`fixed top-30 right-0 h-full bg-white w-[20%] rounded-3xl p-6 shadow-lg border-l transition-transform transform ${toggleStates.isSidebarOpen ? "translate-x-0" : "translate-x-full"
            } duration-300`}
        >
          {/* 상단 영역 */}
          <div className="flex items-center justify-between mb-6">
            {/* 사이드바 닫기 버튼 */}
            <button
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              onClick={() => toggleState("isSidebarOpen")}
            >
              <img src="/images/ico/closechat.svg"></img>
            </button>

            {/* 채팅방 이름 */}
            <h3 className="text-lg font-semibold text-gray-900">
              {channelData?.name}
            </h3>
            {/* 오른쪽 아이콘들 */}
            <div className="flex items-center space-x-4">
              {/* 알림 아이콘 */}
              <button
                className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                onClick={() => toggleState("isAlarmOn")}
              >
                <img
                  src={
                    toggleStates.isAlarmOn
                      ? "/images/ico/alerm.svg"
                      : "/images/ico/alermoff.svg"
                  }
                  alt="알림 아이콘"
                />
              </button>
            </div>
          </div>

          {/* 대화 상대 */}
          <div className="my-5">
            <div
              className="flex items-center justify-between cursor-pointer border-b border-gray-200"
              onClick={() => toggleState("isContactOpen")}
            >
              <h3 className="text-lg font-semibold mb-2">채널 멤버</h3>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform ${toggleStates.isContactOpen ? "rotate-180" : "rotate-0"
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            {toggleStates.isContactOpen && (
              <ul className="space-y-4 mt-4">
                {members.map((member) => (
                  <li className={`flex items-center  ${channelData?.ownerId === member.userId ? 'text-blue-700 font-bold' : ''}`} key={member.userId}>
                    <img
                      src={
                        member.profileImageUrl ||
                        "https://via.placeholder.com/50"
                      }
                      alt="Profile"
                      className={`w-8 h-8 mr-4 rounded-full`}
                    />
                    {member.userName}
                    {channelData?.ownerId === member.userId ? '👑' : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            {/* 사진 파일 */}
            <div className="my-5">
              <div
                className="flex items-center justify-between cursor-pointer border-b border-gray-200"
                onClick={() => toggleState("isPhotoOpen")}
              >
                <h3 className="text-lg font-semibold mb-2">최근 사진</h3>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${toggleStates.isPhotoOpen ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {toggleStates.isPhotoOpen && (
                <div className="flex gap-4 mt-4 overflow-x-auto">
                  {messages
                    .filter((message) => message.fileType?.startsWith("image"))
                    .slice(-3) // 최근 3개의 이미지
                    .map((image, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <img
                          src={image.fileUrl}
                          alt={`사진 ${index + 1}`}
                          className="w-24 h-24 rounded-md shadow-md"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 첨부 파일 */}
            <div className="my-5">
              <div
                className="flex items-center justify-between cursor-pointer border-b border-gray-200"
                onClick={() => toggleState("isFileOpen")}
              >
                <h3 className="text-lg font-semibold mb-2">첨부 파일</h3>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${toggleStates.isFileOpen ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {toggleStates.isFileOpen && (
                <div className="space-y-2 mt-4">
                  {messages
                    .filter(
                      (message) =>
                        message.fileType && // 파일 메시지인지 확인
                        !message.fileType.startsWith("image") // 이미지 제외
                    )
                    .slice(-3) // 최근 3개의 파일
                    .map((file, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="text-lg">📁</span>
                        <p className="text-sm font-medium text-gray-800">
                          {file.fileName || `파일 ${index + 1}`}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 사진 파일 모달 */}
            {isPhotoModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-[80%] max-h-[80%] overflow-y-auto p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">모든 사진</h3>
                  {Object.entries(photoGroups).map(([date, files]) => (
                    <div key={date}>
                      <h4 className="font-semibold mb-2">{date}</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {files.map((file, index) => (
                          <img
                            key={index}
                            src={file.fileUrl}
                            alt={file.fileName || "사진"}
                            className="w-24 h-24 rounded-md shadow-md"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    className="text-red-500 mt-4"
                    onClick={() => setIsPhotoModalOpen(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}

            {/* 첨부 파일 모달 */}
            {isFileModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-[80%] max-h-[80%] overflow-y-auto p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">모든 첨부 파일</h3>
                  {Object.entries(fileGroups).map(([date, files]) => (
                    <div key={date}>
                      <h4 className="font-semibold mb-2">{date}</h4>
                      <ul>
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center mb-2">
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {file.content}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button
                    className="text-red-500 mt-4"
                    onClick={() => setIsFileModalOpen(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="my-5">
            <div
              className="flex items-center justify-between cursor-pointer border-b border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-2">채널 안내</h3>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-m">
                📢 초대와 파일 전송이 가능합니다. 사용자를 초대하여 멤버를 추가할 수 있습니다.<br />
                👑 소유자만 채널 이름을 변경할 수 있으며, 나갈 경우 소유권이 자동 이임됩니다.<br />
                🚨 채팅 보호를 위해 관리자가 금칙어를 설정합니다.
              </p>



            </div>
          </div>

          {/* 사용자 초대 버튼 */}
          <div className=" pt-6 mt-6">
            <button
              className="w-full flex items-center justify-center gap-4 bg-blue-500 text-white px-6 py-3 rounded-md text-[16px] hover:shadow-xl transition-transform hover:scale-105"
              onClick={() => openModal("invite", { channelId })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-semibold">사용자 추가</span>
            </button>
          </div>
        </div>
      </div>


    </div>
  );

  function onClickLeaveButton() {
    return async () => {
      if (user === null) return;

      const proceed = confirm("정말 방에서 나가시겠습니까?");
      if (proceed) {
        console.log(user?.id);
        await leaveChannel({ channelId, userId: user?.id });
        console.log("나가기 성공");
      } else {
      }
    };
  }
}
