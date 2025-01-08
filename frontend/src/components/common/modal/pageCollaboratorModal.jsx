import React, { useState, useEffect } from "react";
import useModalStore from "../../../store/modalStore";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { fetchDepartmentsByCompanyId } from "@/api/departmentAPI";
import useAuthStore from "../../../store/AuthStore";
import {
  getPageCollaborators,
  addPageCollaborators,
  removePageCollaborator,
  getPageDetails,
  updateCollaboratorPermission,
} from "../../../api/pageAPI";
import { sendNotification } from "../../../api/notificationAPI";

export default function PageCollaboratorModal({
  pageId,
  onCollaboratorsUpdate,
}) {
  const { isOpen, type, closeModal } = useModalStore();
  const user = useAuthStore((state) => state.user);
  const [departments, setDepartments] = useState([]);
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [pageOwner, setPageOwner] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCollaborators = async () => {
    try {
      if (pageId) {
        console.log("Fetching collaborators for pageId:", pageId);
        const collaboratorsData = await getPageCollaborators(pageId);
        console.log("Collaborators data received:", collaboratorsData);
        setCollaborators(collaboratorsData);

        // 권한 정보를 userPermissions 상태에 설정
        const permissions = {};
        collaboratorsData.forEach((collaborator) => {
          permissions[collaborator.user_id] = collaborator.type;
        });
        setUserPermissions(permissions);
      }
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
      setCollaborators([]);
    }
  };

  const fetchPageDetails = async () => {
    try {
      const pageDetails = await getPageDetails(pageId);
      setPageOwner(pageDetails.pageOwner);
    } catch (error) {
      console.error("Failed to fetch page details:", error);
    }
  };

  useEffect(() => {
    console.log("Modal state:", { isOpen, type, pageId });
    if (isOpen && type === "page-collaborator" && pageId) {
      fetchCollaborators();
      fetchPageDetails();
    }
  }, [isOpen, type, pageId]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        if (user?.company) {
          console.log("Fetching departments...");
          const data = await fetchDepartmentsByCompanyId(user.company);
          console.log("Departments data:", data);
          setDepartments(data);
        }
      } catch (error) {
        console.error("부서 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    if (isOpen && type === "page-collaborator") {
      fetchDepartments();
    }
  }, [user, isOpen, type]);

  const toggleDepartment = (departmentId) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  const handleInvite = (user) => {
    if (
      !collaborators.some((collaborator) => collaborator.user_id === user.id)
    ) {
      setSelectedUsers((prev) => [...prev, user]);
    } else {
      alert("이미 초대된 사용자입니다.");
    }
  };

  const handleRemove = (user) => {
    setSelectedUsers((prev) =>
      prev.filter((selected) => selected.id !== user.id)
    );
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      const confirmed = confirm("기존 협업자를 삭제하시겠습니까?");
      if (!confirmed) return;

      // 생성자나 특정 조건�� 맞는 협업자를 삭제하지 않도록 필터링
      const collaborator = collaborators.find(
        (collaborator) => collaborator.user_id === userId
      );

      if (collaborator && collaborator.isOwner) {
        alert("생성자는 삭제할 수 없습니다.");
        return;
      }

      await removePageCollaborator(pageId, userId);
      console.log(`Removed collaborator ${userId}`);

      // 협업자 목록 업데이트
      const updatedCollaborators = await getPageCollaborators(pageId);
      setCollaborators(updatedCollaborators);
      onCollaboratorsUpdate?.(updatedCollaborators);

      alert("협업자가 삭제되었습니다.");
    } catch (error) {
      console.error("협업자 삭제 실패:", error);
      alert("협업자 삭제에 실패했습니다.");
    }
  };

  const handlePermissionChange = async (userId, permissionType) => {
    console.log(`Changing permission for user ${userId} to ${permissionType}`);
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: permissionType,
    }));

    try {
      // API 호출로 변경된 권한 저장
      await updateCollaboratorPermission(pageId, userId, permissionType);
      console.log(`Permission updated for user ${userId}`);
    } catch (error) {
      console.error("Failed to update permission:", error);
      alert("권한 변경에 실패했습니다.");
    }
  };

  // 협업자 추가
  async function handleConfirm() {
    if (isSubmitting) return; // 이미 제출 중이면 중단
    setIsSubmitting(true);

    try {
      if (!pageId) {
        alert("페이지 ID가 없습니다.");
        return;
      }

      let permissionsUpdated = false;
      let collaboratorsAdded = false;

      // 기존 협업자 권한 업데이트
      for (const collaborator of collaborators) {
        const currentPermission = userPermissions[collaborator.user_id];
        if (collaborator.type !== currentPermission) {
          await updateCollaboratorPermission(
            pageId,
            collaborator.user_id,
            currentPermission
          );
          console.log(`Updated permission for user ${collaborator.user_id}`);
          permissionsUpdated = true;
        }
      }

      // 선택된 멤버 추가
      if (selectedUsers.length > 0) {
        const collaboratorsWithPermissions = selectedUsers.map((user) => ({
          ...user,
          type: userPermissions[user.id] ?? 2, // 기본값은 읽기 권한 (2)
        }));

        await addPageCollaborators(pageId, collaboratorsWithPermissions);
        collaboratorsAdded = true;
      }

      const updatedCollaborators = await getPageCollaborators(pageId);
      setCollaborators(updatedCollaborators);
      onCollaboratorsUpdate?.(updatedCollaborators);

      for (const invitedUser of selectedUsers) {
        const defaultMessage = `${user?.name}님이 ${invitedUser?.name}님을 페이지에 초대하셨습니다.`;
        const payload = {
          targetType: "사용자",
          targetId: invitedUser.id,
          senderId: user.id,
          message: notificationMessage || defaultMessage,
          metadata: {
            url: `/antwork/page/write?id=${pageId}`,
          },
        };
        console.log(`🔔알림 전송 시작: ${invitedUser.name}`);
        console.log("📄 payload", payload);
        await sendNotification(payload);
        console.log(`🔔알림 전송 완료: ${invitedUser.name}`);
      }

      console.log("모든 알림 전송 완료");

      // 메시지 표시
      if (permissionsUpdated || collaboratorsAdded) {
        alert("변경 사항이 적용되었습니다!");
      } else {
        alert("변경 사항이 없습니다.");
      }

      setSelectedUsers([]);
      setNotificationMessage("");
      closeModal();
    } catch (error) {
      console.error("협업자 추가 실패:", error);
      alert("협업자 추가에 실패했습니다.");
    } finally {
      setIsSubmitting(false); // 요청 완료 후 제출 상태 해제
    }
  }

  const loadData = async () => {
    try {
      setIsLoading(true);

      // 1. 먼저 부서 데이터 로드
      if (user?.company) {
        const deptData = await fetchDepartmentsByCompanyId(user.company);
        setDepartments(deptData);
      }

      // 2. 그 다음 협업자 데이터 로드
      if (pageId) {
        const collaboratorsData = await getPageCollaborators(pageId);
        setCollaborators(collaboratorsData);
      }
    } catch (error) {
      console.error("데이터 로드 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && type === "page-collaborator") {
      loadData();
    }
  }, [isOpen, type, pageId, user]);

  const renderCollaborators = () => {
    if (isLoading) {
      return <p className="text-gray-500 text-center">로딩 중...</p>;
    }

    if (!Array.isArray(collaborators) || collaborators.length === 0) {
      return <p className="text-gray-500 text-center">협업자가 없습니다.</p>;
    }

    return collaborators.map((collaborator) => {
      const matchedUser = departments
        .flatMap((dept) => dept.users)
        .find((u) => u.id === collaborator.user_id);

      const isOwner = collaborator.isOwner === true;

      return (
        <div
          key={collaborator.id}
          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              {matchedUser?.position || "직책 없음"}
            </span>
            <span>{matchedUser?.name || "사용자 정보 없음"}</span>
          </div>
          <span className="flex gap-2">
            {isOwner ? (
              <span className="text-green-500 text-sm font-medium">생성자</span>
            ) : (
              <>
                <select
                  className="border border-gray-300 rounded-md p-1"
                  value={userPermissions[collaborator.user_id] ?? 2}
                  onChange={(e) =>
                    handlePermissionChange(
                      collaborator.user_id,
                      parseInt(e.target.value)
                    )
                  }
                >
                  <option value="0">관리자 권한</option>
                  <option value="1">읽기/쓰기</option>
                  <option value="2">읽기</option>
                </select>
                <button
                  onClick={() => handleRemoveCollaborator(collaborator.user_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </>
            )}
          </span>
        </div>
      );
    });
  };

  const isUserSelected = (userId) => {
    const isCollaborator = collaborators.some(
      (collaborator) => collaborator.user_id === userId
    );
    const isSelected = selectedUsers.some((selected) => selected.id === userId);
    const isCurrentUser = parseInt(userId) === parseInt(user?.id);
    const isOwner = collaborators.some(
      (collaborator) => collaborator.user_id === userId && collaborator.isOwner
    );

    return {
      isCollaborator,
      isSelected,
      isCurrentUser,
      isOwner,
    };
  };

  const renderDepartmentUsers = (department) => {
    return department.users.map((user) => {
      const { isCollaborator, isSelected } = isUserSelected(user.id);
      const isOwner = collaborators.some(
        (collaborator) =>
          collaborator.user_id === user.id && collaborator.isOwner
      );

      return (
        <div
          key={user.id}
          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{user.position}</span>
            <span>{user.name}</span>
          </div>
          <span>
            {isOwner ? (
              <span className="text-green-500 text-sm font-medium">생성자</span>
            ) : isCollaborator ? (
              <span className="text-gray-400 text-sm">협업자</span>
            ) : isSelected ? (
              <span className="text-blue-500 text-sm font-medium">선택됨</span>
            ) : (
              <button
                onClick={() => handleInvite(user)}
                className="text-blue-500 hover:text-blue-700"
              >
                추가
              </button>
            )}
          </span>
        </div>
      );
    });
  };

  if (!isOpen || type !== "page-collaborator") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
      <div className="bg-white rounded-lg w-[800px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">공유 멤버 관리</h2>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <h3 className="font-medium mb-3">부서별 사용자</h3>
            <div className="border rounded-lg p-4 h-[405px] overflow-y-auto">
              {departments.map((department) => (
                <div key={department.id} className="mb-2">
                  <button
                    onClick={() => toggleDepartment(department.id)}
                    className="flex items-center w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    {expandedDepartments[department.id] ? (
                      <AiOutlineMinus className="mr-2" />
                    ) : (
                      <AiOutlinePlus className="mr-2" />
                    )}
                    <span className="font-semibold">{department.name}</span>
                  </button>
                  {expandedDepartments[department.id] && department.users && (
                    <div className="ml-6 mt-2">
                      {renderDepartmentUsers(department)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/2">
            <div className="mb-6">
              <h3 className="font-medium mb-3">기존 협업자</h3>
              <div className="border rounded-lg p-4 h-[180px] overflow-y-auto">
                {renderCollaborators()}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">선택된 멤버</h3>
              <div className="border rounded-lg p-4 h-[180px] overflow-y-auto">
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{user.position}</span>
                        <span className="w-[100px]">{user.name}</span>
                        <select
                          className="border border-gray-300 rounded-md p-1 float-right"
                          defaultValue={2}
                          onChange={(e) =>
                            setUserPermissions((prev) => ({
                              ...prev,
                              [user.id]: parseInt(e.target.value),
                            }))
                          }
                        >
                          <option value="0">관리자 권한</option>
                          <option value="1">읽기/쓰기</option>
                          <option value="2">읽기</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleRemove(user)}
                        className="text-red-500 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    선택된 멤버가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <textarea
          className="w-full h-28 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 !mt-[10px]"
          placeholder="알림 메시지를 입력하세요..."
          value={notificationMessage}
          onChange={(e) => setNotificationMessage(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isSubmitting} // 제출 중일 때 버튼 비활성화
          >
            {isSubmitting ? "처리 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
