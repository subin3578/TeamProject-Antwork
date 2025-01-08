import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineEdit,
  AiOutlineUserAdd,
} from "react-icons/ai";
import useAuthStore from "./../../../store/AuthStore";
import useModalStore from "../../../store/modalStore";
import {
  fetchDepartmentsByCompanyId,
  updateDepartmentName,
  moveUserToDepartment,
  deleteDepartmentAPI,
} from "../../../api/departmentAPI";
import AdminModal from "../../common/modal/adminModal";

export default function AdminDepartment() {
  const user = useAuthStore((state) => state.user);
  const { openModal, closeModal } = useModalStore();
  const [unassignedUsers, setUnassignedUsers] = useState([]); // 미지정 사용자 상태

  // 상태 관리
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [draggedUser, setDraggedUser] = useState(null);
  const [targetDepartmentId, setTargetDepartmentId] = useState(null);

  // 부서 데이터 로드
  const fetchDepartments = async () => {
    if (!user?.company) return;

    try {
      const data = await fetchDepartmentsByCompanyId(user.company);
      setDepartments(data);
      // 미지정 상태 처리: ID가 0이거나 "unassigned"인 부서 찾기
      const unassigned = data.find(
        (dept) => dept.id === 0 || dept.name === "미지정 사용자"
      );
      setUnassignedUsers(unassigned ? unassigned.users : []);
    } catch (error) {
      console.error("부서 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 서버에서 부서 데이터를 다시 불러오기
  const reloadDepartments = async () => {
    try {
      const data = await fetchDepartmentsByCompanyId(user.company);
      setDepartments(data);

      // 미지정 상태 처리: ID가 0이거나 "unassigned"인 부서 찾기
      const unassigned = data.find(
        (dept) => dept.id === 0 || dept.name === "미지정 사용자"
      );
      setUnassignedUsers(unassigned ? unassigned.users : []);
    } catch (error) {
      console.error("부서 데이터 다시 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [user]);

  // 부서 이름 저장 핸들러
  const handleSaveDepartmentName = async (id, newName) => {
    if (!newName.trim()) {
      alert("부서 이름을 입력하세요.");
      return;
    }

    try {
      const updatedDepartment = await updateDepartmentName(id, {
        name: newName,
      });
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept.id === id ? { ...dept, name: updatedDepartment.name } : dept
        )
      );
      alert("부서 이름이 성공적으로 수정되었습니다.");
      setEditingDepartment(null);
    } catch (error) {
      console.error("부서 이름 수정 실패:", error);
      alert("부서 이름 수정 중 오류가 발생했습니다.");
    }
  };

  // 사용자 드래그 시작 핸들러
  const handleDragStart = (user, currentDepartmentId) => {
    setDraggedUser({ ...user, currentDepartmentId });
  };

  // 부서 드롭 핸들러
  const handleDrop = async (targetDepartment) => {
    if (!draggedUser) return;

    try {
      await moveUserToDepartment(draggedUser.id, targetDepartment.id);

      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) => {
          if (dept.id === targetDepartment.id) {
            return { ...dept, users: [...dept.users, draggedUser] };
          }
          if (dept.id === draggedUser.currentDepartmentId) {
            return {
              ...dept,
              users: dept.users.filter((user) => user.id !== draggedUser.id),
            };
          }
          return dept;
        })
      );

      alert(
        `${draggedUser.name}님이 ${targetDepartment.name} 부서로 이동되었습니다.`
      );
    } catch (error) {
      console.error("사용자 이동 실패:", error);
      alert("사용자 이동 중 오류가 발생했습니다.");
    } finally {
      setDraggedUser(null);
    }
  };

  // 부서 추가 핸들러
  const handleAddDepartment = () => {
    openModal("add-department", {
      id: user.company,
      onCreate: (newDepartment) => {
        setDepartments((prevDepartments) => [
          ...prevDepartments,
          newDepartment,
        ]);
      },
    });
  };

  // 부서 삭제 핸들러
  const handleDeleteDepartment = () => {
    if (!selectedDepartment) {
      alert("삭제할 부서를 선택하세요.");
      return;
    }

    openModal("delete-department", {
      department: selectedDepartment,
      departments, // 전체 부서 목록 전달
      targetDepartmentId, // 상태 전달 (값만 전달되므로 상태 업데이트가 불가함)
      setTargetDepartmentId, // 상태 업데이트 함수 전달
      onConfirm: proceedDeleteDepartment, // 삭제 실행 함수
      closeModal, // 모달 닫기 함수
    });
  };

  // 삭제 처리 함수
  const proceedDeleteDepartment = async (targetDepartmentId) => {
    try {
      const payload = { targetDepartmentId: targetDepartmentId || null };
      await deleteDepartmentAPI(selectedDepartment.id, payload);

      // 상태 업데이트 (임시 제거)
      setDepartments((prevDepartments) =>
        prevDepartments.filter((dept) => dept.id !== selectedDepartment.id)
      );

      alert("부서가 성공적으로 삭제되었습니다.");
      setSelectedDepartment(null);

      // 상태 동기화 (서버 리로딩)
      reloadDepartments();
      closeModal(); // 모달 닫기
    } catch (error) {
      console.error("부서 삭제 실패:", error);
      alert("부서 삭제 중 오류가 발생했습니다.");
    }
  };

  const renderTree = (departments) => (
    <>
      {departments.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          등록된 부서가 없습니다.
        </p>
      ) : (
        <ul className="ml-4 border-l border-gray-300">
          {departments.map((department) => (
            <li
              key={department.id}
              className="mb-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(department)}
            >
              <div className="flex items-center group">
                <button
                  aria-label={`Toggle ${department.name}`}
                  className="mr-2 text-gray-500 hover:text-gray-700 transition-transform duration-300"
                  onClick={() =>
                    setExpandedDepartments((prev) => ({
                      ...prev,
                      [department.id]: !prev[department.id],
                    }))
                  }
                >
                  {expandedDepartments[department.id] ? (
                    <AiOutlineMinus />
                  ) : (
                    <AiOutlinePlus />
                  )}
                </button>
                {editingDepartment === department.id ? (
                  <input
                    type="text"
                    className="flex-1 px-2 py-1 rounded border border-gray-300 focus:ring focus:ring-blue-300"
                    defaultValue={department.name}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveDepartmentName(department.id, e.target.value);
                      } else if (e.key === "Escape") {
                        setEditingDepartment(null);
                      }
                    }}
                    onBlur={(e) => {
                      if (editingDepartment !== null) {
                        handleSaveDepartmentName(department.id, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => setSelectedDepartment(department)}
                    className={`flex-1 px-2 py-1 rounded cursor-pointer transition ${
                      selectedDepartment?.id === department.id
                        ? "bg-gray-300 font-bold text-gray-800"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {department.name}
                  </span>
                )}
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditingDepartment(department.id)}
                >
                  <AiOutlineEdit />
                </button>
              </div>
              {expandedDepartments[department.id] &&
                department.users.length > 0 && (
                  <ul className="ml-4 list-disc text-gray-700 transition-all duration-300">
                    {department.users.map((user) => (
                      <li
                        key={user.id}
                        draggable
                        onDragStart={() => handleDragStart(user, department.id)}
                        className="bg-white shadow-md rounded-md p-3 mb-2 cursor-pointer"
                      >
                        <div className="text-gray-800 font-semibold">
                          {user.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          이메일: {user.email || "N/A"}
                        </div>
                        <div className="text-gray-500 text-sm">
                          직급: {user.position || "N/A"}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      <div className="w-1/4 bg-white shadow-md rounded-lg p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-gray-700">조직도</h2>
        <div className="mb-4 flex space-x-2">
          <button
            onClick={handleAddDepartment}
            className="w-1/2 flex items-center justify-center text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            <AiOutlinePlus className="mr-2" />
            부서 추가
          </button>
          <button
            onClick={handleDeleteDepartment}
            className="w-1/2 flex items-center justify-center text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            <AiOutlineDelete className="mr-2" />
            부서 삭제
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{renderTree(departments)}</div>
      </div>

      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-4">
        {selectedDepartment ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {selectedDepartment.name} 부서 정보
            </h2>

            {/* 부서 요약 정보 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-md shadow-sm">
                <h3 className="text-gray-600 font-medium mb-1">부서 ID</h3>
                <p className="text-gray-800 font-semibold">
                  {selectedDepartment.id}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md shadow-sm">
                <h3 className="text-gray-600 font-medium mb-1">소속 회사</h3>
                <p className="text-gray-800 font-semibold">
                  {user?.companyName || "정보 없음"}
                </p>
              </div>
            </div>

            {/* 부서 차트 */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                구성원 및 활동 상태
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{
                      width: `${selectedDepartment.users?.length * 10 || 10}%`,
                    }}
                  ></div>
                </div>
                <span className="text-gray-600 font-medium">
                  {selectedDepartment.users?.length || 0} 명 참여
                </span>
              </div>
            </div>

            {/* 구성원 목록 */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                구성원 목록
              </h3>
              <ul className="grid grid-cols-2 gap-4">
                {selectedDepartment.users?.map((user) => (
                  <li
                    key={user.id}
                    className="p-3 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center text-gray-700"
                  >
                    <div className="text-lg font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      {user.position || "직급 없음"}
                    </div>
                  </li>
                ))}
              </ul>
              <button className="flex items-center mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                <AiOutlineUserAdd className="mr-2" />
                구성원 추가
              </button>
            </div>

            {/* 최근 활동 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                최근 활동
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>"XYZ 프로젝트" 완료</li>
                <li>신규 인원 2명 추가</li>
                <li>"UI 개선 프로젝트" 참여 중</li>
              </ul>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">부서를 선택하세요.</p>
        )}
      </div>

      <AdminModal />
    </div>
  );
}
