import AntWorkLayout from "../../../layouts/AntWorkLayout";
import MyCalendar from "../../../components/main/Calendar/MyCalendar";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/AuthStore";
// import ScheduleList from "../../../components/main/Calendar/ScheduleList";

export default function CalendarPage() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // 앱 로드 시 Access Token 갱신
  }, [initializeAuth]);
  const [listMonth, setListMonth] = useState(null); // 상태 관리
  if (listMonth == null) {
    setListMonth("dayGridMonth");
  }
  return (
    <>
      <AntWorkLayout setListMonth={setListMonth}>
        <MyCalendar listMonth={listMonth} setListMonth={setListMonth} />
      </AntWorkLayout>
    </>
  );
}
