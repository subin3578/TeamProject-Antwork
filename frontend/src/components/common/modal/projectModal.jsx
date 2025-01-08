import React, { useState, useEffect } from "react";
import useModalStore from "../../../store/modalStore";
import {
  addProjectCollaborators,
  fetchAttributes,
  getCurrentCollaboratorCount,
  getProjectCollaborators,
  getUserProjectCount,
  postProject,
  postProjectState,
  removeProjectCollaborator,
  updateProjectState,
} from "../../../api/projectAPI";

import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/AuthStore";
import { getAllUser } from "@/api/userAPI";
import { fetchDepartmentsByCompanyId } from "@/api/departmentAPI";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { ChevronDown, ChevronUp, Users, X } from "lucide-react";

export default function ProjectModal({
  projectId,
  onAddState,
  onAddItem,
  onEditItem,
  currentStateId,
  currentTask,
  setCurrentTask,
  onEditState,
  currentState,
  fetchStatesAndTasks,
}) {
  const { isOpen, type, closeModal } = useModalStore();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const rate = user?.companyRate; // 무료/유료
  console.log("111rate : " + rate);
  const [departments, setDepartments] = useState([]);
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [collaborators, setCollaborators] = useState([]);

  const [isCollaboratorsDropdownOpen, setIsCollaboratorsDropdownOpen] =
    useState(false);
  // 컴포넌트 내 state 추가
  const [priorities, setPriorities] = useState([]);
  const [sizes, setSizes] = useState([]);

  // 우선순위와 크기 데이터 로드
  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const priorityData = await fetchAttributes("PRIORITY");
        const sizeData = await fetchAttributes("SIZE");
        setPriorities(priorityData);
        setSizes(sizeData);
      } catch (error) {
        console.error("Error loading attributes:", error);
      }
    };

    loadAttributes();
  }, []);

  // 선택된 작업담당자 관리하기 위한 상태
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  console.log(
    "selectedCollaborators : " + JSON.stringify(selectedCollaborators)
  );

  const toggleCollaboratorsDropdown = () => {
    setIsCollaboratorsDropdownOpen(!isCollaboratorsDropdownOpen);
  };

  const fetchCollaborators = async () => {
    try {
      if (projectId) {
        const data = await getProjectCollaborators(projectId);
        console.log("협업자 목록data : " + JSON.stringify(data));
        setCollaborators(data);
      }
    } catch (error) {
      console.error("협업자 목록을 불러오는 중 오류 발생:", error);
    }
  };
  // 협업자 목록 불러오기
  useEffect(() => {
    fetchCollaborators();
  }, [isOpen]);

  // 사용자 상태 확인
  const isUserSelected = (userId) => {
    const isCollaborator = collaborators.some(
      (collaborator) => collaborator.id === userId
    );

    const isSelected = selectedUsers.some((selected) => selected.id === userId);

    const isOwner = collaborators.some(
      (collaborator) => collaborator.id === userId && collaborator.owner
    );

    return {
      isOwner,
      isCollaborator,
      isSelected,
    };
  };

  // 작업담당자 선택 핸들러
  const handleSelectCollaborator = (collaborator) => {
    if (!selectedCollaborators.some((c) => c.id === collaborator.id)) {
      setSelectedCollaborators((prev) => [...prev, collaborator]); // collaborator 객체를 추가
    }
  };

  // 작업담당자 삭제 핸들러
  const handleRemoveAssignedUser = (id) => {
    setSelectedCollaborators((prev) => prev.filter((c) => c.id !== id)); // 객체를 삭제
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        if (user?.company) {
          const data = await fetchDepartmentsByCompanyId(user.company);
          setDepartments(data);
        }
      } catch (error) {
        console.error("부서 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchDepartments();
  }, [user]);

  // 초대 가능한 사용자와 선택된 사용자 상태
  const [selectedUsers, setSelectedUsers] = useState([]); // 선택된 사용자

  // 부서 확장/축소 토글
  const toggleDepartment = (departmentId) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  // 2. 초대 가능한 사용자 추가
  const handleInvite = (user) => {
    // 이미 초대된 사용자 또는 선택된 사용자 확인
    if (!collaborators.some((collaborator) => collaborator.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    } else {
      alert("이미 초대된 사용자입니다.");
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
      alert("초대할 협업자를 선택하세요.");
      return;
    }

    const userIds = selectedUsers.map((user) => user.id);
    console.log("userIds:", userIds);
    console.log("projectId:", projectId);

    try {
      // 현재 프로젝트에 이미 존재하는 협업자 수 가져오기
      const currentCollaboratorCount = await getCurrentCollaboratorCount(
        projectId
      );
      console.log(
        "현재 프로젝트에 이미 존재하는 협업자 수:",
        currentCollaboratorCount
      );

      // 새로 초대하려는 협업자 수
      const newCollaboratorCount = selectedUsers.length;
      console.log("새로 초대하려는 협업자 수:", newCollaboratorCount);

      // 무료회원은 최대 3명까지 협업자를 초대할 수 있음
      if (rate === 0 && currentCollaboratorCount + newCollaboratorCount > 4) {
        alert("무료회원은 최대 3명의 협업자만 초대할 수 있습니다.");
        return;
      }

      // 협업자 초대
      await addProjectCollaborators(projectId, userIds, user.id);
      alert("협업자가 성공적으로 초대되었습니다!");

      // 협업자 목록 다시 불러오기
      const updatedCollaborators = await getProjectCollaborators(projectId);
      console.log("updatedCollaborators : " + updatedCollaborators);
      setCollaborators(updatedCollaborators);

      // 선택된 사용자 초기화
      setSelectedUsers([]);

      // 상태 업데이트를 위한 콜백 호출
      // 협업자를 추가한 후 api로 최신목록 받아오면 이를 부모로 전달
      // onCollaboratorsUpdate가 부모 컴포넌트에서 전달된 콜백 함수인지 확인
      // 최신 협업자 목록 updatedCollaborators를 부모에게 전달

      closeModal();
    } catch (error) {
      console.error("협업자 추가 실패:", error);
      alert("협업자 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 기존 협업자 삭제
  const handleRemoveCollaborator = async (userId) => {
    console.log("백엔드로 가는 userId : " + userId);
    try {
      await removeProjectCollaborator(projectId, userId);
      // 협업자 목록 갱신
      const updatedCollaborators = await getProjectCollaborators(projectId);
      setCollaborators(updatedCollaborators);

      alert("협업자가 삭제되었습니다.");
      fetchStatesAndTasks();
    } catch (error) {
      console.error("협업자 삭제 실패:", error);
      alert("협업자 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    console.log("사용자 정보:", user);
  }, [user]);

  // 작업 수정 effect
  useEffect(() => {
    if (type === "task-create") {
      // 작업 추가 시 상태 초기화
      setTaskData({ title: "", content: "", priority: "2", size: "M" });
      setSelectedCollaborators([]);
    } else if (type === "task-edit" && currentTask) {
      console.log("currentTask : " + JSON.stringify(currentTask, null, 2));

      // 작업 수정 시 현재 작업 데이터를 로드
      setTaskData({
        title: currentTask.title || "",
        content: currentTask.content || "",
        priorityId: currentTask.priorityId || "",
        sizeId: currentTask.sizeId || "",
        assignedUserIds: currentTask.assignedUserIds || [], // 수정된 작업의 담당자 ID 배열
      });

      // 작업 수정 시 현재 작업에 할당된 담당자 정보 설정
      setSelectedCollaborators(currentTask.assignedUserDetails || []);
    }
  }, [type, currentTask]); // currentTask가 변경될 때마다 실행

  // 프로젝트 추가 상태 관리
  const [project, setProject] = useState({
    projectName: "",
    status: 0,
    companyRate: rate,
  });

  // 프로젝트 추가 changeHandler
  const projectChangeHandler = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  // 프로젝트 추가 submitHandler
  const projectSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // 현재 사용자가 생성한 프로젝트 수 확인
      const userProjectCount = await getUserProjectCount(user.uid);
      console.log(
        "백엔드에서 나온 현재 사용자가 생성한 프로젝트 수 : ",
        userProjectCount
      );

      // 무료회원인 경우, 프로젝트 수가 2개 이상이면 생성 불가
      if (rate === 0 && userProjectCount >= 2) {
        alert("무료회원은 최대 2개의 프로젝트만 생성할 수 있습니다.");
        return;
      }

      // 프로젝트 추가 전 확인 알림창
      if (!window.confirm("프로젝트를 생성하시겠습니까?")) {
        return;
      }

      // 프로젝트 객체와 함께 uid를 전송
      const result = await postProject(project, user.uid);

      // 상태 초기화 및 모달 닫기
      console.log("Project Created:", result);
      setProject({ projectName: "", status: 0 });
      closeModal();

      alert("프로젝트가 생성되었습니다. 상세 등록 화면으로 이동합니다.");

      // 프로젝트 생성 후 view 화면으로 이동
      navigate(`/antwork/project/view?id=${result.id}`);
      window.location.reload();
    } catch (error) {
      // 에러를 console.log로 출력하고 사용자에게 알림
      console.error("Error submitting project:", error);
      alert("프로젝트 생성 중 문제가 발생했습니다.");
    }
  };

  // 프로젝트 작업 상태 관리
  const [stateData, setStateData] = useState({
    title: "",
    description: "",
    color: "#00FF00", // 기본 색상
    projectId: projectId, // projectId 기본값
  });

  // 프로젝트 상태 changeHandler
  const projectStateChangeHandler = (e) => {
    const { name, value } = e.target;
    setStateData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 프로젝트 작업 상태 추가 핸들러
  const handleAddState = async (e) => {
    e.preventDefault();

    try {
      // 서버로 전송
      const addedState = await postProjectState(stateData); // API 호출
      console.log("추가된 상태:", addedState);

      if (onAddState) {
        onAddState(addedState); // 부모 컴포넌트에 상태 추가 알림
      }

      alert("상태가 성공적으로 추가되었습니다!");
      closeModal();
      setStateData({
        title: "",
        description: "",
        color: "#00FF00",
        projectId: projectId, // 초기화 시에도 projectId 유지
      }); // 초기화
    } catch (error) {
      console.error("Error adding state:", error);
      alert("상태 추가 중 문제가 발생했습니다.");
    }
  };

  // 프로젝트 작업 상태 수정
  useEffect(() => {
    if (type === "state-edit" && currentState) {
      setStateData({
        title: currentState.title || "",
        description: currentState.description || "",
        color: currentState.color || "#00FF00",
        projectId: projectId,
      });
    } else if (type === "state-add") {
      setStateData({
        title: "",
        description: "",
        color: "#00FF00",
        projectId: projectId,
      });
    }
  }, [type, currentState, projectId]);

  // 프로젝트 작업 상태 수정 핸들러
  const handleEditState = async (e) => {
    e.preventDefault();
    try {
      console.log(
        "백엔드로 갈 currentState.id, stateData : " + currentState.id,
        stateData
      );
      const updatedStateFromServer = await updateProjectState(
        currentState.id,
        stateData
      );

      // 기존 items를 유지하면서 상태 업데이트
      const updatedState = {
        ...updatedStateFromServer,
        items: currentState.items || [], // 기존 items를 유지
      };

      console.log("updatedState : " + updatedState);

      // 부모 컴포넌트에 상태 수정 알림
      onEditState(updatedState);
      alert("상태가 성공적으로 수정되었습니다!");
      closeModal();
    } catch (error) {
      console.error("Error editing state:", error);
      alert("상태 수정 중 문제가 발생했습니다.");
    }
  };

  // 작업데이터 상태 관리
  const [taskData, setTaskData] = useState({
    title: "",
    content: "",
    priorityId: "",
    sizeId: "",
  });

  // 작업 changeHandler(사용자가 입력한 데이터를 taskData에 업데이트)
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 작업 추가 핸들러
  const handleAddTask = (e) => {
    e.preventDefault();

    if (!currentStateId || !onAddItem) {
      console.error("currentStateId or onAddItem is missing!");
      return;
    }

    const newTask = {
      title: taskData.title,
      content: taskData.content,
      priorityId: taskData.priorityId,
      sizeId: taskData.sizeId,
      stateId: currentStateId,
      status: 0,
      assignedUser: selectedCollaborators.map(
        (collaborator) => collaborator.id
      ), // ID만 추출
      assignedUserDetails: selectedCollaborators.map((collaborator) => ({
        id: collaborator.id,
        name: collaborator.name,
        profileImageUrl: collaborator.profileImageUrl,
        position: collaborator.position,
      })), // 협업자 상세 정보 추가
    };

    console.log("newTask:", newTask);

    onAddItem(newTask);

    alert("작업이 등록되었습니다!");
    setTaskData({
      title: "",
      content: "",
      priority: "2",
      size: "M",
      assignedUser: [],
    });
    setSelectedCollaborators([]); // 선택된 담당자 초기화
    closeModal();
  };

  // 작업 수정 핸들러
  const handleEditTask = async (e) => {
    e.preventDefault();

    if (!currentStateId || !onEditItem) {
      console.error("currentStateId 또는 onEditItem이 누락되었습니다!");
      return;
    }

    // 수정된 작업 데이터 생성
    const updatedTask = {
      id: currentTask?.id || null, // 기존 작업의 ID 유지
      title: taskData.title,
      content: taskData.content,
      priorityId: taskData.priorityId,
      sizeId: taskData.sizeId,
      stateId: currentStateId,
      status: currentTask?.status || 0, // 기존 상태 유지
      assignedUser: selectedCollaborators.map(
        (collaborator) => collaborator.id
      ), // 선택된 협업자들의 ID를 저장
    };

    console.log("updatedTask : " + updatedTask);

    try {
      // 부모 컴포넌트로 업데이트된 작업 데이터 전달
      onEditItem(currentStateId, updatedTask);

      alert("작업이 수정되었습니다!");
      setTaskData({ title: "", content: "", priorityId: "", sizeId: "" });
      setSelectedCollaborators([]); // 선택된 담당자 초기화
      closeModal();
    } catch (error) {
      console.error("작업 수정 중 오류 발생:", error.message || error);
      alert("작업 수정 중 문제가 발생했습니다.");
    }
  };

  // 프로젝트 이름 상태 추가
  const [projectName, setProjectName] = useState("");

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case "task-create":
      case "task-edit":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
            <div className="bg-white rounded-lg w-[500px] h-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {type === "task-create" ? "새 작업 추가" : "작업 수정"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={
                  type === "task-create" ? handleAddTask : handleEditTask
                }
                className="space-y-4"
              >
                <div>
                  <label className="block mb-2 font-medium">작업명</label>
                  <input
                    type="text"
                    name="title"
                    value={taskData.title || currentTask?.title || ""}
                    onChange={handleTaskChange}
                    className="w-full border rounded p-2"
                    placeholder="작업 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">작업 내용</label>
                  <textarea
                    name="content"
                    value={taskData.content || currentTask?.content || ""}
                    onChange={handleTaskChange}
                    className="w-full border rounded p-2"
                    rows="4"
                    placeholder="작업 내용을 설명해주세요"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">우선순위</label>
                  <select
                    name="priorityId"
                    value={taskData.priorityId || ""}
                    onChange={handleTaskChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="" disabled>
                      우선순위 선택
                    </option>
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">작업 크기</label>
                  <select
                    name="sizeId"
                    value={taskData.sizeId || ""}
                    onChange={handleTaskChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="" disabled>
                      크기 선택
                    </option>
                    {sizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-m font-semibold text-gray-700 mb-2">
                    작업담당자 선택
                  </label>

                  {/* 드롭다운 헤더 */}
                  <div
                    onClick={toggleCollaboratorsDropdown}
                    className="flex justify-between items-center w-full px-4 py-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <span>선택</span>
                    {isCollaboratorsDropdownOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>

                  {/* 드롭다운 내용 */}
                  {isCollaboratorsDropdownOpen && (
                    <div className="mt-2 border-2 border-gray-200 rounded-lg">
                      <ul className="max-h-48 overflow-y-auto">
                        {collaborators.length > 0 ? (
                          collaborators.map((collaborator) => (
                            <li key={collaborator.id}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectCollaborator(collaborator)
                                }
                                className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-all"
                              >
                                {collaborator.name} ({collaborator.position})
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-500">
                            협업자가 없습니다.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {selectedCollaborators.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <h4 className="text-m font-medium text-gray-600">
                        선택된 작업담당자
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollaborators.map((collaborator) => (
                          <span
                            key={collaborator.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-s flex items-center"
                          >
                            {collaborator.name} ({collaborator.position})
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAssignedUser(collaborator.id)
                              }
                              className="ml-1 text-blue-500 hover:text-blue-700"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A0C3F7] text-white rounded hover:bg-blue-700"
                  >
                    {type === "task-create" ? "추가" : "수정"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "project":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
            <div className="bg-white rounded-lg w-[500px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">프로젝트 추가</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={projectSubmitHandler} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">프로젝트명</label>
                  <input
                    type="text"
                    name="projectName"
                    value={project.projectName}
                    onChange={projectChangeHandler}
                    className="w-full border rounded p-2"
                    placeholder="프로젝트 이름을 입력하세요"
                    required
                  />
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A0C3F7] text-white rounded hover:bg-blue-700"
                  >
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "project-edit":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
            <div className="bg-white rounded-lg w-[600px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">프로젝트 수정</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log({
                    updatedProjectName: projectName,
                    updatedProjectDescription: projectDescription,
                    updatedProjectMembers: teamMembers, // 선택된 멤버로 처리
                  });
                  closeModal();
                }}
              >
                {/* 프로젝트명 수정 */}
                <div>
                  <label className="block mb-2 font-medium">프로젝트명</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="프로젝트 이름을 수정하세요"
                    required
                  />
                </div>

                <div className="border rounded max-h-40 overflow-y-auto">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <span>{member.name}</span>
                      <button
                        onClick={() => console.log(`${member.name} 추가`)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-700"
                      >
                        추가
                      </button>
                    </div>
                  ))}
                </div>

                {/* 현재 협업자 목록 */}
                <div className="mt-4">
                  <h3 className="font-medium mb-2">현재 협업자 목록</h3>
                  <div className="border rounded max-h-40 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex justify-between items-center p-2"
                      >
                        <span>{member.name}</span>
                        <button
                          onClick={() => console.log(`${member.name} 삭제`)}
                          className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 닫기 및 저장 버튼 */}
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A0C3F7] text-white rounded hover:bg-green-700"
                  >
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case "project-invite":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[700px] h-[570px] p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-4">협업자 초대</h2>

              <div className="flex h-[86%]">
                {/* 부서별 사용자 트리 */}
                <div className="w-1/2 border rounded-lg p-4 overflow-y-auto mr-4">
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
                              {department.users &&
                              department.users.length > 0 ? (
                                department.users.map((user) => {
                                  const {
                                    isOwner,
                                    isCollaborator,
                                    isSelected,
                                  } = isUserSelected(user.id);

                                  return (
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

                                      <span>
                                        {isOwner ? (
                                          <span className="text-green-500 text-sm font-medium">
                                            생성자
                                          </span>
                                        ) : isCollaborator ? (
                                          <span className="text-gray-400 text-sm">
                                            협업자
                                          </span>
                                        ) : isSelected ? (
                                          <span className="text-blue-400 text-sm">
                                            선택됨
                                          </span>
                                        ) : (
                                          <button
                                            onClick={() => handleInvite(user)}
                                            className="text-blue-500 hover:text-blue-700"
                                          >
                                            추가
                                          </button>
                                        )}
                                      </span>
                                    </li>
                                  );
                                })
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
                    <p className="text-gray-500">
                      부서 데이터를 불러오는 중...
                    </p>
                  )}
                </div>

                {/* 선택된 협업자 목록 */}
                <div className="w-1/2 border rounded-lg p-4 overflow-y-auto">
                  <h3 className="font-semibold text-lg mb-2">기존 협업자</h3>
                  {collaborators.length > 0 ? (
                    <ul>
                      {collaborators.map((user) => {
                        console.log("User Data:", user);
                        console.log(
                          `User ID: ${user.id}, isOwner: ${user.owner}`
                        );
                        const isOwner = user.owner === true;
                        return (
                          <li
                            key={user.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                          >
                            <span className="text-gray-800 font-medium">
                              {user.name} ({user.position})
                            </span>
                            {isOwner ? (
                              <span className="text-green-500 text-sm font-medium">
                                생성자
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  handleRemoveCollaborator(user.id)
                                }
                                className="text-red-500 hover:underline"
                              >
                                삭제
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">협업자가 없습니다.</p>
                  )}

                  <h3 className="font-semibold text-lg mb-2 mt-[38px]">
                    선택된 협업자
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
                    <p className="text-gray-500">선택된 협업자가 없습니다.</p>
                  )}
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleSendInvite}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >
                  초대
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        );

      case "state-add":
      case "state-edit":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
            <div className="bg-white rounded-lg w-[500px] h-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {" "}
                  {type === "state-add" ? "새 작업상태 추가" : "작업상태 수정"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={
                  type === "state-add" ? handleAddState : handleEditState
                }
                className="space-y-4"
              >
                {/* 색상 선택 */}
                <div>
                  <label className="block mb-2 font-medium">
                    작업상태 색상
                  </label>
                  <input
                    type="color"
                    name="color"
                    value={stateData.color}
                    onChange={projectStateChangeHandler}
                    className="w-full h-10 border rounded p-1"
                  />
                </div>

                {/* 상태 제목 */}
                <div>
                  <label className="block mb-2 font-medium">
                    작업상태 제목
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={stateData.title}
                    onChange={projectStateChangeHandler}
                    className="w-full border rounded p-2"
                    placeholder="상태 이름을 입력하세요"
                    required
                  />
                </div>

                {/* 상태 설명 */}
                <div>
                  <label className="block mb-2 font-medium">
                    작업상태 설명
                  </label>
                  <textarea
                    name="description"
                    value={stateData.description}
                    onChange={projectStateChangeHandler}
                    className="w-full border rounded p-2"
                    rows="4"
                    placeholder="상태 설명을 입력하세요"
                  />
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A0C3F7] text-white rounded hover:bg-blue-700"
                  >
                    {type === "state-add" ? "추가" : "수정"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return <div>모달 내용이 없습니다.</div>;
    }
  };

  return renderContent();
}
