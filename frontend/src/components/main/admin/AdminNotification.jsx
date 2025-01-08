import { useState, useEffect } from "react";
import useAuthStore from "./../../../store/AuthStore";
import { fetchDepartmentsByCompanyId } from "@/api/departmentAPI";
import { fetchUsersByDepartmentId } from "@/api/userAPI";
import {
  sendNotification,
  fetchNotificationsBySenderId,
} from "./../../../api/notificationAPI";
import { FaBuilding, FaHistory } from "react-icons/fa";

export default function AdminNotification() {
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("전체");
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const maxCharacters = 300;

  // 부서 데이터 불러오기
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartmentsByCompanyId(user.company);
        setDepartments(data);
      } catch (error) {
        console.error("부서 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    if (user.company) loadDepartments();
  }, [user.company]);
  useEffect(() => {
    if (user.id) loadNotificationHistory();
  }, [user.id]);

  // 부서별 사용자 불러오기
  const loadUsersByDepartment = async (departmentId) => {
    try {
      const data = await fetchUsersByDepartmentId(departmentId);
      setUsers(data);
    } catch (error) {
      console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    setSelectedUser("");
    if (departmentId) loadUsersByDepartment(departmentId);
    else setUsers([]);
  };

  // 보낸 알림 히스토리 불러오기
  const loadNotificationHistory = async () => {
    try {
      const history = await fetchNotificationsBySenderId(user.id);
      setNotificationHistory(history);
    } catch (error) {
      console.error("알림 히스토리를 불러오는 중 오류 발생:", error);
    }
  };

  // 알림 전송 핸들러
  const sendHandler = async () => {
    if (isSending || !message.trim()) return;
    setIsSending(true);

    try {
      let targetId;
      if (targetType === "ALL") targetId = null;
      else if (targetType === "DEPARTMENT" && selectedDepartment)
        targetId = selectedDepartment;
      else if (targetType === "USER" && selectedUser) targetId = selectedUser;
      else {
        alert("대상을 선택해주세요!");
        return;
      }

      const senderId = user.id;
      const payload = {
        targetType,
        targetId,
        message,
        senderId,
        metadata: { projectId: 456, projectName: "테스트 프로젝트" },
      };

      await sendNotification(payload);
      alert("알림이 성공적으로 전송되었습니다!");
      setMessage("");
      loadNotificationHistory(); // 전송 후 히스토리 갱신
    } catch (error) {
      alert(error.message || "알림 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        🔔 알림 관리
      </h1>

      {/* 알림 작성 */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-600 flex items-center">
          <FaBuilding className="mr-2 text-blue-500" /> 알림 작성
        </h2>

        {/* 대상 선택 */}
        <select
          className="w-full p-3 border rounded-md mb-4"
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
        >
          <option value="ALL">전체 회사</option>
          <option value="DEPARTMENT">특정 부서</option>
          <option value="USER">특정 사용자</option>
        </select>

        {/* 부서 선택 */}
        {(targetType === "DEPARTMENT" || targetType === "USER") && (
          <select
            className="w-full p-3 border rounded-md mb-4"
            value={selectedDepartment}
            onChange={(e) => handleDepartmentChange(e.target.value)}
          >
            <option value="">부서를 선택하세요</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        )}

        {/* 사용자 선택 (특정 사용자일 경우) */}
        {targetType === "USER" && selectedDepartment && (
                  <select
                    className="w-full p-3 border rounded-md mb-4"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">사용자를 선택하세요</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                )}


        {/* 메시지 입력 */}
        <textarea
          className="w-full p-4 border rounded-md mb-4"
          rows="4"
          placeholder="알림 메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxCharacters))}
        ></textarea>

        <button
          className={`w-full bg-blue-500 text-white py-2 rounded-md transition ${
            isSending ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          onClick={sendHandler}
          disabled={isSending}
        >
          {isSending ? "전송 중..." : "알림 전송"}
        </button>
      </div>

      {/* 보낸 알림 히스토리 */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-600 flex items-center">
          <FaHistory className="mr-2 text-blue-500" /> 보낸 알림 히스토리
        </h2>

        {notificationHistory.length > 0 ? (
          <table className="w-full table-auto border-collapse border rounded-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">#</th>
                <th className="p-3 border">대상</th>
                <th className="p-3 border">메시지</th>
                <th className="p-3 border">전송일</th>
              </tr>
            </thead>
            <tbody>
              {notificationHistory.map((notification, index) => (
                <tr key={notification.id} className="hover:bg-gray-100">
                  <td className="p-3 border text-center">{index + 1}</td>
                  <td className="p-3 border text-center">
                    {notification.targetType}
                  </td>
                  <td className="p-3 border">{notification.message}</td>
                  <td className="p-3 border text-center">
                    {new Date(
                      Date.UTC(
                        notification.createdAt[0], // 연도
                        notification.createdAt[1] - 1, // 월 (0부터 시작)
                        notification.createdAt[2], // 일
                        notification.createdAt[3], // 시
                        notification.createdAt[4], // 분
                        notification.createdAt[5], // 초
                        Math.floor(notification.createdAt[6] / 1000000) // 밀리초 (나노초를 밀리초로 변환)
                      )
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">조회된 알림이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
