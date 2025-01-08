import { useEffect, useState } from "react";
import { useInviteModal } from "../../../hooks/chatting/invitemodal";
import useModalStore from "../../../store/modalStore";
import useToggle from "../../../hooks/useToggle";
import { getAllChannels, getDmList, searchChatRooms } from "../../../api/chattingAPI"; // 경로 확인
import { Link, NavLink } from "react-router-dom";
import { channelStore } from "../../../store/chattingStore";
import useAuthStore from "../../../store/AuthStore"; // userId 가져오기 위한 import
import ChannelListItem from "./chatting/ChannelListItem";
import DmListItem from "./chatting/DmListItem";

export default function ChattingAside({ asideVisible, channelId, isDm }) {
  const [toggleStates, toggleState] = useToggle({
    isDMOpen: true,
    isChannelOpen: true,
    isPersonalOpen: true,
  });

  const channels = channelStore((state) => state.channels);
  const setChannels = channelStore((state) => state.setChannels);
  const [dms, setDms] = useState([]); // 디엠 방 목록 상태의 기본값을 빈 배열로 설정
  const [loading, setLoading] = useState(true); // 로딩 상태

  const openModal = useModalStore((state) => state.openModal);
  const inviteModalProps = useInviteModal(); // 채팅방 초대 모달 props 호출

  const user = useAuthStore((state) => state.user); // user 정보가 state에 저장되어 있다고 가정
  // userId를 상태에서 가져옵니다.
  const { userId } = useAuthStore((state) => state);

  const [searchText, setSearchText] = useState(""); // 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    setLoading(true);
    try {
      const results = await searchChatRooms(user.id, searchText.trim());
      console.log("검색 결과:", results); // 결과 확인
      setSearchResults(results); // 상태 업데이트
    } catch (error) {
      console.error("채널 검색 실패:", error);
      setSearchResults([]); // 검색 실패 시 빈 배열 설정
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("최종 업데이트된 searchResults:", searchResults);
  }, [searchResults]);

  // 채널 목록을 가져오는 함수
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        if (user === null)
          return;
        const response = await getAllChannels(user.id); // getAllChannels 함수 호출
        console.log(response)
        setChannels(response); // API에서 받은 채널 목록 상태에 저장
      } catch (error) {
        console.error("채널 목록을 가져오는 데 실패했습니다:", error);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    const fetchDMs = async () => {
      if (user.id) {
        try {
          const dmData = await getDmList(user.id);

          // 데이터 로깅 추가
          console.log('DM Data:', dmData);

          // 안전한 배열 설정
          if (Array.isArray(dmData)) {
            setDms(dmData);
          } else {
            // 예상치 못한 데이터 형태
            console.error('Unexpected response format:', dmData);
            setDms([]);
          }
        } catch (error) {
          console.error("디엠 목록을 가져오는 데 실패했습니다:", error);
          setDms([]);
        }
      }
    };

    fetchDMs();
  }, [user.id]);

  return (
    <aside className={`sidebar ${!asideVisible ? "hidden" : ""} table-cell px-[20px]`}>
      {/* 타이틀 영역 */}
      <div className="logo pb-4 border-b border-gray-200 mb-4">
        <div className="flex flex-col">
          <span className="sub-title text-gray-500 text-[14px] mb-1">Direct Message</span>
          <div className="flex items-center">
            <span className="title font-extrabold text-[22px]">Chatting</span>
            <span className="ml-2 text-xl">💬</span>
          </div>
        </div>
      </div>

      <ul className="lnb inline-grid">
        {/* 채팅 홈 아이콘 */}
        <li className="lnb-item">
          <div className="lnb-header !mb-[10px]">
            <img
              src="/images/ico/page_home_22_999999.svg"
              className="cate-icon !w-[22px] !h-[22px]"
              alt="Chat Home Icon"
            />
            <Link to="/antwork/chatting" className="main-cate !text-[16px]">
              홈
            </Link>
          </div>

          {/* 채널 검색 섹션 */}
          <li className="lnb-item mt-6 !pb-[15px] border-b border-[#ddd]">
            <div
              className="flex items-center gap-2 cursor-pointer px-2 py-2 hover:bg-gray-100 rounded-md"
              onClick={() => toggleState("isSearchOpen")}
            >
              <img
                src="/images/ico/page_search_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
                alt="Search Icon"
              />
              <span className="main-cate !text-[16px] ">채널 검색</span>
            </div>


            <div
              className={`overflow-hidden transition-all duration-300 ${toggleStates.isSearchOpen ? "max-h-screen" : "max-h-0"
                }`}
            >
              {/* 검색 입력창 */}
              <div className="mt-2">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="찾고 싶은 채널 이름을 입력하세요."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm w-full"
                />
              </div>

              {/* 검색 결과 */}
              <div className="mt-4">
                {loading ? (
                  <p className="text-gray-500">검색 결과는 아래에 표시됩니다.</p>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.map((channel) => (
                      <li key={channel.id}>
                        <NavLink
                          to={`/antwork/chatting/channel/${channel.id}`}
                          className="flex items-center p-2 rounded-md hover:bg-gray-100 transition"
                        >
                          <span className="mr-2">{channel.ChannelPrivacy ? "🔒" : "📢"}</span>
                          <p className="font-medium text-gray-800 text-[14px] truncate">{channel.name}</p>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchText && <p className="text-gray-500">검색 결과가 없습니다.</p>
                )}
              </div>
            </div>
          </li>
          <div className="min-h-[500px]">
            {/* 개인 채팅 섹션 */}
            <div className="mt-6">
              <div className="flex items-center justify-between">



                <div
                  className="flex items-center gap-2 cursor-pointer px-2 py-2 hover:bg-gray-100 rounded-md"
                  onClick={() => toggleState("isPersonalOpen")}
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-lg transition-transform ${toggleStates.isPersonalOpen ? "rotate-180" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <span className="text-[14px] font-semibold text-gray-700">✉️ 나의 채팅</span>
                </div>
                <button
                  className="image-button-css !bg-[url('/images/ico/page_write_22_999999.svg')] cursor-pointer display-block 0 hover:bg-blue-200 w-8 h-8 rounded-full"
                  onClick={() => openModal("createDm", {})}
                >
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${toggleStates.isPersonalOpen ? "max-h-screen" : "max-h-0"
                  }`}
              >
                <ul className="ml-1 mt-2 space-y-2">
                  {dms.length > 0 ? (
                    dms.map((dm) => (
                      <DmListItem dm={dm} user={user} />
                    ))
                  ) : (
                    <li className="text-gray-500 p-2 text-[14px]">디엠방이 없습니다.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 채널 섹션 */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-2 cursor-pointer px-2 py-2 hover:bg-gray-100 rounded-md"
                  onClick={() => toggleState("isChannelOpen")}
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-lg transition-transform ${toggleStates.isChannelOpen ? "rotate-180" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <span className="text-[14px] font-semibold text-gray-700">👥 채널 (단체 채팅) </span>
                </div>
                <button
                  className="image-button-css !bg-[url('/images/ico/page_write_22_999999.svg')] cursor-pointer display-block
            cursor-pointer text-blue-500 hover:bg-blue-200 w-8 h-8 rounded-full flex items-center justify-center text-xl"
                  onClick={() => openModal("createChannel", {})}
                >

                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${toggleStates.isChannelOpen ? "max-h-screen" : "max-h-0"
                  }`}
              >
                <ul className="ml-1 mt-2 space-y-2">
                  {channels.length > 0 ? (
                    channels.map((channel) => (
                      <ChannelListItem channel={channel} user={user} />
                    ))
                  ) : (
                    <li className="text-gray-500 p-2 text-[14px]">채널이 없습니다.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* 설정 섹션 */}
          <div
            className="w-full px-[20px] py-[10px] bg-white"
          >
            <div className="lnb-header">
              <img
                src="/images/ico/page_setting_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
                alt="Settings Icon"
              />
              <Link to="/antwork/setting/chatting" className="main-cate !text-[16px] text-[#757575]">
                설정
              </Link>
            </div>
          </div>

        </li>

      </ul>


    </aside>




  );

}
