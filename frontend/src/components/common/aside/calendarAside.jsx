import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCalendar,
  insertCalendar,
  updateCalendar,
  deleteCalendar,
  getSchedule,
} from "../../../api/calendarAPI";
import useAuthStore from "../../../store/AuthStore";
import { useCalendarStore } from "../../../store/CalendarStore";
import { Client } from "@stomp/stompjs";
import { WS_URL } from "@/api/_URI";

export default function CalendarAside({ asideVisible, setListMonth }) {
  const calendarRef = useRef(null);
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const uid = user?.uid;
  const id = user?.id;
  const navigate = useNavigate();
  const [isMyOpen, setIsMyOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const handleButtonClick = () => {
    console.log("버튼 클릭!");
    setListMonth("listWeek"); // listMonth 값 업데이트
  };
  const handleButtonClick2 = () => {
    console.log("버튼 클릭!");
    setListMonth("listMonth"); // listMonth 값 업데이트
  };
  const [calendars, setCalendars] = useState([]);
  const [shares, setShares] = useState([]);
  const [editingId, setEditingId] = useState(null); // 수정 중인 캘린더 ID
  const [newName, setNewName] = useState(""); // 수정 중인 이름
  const [color, setColor] = useState("");
  // 새 캘린더 추가 함수
  const addCalendar = async (e) => {
    e.preventDefault();
    if (confirm("캘린더를 추가 하시겠습니까?")) {
      const newCalendar = {
        no: calendars.length,
        name: `새 캘린더`, // 기본 이름
        user_id: uid,
        view: id,
        color: "#b2d1ff",
      };
      setCalendars([...calendars, newCalendar]); // 상태 업데이트
      await insertCalendar(newCalendar);
      const data = await getCalendar(id);
      console.log(data);
      console.log(shares);
      const filteredData = data.filter(
        (data) => !shares.some((share) => share.calendarId === data.calendarId)
      );
      setData(filteredData);
    }
  };

  const startEditing = (no, currentName) => {
    setEditingId(no);
    setNewName(currentName); // 기존 이름 설정
  };

  const removeItem = (id) => {
    setData((prevData) => prevData.filter((item) => item.calendarId !== id));
  };

  // 이름 저장
  const saveName = (no) => {
    const fetchData = async () => {
      const finalColor = color.trim() === "" ? "not" : color;

      console.log("ccoollllll::" + finalColor);
      setColor(finalColor);

      const response = await updateCalendar(no, newName, finalColor);
      console.log("돌아오는건 바로바로~" + JSON.stringify(data));
      console.log("돌아오는건 바로바로~" + JSON.stringify(response));
      removeItem(response.calendarId);
      setData((prevData) => [...prevData, response]);
    };
    console.log("흠흠흠..." + calendars);
    fetchData();
    setEditingId(null); // 수정 모드 종료
    setNewName(""); // 입력 초기화
    // window.location.reload(); // 페이지 새로 고침
  };

  // 수정 취소
  const cancelEditing = () => {
    setEditingId(null);
    setNewName("");
  };

  // 캘린더 삭제
  const deleteCal = (no) => {
    console.log(no);
    if (confirm("정말 삭제하시겠습니까? 일정도 같이 삭제됩니다.")) {
      const fetchData = async () => {
        await deleteCalendar(no);
        const data = await getCalendar(id);
        const filteredData = data.filter(
          (data) =>
            !shares.some((share) => share.calendarId === data.calendarId)
        );
        setData(filteredData);
      };
      fetchData();
    }
  };

  const [data, setData] = useState([]);
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCalendar(id);
      const data2 = await getSchedule(id);

      const updatedData = data2.filter((item) => {
        const startTime = Array.isArray(item.start)
          ? arrayToDate(item.start)
          : new Date(item.start);
        const endTime = Array.isArray(item.end)
          ? arrayToDate(item.end)
          : new Date(item.end);
        const today = new Date(); // 현재 날짜를 기준으로 검사
        today.setHours(0, 0, 0, 0); // 오늘의 00:00:00
        const tomorrow = new Date(today); // 내일의 00:00:00
        tomorrow.setDate(today.getDate() + 1);

        // 조건: start <= today < end
        return startTime <= tomorrow && endTime >= today;
      });
      console.log("흐흐흐흐흠흠흠흠누누누" + JSON.stringify(data));

      const filteredData = data.filter((item) => item.share === false);
      const filteredData2 = data.filter((item) => item.share === true);
      setData(filteredData);
      setShares(filteredData2);
      setSchedule(updatedData);
    };

    fetchData();
  }, [uid]);

  function arrayToDate(arr) {
    const [year, month, day, hour = 0, minute = 0] = arr;
    return new Date(year, month - 1, day, hour, minute);
  }

  // WebSocket 설정
  useEffect(() => {
    if (!user?.id) {
      console.error(
        "❌ User ID is not available. WebSocket will not be initialized."
      );
      return;
    }

    const client = new Client({
      brokerURL: WS_URL, // WebSocket 서버 URL
      reconnectDelay: 5000, // 재연결 딜레이
      heartbeatIncoming: 4000, // Heartbeat 설정 (수신)
      heartbeatOutgoing: 4000, // Heartbeat 설정 (송신)
      debug: (msg) => console.log("🔌 WebSocket Debug:", msg), // 디버그 로그
    });

    client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      calendarRef.current = client;

      // 구독 설정
      const subscription = client.subscribe(
        `/topic/schedules/${user.id}`, // 표준 WebSocket 경로
        (message) => {
          try {
            const newSchedule = JSON.parse(message.body);
            console.log("🔔 알림 메시지 수신:", [newSchedule]);

            if (newSchedule.action == "update") {
              const updatedData = [newSchedule].filter((item) => {
                const startTime = Array.isArray(item.start)
                  ? arrayToDate(item.start)
                  : new Date(item.start);
                console.log(startTime);
                const endTime = Array.isArray(item.end)
                  ? arrayToDate(item.end)
                  : new Date(item.end);
                const today = new Date(); // 현재 날짜를 기준으로 검사
                today.setHours(0, 0, 0, 0); // 오늘의 00:00:00
                const tomorrow = new Date(today); // 내일의 00:00:00
                tomorrow.setDate(today.getDate() + 1);

                return startTime <= tomorrow && endTime >= today;
              });
              if (updatedData.length < 1) {
                setSchedule((prevSchedule) =>
                  prevSchedule.filter(
                    (schedule) => schedule.id !== newSchedule.id
                  )
                );
              } else {
                setSchedule((prevSchedule) => {
                  // 기존 데이터에 같은 ID가 있는지 확인
                  const isDuplicate = updatedData.some((newItem) =>
                    prevSchedule.some(
                      (existingItem) => existingItem.id === newItem.id
                    )
                  );

                  // 중복된 ID가 없다면 데이터를 추가
                  if (!isDuplicate) {
                    return [...prevSchedule, ...updatedData];
                  }

                  // 중복된 ID가 있으면 기존 상태 유지
                  return prevSchedule;
                });
              }
            }
          } catch (error) {
            console.error("❌ 메시지 처리 중 에러:", error);
          }
        }
      );

      console.log("📩 Subscribed to: /topic/schedules/" + user.id);

      return () => subscription.unsubscribe();
    };

    client.onDisconnect = () => {
      console.log("🔴 WebSocket 연결 해제");
      calendarRef.current = null;
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame.headers["message"], frame.body);
    };

    try {
      client.activate();
      console.log("🔌 WebSocket 활성화 중...");
    } catch (error) {
      console.error("❌ WebSocket 활성화 중 에러:", error);
    }

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user?.id]);

  useEffect(() => {
    console.log("흠.........." + JSON.stringify(schedule)); // 상태가 변경된 후에 schedule을 출력
  }, [schedule]); // schedule 상태가 변경될 때마다 실행

  const navigateToEditPage = (id) => {
    console.log();
    if (id) {
      navigate("/antwork/schedule", {
        state: {
          id: id,
        }, // eventData를 state로 전달
      });
    }
  };

  const { selectedIds, toggleCheckbox } = useCalendarStore();

  const handleColorChange = (newColor) => {
    // newColor가 없으면 기본값으로 "not" 설정
    const finalColor = newColor.trim() === "" ? "not" : newColor;

    console.log("ccoollllll::" + finalColor);
    setColor(finalColor);
  };

  const openModal = useCalendarStore((state) => state.openModal);

  return (
    <>
      <aside className={`sidebar ${!asideVisible ? "hidden" : ""}`}>
        <div className="logo !border-b-0">
          <span className="sub-title">My Schedule</span>

          <span className="title">Calendar</span>
          <Link
            to="/antwork/schedule"
            className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 mt-6 h-14"
            style={{ backgroundColor: "#D9E8FF" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xl">New Schedule</span>
          </Link>
        </div>
        <ul className="a mt-20">
          <li className="">
            <div>
              <button
                type="button"
                className="w-[195px] h-[40px] flex items-center border-b border-[#d9d9d9] mb-[15px]"
                onClick={() => setIsMyOpen(!isMyOpen)}
              >
                <span className="m-[3px] cursor-pointer">
                  <img
                    src={
                      isMyOpen
                        ? "/images/Antwork/main/drive/위화살표.png"
                        : "/images/Antwork/main/drive/아래화살표.png"
                    }
                    alt="화살표 아이콘"
                    className="w-4 h-4"
                  />
                </span>

                <span className="main-cate">🗓 내 캘린더</span>
              </button>
            </div>
            <div
              className={`Mydrive_List transition-all duration-300 overflow-hidden ${
                isMyOpen ? "max-h-screen" : "max-h-0"
              }`}
            >
              <ul>
                {data.map((item) => (
                  <li key={item.calendarId}>
                    <div className="flex items-center mb-2">
                      {/* 세련된 체크박스 */}
                      <input
                        type="checkbox"
                        id={`checkbox-${item.calendarId}`}
                        className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-200"
                        checked={selectedIds.includes(item.calendarId)}
                        onChange={() => toggleCheckbox(item.calendarId)}
                      />

                      {/* 이름 표시 또는 이름 변경 필드 */}
                      {editingId === item.calendarId ? (
                        <div>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border rounded-md w-[101px] px-2 py-1 ml-[10px]"
                          />
                          <br />
                          <button
                            onClick={() => saveName(item.calendarId)}
                            className="ml-2 text-green-500"
                          >
                            저장
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="ml-2 text-red-500"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <span className="ml-2">📅 {item.name}</span>
                      )}

                      {/* 이름 수정 버튼 */}
                      {editingId !== item.calendarId && (
                        <button
                          onClick={() =>
                            startEditing(item.calendarId, item.name)
                          }
                          className="ml-2 text-blue-500"
                        >
                          수정
                        </button>
                      )}

                      {/* 캘린더 삭제 버튼 */}
                      {editingId !== item.calendarId && (
                        <button
                          onClick={() => deleteCal(item.calendarId)}
                          className="ml-2 text-red-500"
                        >
                          삭제
                        </button>
                      )}
                      {editingId === item.calendarId ? (
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) => handleColorChange(e.target.value)} // 색상 변경 시 처리
                          id="colorCalendar"
                          className="w-[20px] h-[20px] rounded-full appearance-none bg-transparent border-none"
                        />
                      ) : (
                        <input
                          type="color"
                          value={item.color}
                          disabled
                          id="colorCalendar"
                          className="w-[20px] h-[20px] rounded-full appearance-none bg-transparent border-none"
                        />
                      )}
                    </div>
                  </li>
                ))}

                {/* 새 캘린더 추가 버튼 */}
                <li>
                  <button
                    onClick={addCalendar}
                    className="ml-[20px] text-blue-500"
                  >
                    + 캘린더 추가
                  </button>
                </li>
              </ul>
            </div>
          </li>
          <li className="">
            <div>
              <button
                type="button"
                className="w-[195px] h-[40px] flex items-center border-b border-[#d9d9d9] mb-[15px]"
                onClick={() => setIsShareOpen(!isShareOpen)}
              >
                <span className="m-[3px] cursor-pointer">
                  <img
                    src={
                      isShareOpen
                        ? "/images/Antwork/main/drive/위화살표.png"
                        : "/images/Antwork/main/drive/아래화살표.png"
                    }
                    alt="화살표 아이콘"
                    className="w-4 h-4"
                  />
                </span>

                <span className="main-cate">👨‍👧‍👧 공유 캘린더</span>
              </button>
            </div>
            <div
              className={`Mydrive_List transition-all duration-300 overflow-hidden ${
                isShareOpen ? "max-h-screen" : "max-h-0"
              }`}
            >
              <ul>
                {shares.map((item) => (
                  <li key={item.calendarId}>
                    <div className="flex items-center mb-2">
                      {/* 세련된 체크박스 */}
                      <input
                        type="checkbox"
                        id={`checkbox-${item.calendarId}`}
                        className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-200"
                        checked={selectedIds.includes(item.calendarId)}
                        onChange={() => toggleCheckbox(item.calendarId)}
                      />

                      {/* 이름 표시 또는 이름 변경 필드 */}
                      {editingId === item.calendarId ? (
                        <div>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border rounded-md w-[101px] px-2 py-1 ml-[10px]"
                          />
                          <br />
                          <button
                            onClick={() => saveName(item.calendarId)}
                            className="ml-2 text-green-500"
                          >
                            저장
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="ml-2 text-red-500"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <span className="ml-2">📅 {item.name}</span>
                      )}

                      {/* 이름 수정 버튼 */}
                      {editingId !== item.calendarId && (
                        <button
                          onClick={() =>
                            startEditing(item.calendarId, item.name)
                          }
                          className="ml-2 text-blue-500"
                        >
                          수정
                        </button>
                      )}

                      {/* 캘린더 삭제 버튼 */}
                      {editingId !== item.calendarId && (
                        <button
                          onClick={() => deleteCal(item.calendarId)}
                          className="ml-2 text-red-500"
                        >
                          삭제
                        </button>
                      )}
                      {editingId === item.calendarId ? (
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) => handleColorChange(e.target.value)} // 색상 변경 시 처리
                          id="colorCalendar"
                          className="w-[20px] h-[20px] rounded-full appearance-none bg-transparent border-none"
                        />
                      ) : (
                        <input
                          type="color"
                          value={item.color}
                          disabled
                          id="colorCalendar"
                          className="w-[20px] h-[20px] rounded-full appearance-none bg-transparent border-none"
                        />
                      )}
                    </div>
                  </li>
                ))}

                {/* 새 캘린더 추가 버튼 */}
                <li>
                  <button
                    onClick={addCalendar}
                    className="ml-[20px] text-blue-500"
                  >
                    + 캘린더 추가
                  </button>
                </li>
              </ul>
            </div>
          </li>
          <li className="">
            <div>
              <button
                type="button"
                className="w-[195px] h-[40px] flex items-center border-b border-[#d9d9d9] mb-[15px]"
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
              >
                <span className="m-[3px] cursor-pointer">
                  <img
                    src={
                      isScheduleOpen
                        ? "/images/Antwork/main/drive/위화살표.png"
                        : "/images/Antwork/main/drive/아래화살표.png"
                    }
                    alt="화살표 아이콘"
                    className="w-4 h-4"
                  />
                </span>

                <span className="main-cate">⏰ 오늘의 일정</span>
              </button>
            </div>
            <div
              className={`Mydrive_List transition-all duration-300 overflow-hidden ${
                isScheduleOpen ? "max-h-screen" : "max-h-0"
              } pl-8`}
            >
              <ul>
                {schedule.map((item, index) => (
                  <li key={index}>
                    <button onClick={() => navigateToEditPage(item.id)}>
                      <div className="flex items-start items-center mb-2 space-x-4 text-center">
                        <span>📄 &nbsp; {item.title}</span>
                      </div>
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={handleButtonClick2}>
                    <div className="flex items-start items-center mb-2 space-x-4">
                      <span>&nbsp; 📚 월간일정</span>
                    </div>
                  </button>
                  <button onClick={handleButtonClick}>
                    <div className="flex items-start items-center mb-2 space-x-4">
                      <span>&nbsp; 📕 주간일정</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div>
              <button className="main-cate " onClick={openModal}>
                🤝 캘린더 공유하기
              </button>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
}
