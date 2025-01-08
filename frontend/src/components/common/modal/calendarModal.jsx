import {
  deleteShare,
  getCalendarModal,
  getCalendarShare,
  shareCalendar,
} from "@/api/calendarAPI";
import { fetchDepartmentsByCompanyId } from "@/api/departmentAPI";

import useAuthStore from "@/store/AuthStore";
import { useCalendarStore } from "@/store/CalendarStore";
import { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

export default function CalendarModal() {
  const [departments, setDepartments] = useState([]);
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]); // 선택된 사용자
  const [viewers, setViewers] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState([]);
  const closeModal = useCalendarStore((state) => state.closeModal);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        if (user?.company) {
          const data = await fetchDepartmentsByCompanyId(user.company);
          setDepartments(data);
          console.log("ididididid:::::" + user.uid);
          const data2 = await getCalendarModal(user.uid);
          setCalendars(data2);
          console.log("dddddddd:::" + JSON.stringify(data2));
        }
      } catch (error) {
        console.error("부서 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchDepartments();
  }, [user]);
  const toggleDepartment = (departmentId) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  // 2. 초대 가능한 사용자 추가
  const handleInvite = (user) => {
    // 이미 초대된 사용자 또는 선택된 사용자 확인

    if (!viewers.some((viewer) => viewer.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    } else {
      alert("이미 초대된 사용자입니다.");
    }
  };

  const selectCalendar = async (calendar) => {
    setSelectedCalendar([]);
    console.log(calendar);
    setSelectedCalendar((prev) => [...prev, calendar]);
    console.log("셀렉셀렉" + JSON.stringify(selectedCalendar));
    const updatedViewer = await getCalendarShare(calendar.calendarId);
    setViewers([]);
    console.log("updatedCollaborators : " + updatedViewer);
    setViewers(updatedViewer);
  };

  const handleRemove = (user) => {
    setSelectedUsers((prev) =>
      prev.filter((selected) => selected.id !== user.id)
    );
  };

  const handleRemoveCalendar = (calendar) => {
    setSelectedCalendar((prev) =>
      prev.filter((selected) => selected.calendarId !== calendar.calendarId)
    );
  };

  const handleSendInvite = async () => {
    if (selectedCalendar.length === 0) {
      alert("공유할 캘린더를 선택하세요.");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("초대할 협업자를 선택하세요.");
      return;
    }
    console.log("공유공유공유::::" + selectedCalendar[0].calendarId);
    console.log("공유공유공유::::" + JSON.stringify(selectedUsers));
    const userIds = selectedUsers.map((user) => user.id);
    try {
      await shareCalendar(selectedCalendar[0].calendarId, userIds);
      alert("협업자가 성공적으로 초대되었습니다!");

      // 협업자 목록 다시 불러오기
      const updatedViewer = await getCalendarShare(
        selectedCalendar[0].calendarId
      );
      setViewers([]);
      console.log("updatedCollaborators : " + updatedViewer);
      setViewers(updatedViewer);

      // 선택된 사용자 초기화
      setSelectedUsers([]);
      closeModal;
    } catch (error) {
      console.error("협업자 추가 실패:", error);
      alert("협업자 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };
  // 기존 협업자 삭제
  const handleRemoveViewers = async (userId) => {
    console.log(selectedCalendar[0]);
    await deleteShare(selectedCalendar[0].calendarId, userId);
    const updatedViewer = await getCalendarShare(
      selectedCalendar[0].calendarId
    );
    setViewers([]);
    console.log("updatedCollaborators : " + updatedViewer);
    setViewers(updatedViewer);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[900px] h-[570px] p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">캘린더 초대</h2>

        <div className="flex h-[86%]">
          <div className="w-1/3 border rounded-lg p-4 overflow-y-auto mr-4">
            <h3 className="font-semibold text-lg mb-2">공유할 캘린더 선택</h3>
            {calendars.length > 0 ? (
              <ul>
                {calendars.map((calendar) => (
                  <li key={calendar.calendarId} className="mb-3 flex">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => selectCalendar(calendar)}
                    >
                      <span className="font-semibold text-gray-700">
                        {calendar.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">캘린더 데이터를 불러오는 중...</p>
            )}
          </div>
          {/* 부서별 사용자 트리 */}
          <div className="w-1/3 border rounded-lg p-4 overflow-y-auto mr-4">
            {departments.length > 0 ? (
              <ul>
                {departments.map((department) => (
                  <li key={department.id} className="mb-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleDepartment(department.id)}
                    >
                      {expandedDepartments[department.id] ? (
                        <AiOutlineMinus className="mr-2" />
                      ) : (
                        <AiOutlinePlus className="mr-2" />
                      )}
                      <span className="font-semibold text-gray-700">
                        {department.name}
                      </span>
                    </div>

                    {/* 부서 확장 시 사용자 목록 표시 */}
                    {expandedDepartments[department.id] && (
                      <ul className="ml-6 mt-2 border-l-2 border-gray-300 pl-2">
                        {department.users && department.users.length > 0 ? (
                          department.users.map((user) => (
                            <li
                              key={user.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                            >
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-800 font-medium">
                                  {user.position}
                                </span>
                                <span className="text-gray-800">
                                  {user.name}
                                </span>
                              </div>

                              {!selectedUsers.some(
                                (selected) => selected.id === user.id
                              ) && (
                                <button
                                  onClick={() => handleInvite(user)}
                                  className="text-blue-500 hover:underline"
                                >
                                  추가
                                </button>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500 ml-4">
                            이 부서에 사용자가 없습니다.
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">부서 데이터를 불러오는 중...</p>
            )}
          </div>

          {/* 선택된 협업자 목록 */}
          <div className="w-1/3 border rounded-lg p-4 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-2">공유할 캘린더</h3>
            {selectedCalendar.length > 0 ? (
              <ul>
                {selectedCalendar.map((calendar) => (
                  <li
                    key={calendar.calendarId}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <span className="text-gray-800 font-medium">
                      {calendar.name}
                    </span>
                    <button
                      //   onClick={() => handleRemoveCollaborator(user.id)}
                      onClick={() => handleRemoveCalendar(calendar)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">공유할 캘린더가 없습니다.</p>
            )}

            <h3 className="font-semibold text-lg mb-2 mt-[38px]">
              기존 공유인원
            </h3>
            {viewers.length > 0 ? (
              <ul>
                {viewers.map((viewer) => (
                  <li
                    key={viewer.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <span className="text-gray-800 font-medium">
                      {viewer.name} ({viewer.position})
                    </span>
                    <button
                      //   onClick={() => handleRemoveCollaborator(user.id)}
                      onClick={() => handleRemoveViewers(viewer.id)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">공유인원이 없습니다.</p>
            )}

            <h3 className="font-semibold text-lg mb-2 mt-[38px]">
              초대할 인원
            </h3>
            {selectedUsers.length > 0 ? (
              <ul>
                {selectedUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <span className="text-gray-800 font-medium">
                      {user.name} ({user.position})
                    </span>
                    <button
                      onClick={() => handleRemove(user)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">초대할 인원이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleSendInvite}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            초대
          </button>
        </div>
      </div>
    </div>
  );
}
