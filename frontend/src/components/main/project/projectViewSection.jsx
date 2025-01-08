import { useEffect, useRef, useState } from "react";
import ProjectModal from "../../common/modal/projectModal";
import useModalStore from "../../../store/modalStore";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import {
  createTask,
  deleteProjectState,
  deleteTask,
  getProjectById,
  getProjectCollaborators,
  getProjectStates,
  getTasksByStateId,
  updateProject,
  updateProjectStatus,
  updateTask,
  updateTaskPosition,
} from "../../../api/projectAPI";
import { AiOutlineCheckCircle, AiOutlineEdit } from "react-icons/ai";
import useProjectWebSocket from "@/hooks/project/useProjectWebSocket";
import useAuthStore from "@/store/AuthStore";
import { Client } from "@stomp/stompjs";

export default function ProjectViewSection() {
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  const projectRef = useRef(null);
  const { isOpen } = useModalStore(); // Zustand store에서 모달 상태 가져오기

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [id, setId] = useState(searchParams.get("id"));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newId = params.get("id");
    setId(newId);
  }, [location.search]);

  // 상태관리
  const [loadingStates, setLoadingStates] = useState(true); // 상태 로딩 플래그
  const [project, setProject] = useState();
  const [dropdownOpenStateId, setDropdownOpenStateId] = useState(null);
  const openModal = useModalStore((state) => state.openModal);
  // 작업상태 상태 관리
  const [currentState, setCurrentState] = useState(null);
  const [states, setStates] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState(""); // 새로운 프로젝트 이름

  const [collaborators, setCollaborators] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [sizes, setSizes] = useState([]);

  // 우선순위 및 크기 데이터 로드
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

  const fetchCollaborators = async () => {
    try {
      if (id) {
        const data = await getProjectCollaborators(id);
        console.log("협업자 목록data : " + JSON.stringify(data));
        setCollaborators(data);
      }
    } catch (error) {
      console.error("협업자 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // 협업자 추가 후 작업 상태를 다시 조회하는 부분
  const handleCollaboratorsUpdate = async (updatedCollaborators) => {
    console.log("협업자 목록이 갱신되었습니다:", updatedCollaborators);

    // 협업자 상태 업데이트
    setCollaborators(updatedCollaborators);

    // 협업자 목록이 갱신된 후, 작업 상태 데이터를 다시 가져옴
    const fetchTasksForStates = async () => {
      try {
        const updatedStates = await Promise.all(
          // states 배열의 각 요소에 대해 작업을 처리
          states.map(async (state) => {
            if (!state.items || state.items.length === 0) {
              // 작업이 없는 상태만 요청
              const tasks = await getTasksByStateId(state.id);
              console.log("작업 데이터:", JSON.stringify(tasks));
              // 기존 속성(...state)을 그대로 유지하고 items 속성을 업데이트
              return {
                ...state,
                items: tasks.map((task) => ({
                  ...task,
                  assignedUserIds: task.assignedUserIds || [], // 기본값을 빈 배열로 설정
                })),
              };
            }
            return state;
          })
        );
        setStates(updatedStates); // 작업 상태 업데이트
      } catch (error) {
        console.error("작업 상태를 가져오는 중 오류 발생:", error);
      }
    };

    fetchTasksForStates(); // 작업 상태 데이터를 갱신
  };

  // 작업상태 드롭다운
  const toggleDropdown = (stateId) => {
    setDropdownOpenStateId((prev) => (prev === stateId ? null : stateId));
  };
  const closeDropdown = () => {
    setDropdownOpenStateId(null);
  };

  useEffect(() => {
    console.log("주소값의 id 바뀔 때마다 useEffect 호출 id:" + id);
    // 컴포넌트가 렌더링되거나 id가 변경될 때 호출됨
    const fetchProjectDetails = async () => {
      try {
        const projectData = await getProjectById(id); // API 호출
        console.log("projectData : " + projectData);

        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project details:", error);
        alert("프로젝트 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };
    fetchCollaborators();
    setLoadingStates(true); // 새 요청 전 로딩 상태로 설정
    fetchProjectDetails(); // 컴포넌트 마운트 시 데이터 로드
  }, [id]); // location을 의존성 배열에 추가

  const fetchStatesAndTasks = async () => {
    try {
      const statesData = await getProjectStates(id);
      console.log("상태 데이터 가져옴:", statesData);

      // 각 상태의 작업들을 한 번에 가져오기
      const statesWithTasks = await Promise.all(
        statesData.map(async (state) => {
          const tasks = await getTasksByStateId(state.id);
          return {
            ...state,
            items: tasks.map((task) => ({
              ...task,
              assignedUserIds: task.assignedUserIds || [],
            })),
          };
        })
      );

      setStates(statesWithTasks);
    } catch (error) {
      console.error(
        "상태와 작업을 가져오는 중 오류 발생:",
        error.message || error
      );
    } finally {
      setLoadingStates(false);
    }
  };

  // states 관련 useEffect 수정
  useEffect(() => {
    const fetchStatesAndTasks = async () => {
      try {
        const statesData = await getProjectStates(id);
        console.log("상태 데이터 가져옴:", statesData);

        // 각 상태의 작업들을 한 번에 가져오기
        const statesWithTasks = await Promise.all(
          statesData.map(async (state) => {
            const tasks = await getTasksByStateId(state.id);
            return {
              ...state,
              items: tasks.map((task) => ({
                ...task,
                assignedUserIds: task.assignedUserIds || [],
              })),
            };
          })
        );

        setStates(statesWithTasks);
      } catch (error) {
        console.error(
          "상태와 작업을 가져오는 중 오류 발생:",
          error.message || error
        );
      } finally {
        setLoadingStates(false);
      }
    };

    if (id) {
      setLoadingStates(true);
      fetchStatesAndTasks();
    }
  }, [id]);

  // 현재 작업이 속한 작업상태의 id 상태관리
  const [currentStateId, setCurrentStateId] = useState(null);
  //수정 중인 작업 데이터 상태관리(작업 수정할 때 기존 데이터를 불러옴)
  const [currentTask, setCurrentTask] = useState(null);

  // 작업 상태 추가 핸들러
  const handleAddState = (newState) => {
    setStates((prevStates) => {
      // 새로운 상태의 ID가 이미 prevStates에 존재하는지 확인
      if (prevStates.some((state) => state.id === newState.id)) {
        console.log("이 상태는 이미 존재합니다:", newState);
        return prevStates; // 이미 존재하면 상태를 추가하지 않고 기존 상태 반환
      }

      // 새로운 상태가 없으면 추가
      return [
        ...prevStates,
        { id: Date.now().toString(), ...newState, items: [] },
      ];
    });
  };

  // 작업 상태 수정 핸들러
  const handleEditState = (updatedState) => {
    setStates((prevStates) =>
      prevStates.map((state) =>
        state.id === updatedState.id
          ? { ...updatedState, items: state.items || [] } // items가 없으면 빈 배열로 초기화
          : state
      )
    );
  };

  // 작업 추가 핸들러
  const handleAddItem = async (newTask) => {
    try {
      console.log("백엔드로 전달되는 taskData:", newTask);

      const createdTask = await createTask(newTask); // API 호출
      console.log("생성된 작업:", createdTask);

      // setStates((prevStates) =>
      //   prevStates.map((state) =>
      //     state.id === newTask.stateId // stateId로 매칭
      //       ? { ...state, items: [...(state.items || []), createdTask] }
      //       : state
      //   )
      // );
    } catch (error) {
      console.error("작업 추가 중 오류 발생:", error.message || error);
      alert("작업 등록 중 문제가 발생했습니다.");
    }
  };

  // 전체 Task 데이터 가져오기
  useEffect(() => {
    const fetchTasksForStates = async () => {
      try {
        // 여러 비동기 작업(getTasksByStateId)을 동시에 실행하고, 모든 작업이 완료될 때까지 기다림
        const updatedStates = await Promise.all(
          // states 배열의 각 요소에 대해 작업을 처리
          states.map(async (state) => {
            if (!state.items || state.items.length === 0) {
              // 작업이 없는 상태만 요청
              const tasks = await getTasksByStateId(state.id);
              console.log(
                "useEffect (Task데이터 가져옴 by StateId) 마운트 - states.length TaskData : ",
                JSON.stringify(tasks)
              );
              // 기존 속성(...state)을 그대로 유지하고 items 속성을 업데이트
              return {
                ...state,
                items: tasks.map((task) => ({
                  ...task,
                  assignedUserIds: task.assignedUserIds || [], // 기본값을 빈 배열로 설정
                })),
              };
            }
            return state;
          })
        );
        setStates(updatedStates);
      } catch (error) {
        console.error("Error fetching tasks for states:", error.message);
      }
    };

    if (states.length > 0) {
      // 상태가 존재할 때만 호출
      fetchTasksForStates();
    }
  }, [states.length, id]); // 상태 수가 변경될 때만 트리거

  // 작업 수정
  const handleEditItem = async (stateId, updatedTask) => {
    try {
      console.log("수정 요청 taskId:", updatedTask.id);
      console.log("수정 요청 데이터:", updatedTask);

      // 백엔드로 수정 요청
      const updatedTaskFromServer = await updateTask(
        updatedTask.id,
        updatedTask
      );
      console.log("수정 완료된 작업:", updatedTaskFromServer);

      // 상태 업데이트
      setStates((prevStates) =>
        prevStates.map((state) =>
          state.id === updatedTaskFromServer.stateId
            ? {
                ...state,
                items: state.items.map((item) =>
                  item.id === updatedTaskFromServer.id
                    ? {
                        ...updatedTaskFromServer,
                      }
                    : item
                ),
              }
            : state
        )
      );

      console.log("상태 업데이트 완료");
    } catch (error) {
      console.error("작업 수정 중 오류 발생:", error.message || error);
      alert("작업 수정 중 문제가 발생했습니다.");
    }
  };

  // 작업 삭제 핸들러
  const handleDeleteTask = async (stateId, taskId) => {
    console.log("삭제 stateId, taskId : " + stateId, taskId);
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      // 서버에 삭제 요청
      await deleteTask(taskId);
      console.log(`Task ${taskId} 삭제 성공`);

      // State에서 삭제 반영
      setStates((prevStates) =>
        prevStates.map((state) =>
          state.id === stateId
            ? {
                ...state,
                items: state.items.filter((task) => task.id !== taskId),
              }
            : state
        )
      );

      alert("성공적으로 삭제되었습니다!");
    } catch (error) {
      console.error("Task 삭제 중 오류 발생:", error.message || error);
      alert("Task 삭제 중 문제가 발생했습니다.");
    }
  };

  // 작업 등록 핸들러
  const openTaskCreateModal = (stateId) => {
    console.log("등록모달 열때 stateId : " + stateId);
    setCurrentStateId(stateId);
    setCurrentTask(null);
    openModal("task-create");
  };

  // 작업 수정 모달
  const openTaskEditModal = (stateId, task) => {
    console.log("수정모달 열때 stateId와 task : " + stateId, task);
    setCurrentStateId(stateId);
    setCurrentTask({
      ...task,
    });
    openModal("task-edit");
  };

  // 드래그앤드랍 처리
  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // 드래그를 놓을 위치가 없는 경우
    if (!destination) {
      console.log("드래그가 취소되었습니다. 드롭 위치가 없습니다.");
      return;
    }
    // 같은 위치로 드래그한 경우 아무 작업도 하지 않음
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    console.log("Source Index:", source.index);
    console.log("Destination Index:", destination.index);

    // 상태 업데이트
    const newStates = [...states];

    // 소스 상태와 목적지 상태를 찾아서 작업 위치 변경
    const sourceStateIndex = newStates.findIndex(
      (state) => String(state.id) === String(source.droppableId)
    );
    const destinationStateIndex = newStates.findIndex(
      (state) => String(state.id) === String(destination.droppableId)
    );

    if (sourceStateIndex === -1 || destinationStateIndex === -1) {
      console.error("Source or destination state not found");
      return;
    }

    const sourceItems = Array.from(newStates[sourceStateIndex].items);
    const destinationItems = Array.from(newStates[destinationStateIndex].items);

    // 이동할 아이템을 찾아서 제거
    const [movedItem] = sourceItems.splice(source.index, 1);

    // 같은 키가 이미 존재하는지 확인
    const itemExistsInDestination = destinationItems.some(
      (item) => item.id === movedItem.id // 동일한 ID를 가진 아이템이 있는지 체크
    );

    // 같은 키가 존재하면
    if (itemExistsInDestination) {
      // 아이템을 원래 상태로 복원
      sourceItems.splice(source.index, 0, movedItem);
      return;
    }

    // 목적지 인덱스에 항목을 넣어줌
    destinationItems.splice(destination.index, 0, movedItem);

    // 소스와 목적지가 동일한 상태일 경우, 기존 항목을 이동만 하므로 복제하지 않음
    if (source.droppableId === destination.droppableId) {
      newStates[sourceStateIndex].items = destinationItems;
    } else {
      newStates[sourceStateIndex].items = sourceItems;
      newStates[destinationStateIndex].items = destinationItems;
    }

    // 상태 업데이트
    setStates(newStates);
    console.log("Updated States:", newStates);

    try {
      await updateTaskPosition(
        movedItem.id,
        destination.droppableId,
        destination.index
      );
      console.log(
        "Updated Task on Server:",
        movedItem.id,
        destination.droppableId,
        destination.index
      );
    } catch (error) {
      console.error("Error updating task position on the server:", error);
      alert("작업 위치 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 작업상태 삭제 핸들러
  const handleDeleteState = async (stateId) => {
    console.log("stateId : " + stateId);
    if (
      !window.confirm(
        "정말로 이 상태를 삭제하시겠습니까? 모든 작업들이 함께 삭제됩니다."
      )
    )
      return;

    try {
      await deleteProjectState(stateId);

      // 삭제된 상태를 상태 목록에서 제거
      setStates((prevStates) =>
        prevStates.filter((state) => state.id !== stateId)
      );

      alert("상태가 성공적으로 삭제되었습니다!");
    } catch (error) {
      alert("상태 삭제 중 문제가 발생했습니다.");
    }
  };

  // 프로젝트 이름 저장 핸들러
  const handleSaveProjectName = async () => {
    try {
      if (!newProjectName.trim()) return;

      const updatedProject = await updateProject(project.id, {
        projectName: newProjectName,
        status: project.status,
      });
      console.log("updatedProject : " + updatedProject);

      setProject(updatedProject); // 수정된 프로젝트를 상태에 반영

      alert("프로젝트 이름이 성공적으로 수정되었습니다.");

      setEditingProject(null); // 편집 모드 종료
    } catch (error) {
      console.error("프로젝트 수정 중 오류 발생:", error.message || error);
      alert("프로젝트 이름 수정 중 문제가 발생했습니다.");
    }
  };

  // 프로젝트 이름 수정 취소 핸들러
  const handleCancelEdit = () => {
    setEditingProject(null);
    setNewProjectName(project.projectName); // 원래 이름으로 초기화
  };

  // WebSocket 훅 사용
  useProjectWebSocket({
    userId: user?.id,
    projectId: id,
    setCollaborators,
    handleAddState,
    handleEditState,
    setStates,
    handleAddItem,
    fetchCollaborators,
    setProject,
    fetchStatesAndTasks,
    priorities,
    sizes,
  });

  // 모달이 닫힐 때마다 협업자 목록을 새로 불러옴
  useEffect(() => {
    if (!isOpen) {
      fetchCollaborators();
    }
  }, [isOpen]); // isOpen 상태가 변경될 때마다 실행

  // 프로젝트 상태 변경(진행중/완료)
  const handleProjectStatusUpdate = async () => {
    try {
      // 새로운 상태 설정: 현재 상태가 1이면 0으로, 아니면 1로 변경
      const newStatus = project.status === 1 ? 0 : 1;

      // 백엔드로 상태 업데이트 요청
      const updatedProject = await updateProjectStatus(project.id, newStatus);

      // 상태 업데이트 후, 프로젝트 상태 반영
      setProject(updatedProject);

      alert(
        `프로젝트가 ${
          newStatus === 1 ? "완료" : "진행 중"
        } 상태로 변경되었습니다.`
      );
      window.location.reload(); // 페이지 새로 고침
    } catch (error) {
      console.error("프로젝트 상태 변경 중 오류 발생:", error.message || error);
      alert("프로젝트 상태 변경 중 문제가 발생했습니다.");
    }
  };

  if (loadingStates) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    // handleDragEnd: 드래그 종료 시 호출되는 핸들러로, 소스(source)와 목적지(destination)를 기반으로 데이터를 업데이트
    // onDragEnd가 반드시 정의되어야 하고, 데이터 동기화를 책임짐
    <DragDropContext onDragEnd={handleDragEnd}>
      <ProjectModal
        projectId={id} // 파라미터 id값 넘김
        onAddState={handleAddState} // 상태 추가 핸들러
        onAddItem={handleAddItem} // 작업 추가 핸들러
        onEditItem={handleEditItem} // 작업 수정 핸들러
        currentStateId={currentStateId} // openTaskEditModal에서 설정한 stateId
        currentTask={currentTask} // openTaskEditModal에서 설정한 task
        setCurrentTask={setCurrentTask} // 작업 상태 업데이트 함수
        onEditState={handleEditState}
        currentState={currentState}
        fetchCollaborators={fetchCollaborators}
        fetchStatesAndTasks={fetchStatesAndTasks}
        priorities={priorities} // 우선순위 데이터 전달
        sizes={sizes} // 크기 데이터 전달
      />
      {project ? (
        <article className="page-list min-h-[850px]">
          <div className="content-header">
            <div className="max-w-9xl mx-auto p-2">
              <div className="mb-3 text-center">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {/* 프로젝트 이름 및 편집 버튼 */}
                    <div className="flex items-center space-x-2">
                      {editingProject === project.id ? (
                        <input
                          type="text"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          className="text-2xl font-semibold tracking-tight text-blue-800 border-b-2 border-blue-500 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveProjectName(); // Enter 키로 저장
                            if (e.key === "Escape") handleCancelEdit(); // Esc 키로 취소
                          }}
                          autoFocus
                        />
                      ) : (
                        <h1 className="text-5xl font-semibold tracking-tight text-blue-800">
                          {project.projectName}
                        </h1>
                      )}

                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setEditingProject(project.id);
                          setNewProjectName(project.projectName); // 현재 프로젝트 이름으로 초기화
                        }}
                      >
                        <AiOutlineEdit />
                      </button>
                    </div>

                    {/* 프로젝트 상태 토글 */}
                    <div className="relative flex items-center space-x-2 group">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={project?.status === 1}
                          onChange={handleProjectStatusUpdate}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>

                      {project?.status === 1 && (
                        <AiOutlineCheckCircle
                          size={24}
                          className="text-green-500"
                        />
                      )}

                      {/* 툴팁: 상태에 따라 반대 상태 표시 */}
                      <div className="absolute top-[-1.8rem] left-[10px] transform -translate-x-1/2 hidden group-hover:block">
                        <div className="bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          {project?.status === 1 ? "진행 중" : "완료"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {collaborators.slice(0, 3).map((user) => (
                      <div key={user.id} className="relative group">
                        <img
                          src={
                            user.profileImageUrl ||
                            "/images/default_profile.png"
                          }
                          alt={`Profile of ${user.name}`}
                          className="w-10 h-10 rounded-full border-2 border-white -ml-2"
                        />
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg whitespace-nowrap z-10">
                          {user.name}
                        </div>
                      </div>
                    ))}

                    {collaborators.length > 3 && (
                      <div className="relative group">
                        <div className="w-10 h-10 bg-gray-200 text-gray-600 font-bold flex items-center justify-center rounded-full border-2 border-white -ml-2">
                          +{collaborators.length - 3}
                        </div>
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg whitespace-nowrap z-10">
                          {collaborators
                            .slice(3)
                            .map((user) => user.name)
                            .join(", ")}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => openModal("project-invite")}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <img
                        src="/images/Antwork/project/project_invite.png"
                        alt="Add More"
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <section className="flex gap-4 overflow-x-auto pb-6">
                {/* states 배열이 초기화되기전에 map 메서드가 호출되어 에러발생하는 이슈때문에 states가 배열인지 확인하는 조건 추가 */}
                {Array.isArray(states) &&
                  states.map((state) => (
                    // droppableId는 문자열이어야 함
                    // 드래그 가능한 항목(Draggable)을 포함하는 컨테이너를 정의
                    <Droppable key={state.id} droppableId={String(state.id)}>
                      {(provided) => (
                        <article
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex-shrink-0 w-96 rounded-lg bg-white border border-blue-200 max-h-[800px]"
                        >
                          <div
                            className="p-3 border-b"
                            style={{
                              borderColor: state.color,
                              borderBottomWidth: "2px",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-xl"
                                  style={{
                                    color: state.color,
                                    display: "inline-block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  ●
                                </span>
                                <h2 className="font-semibold text-2xl">
                                  {state.title}
                                </h2>
                                <span className="text-[12px] text-gray-700 bg-gray-100 rounded-full px-3 mb-1">
                                  {state.items?.length || 0}
                                </span>
                              </div>
                              {/* 옵션 버튼 */}
                              <div className="relative">
                                <button
                                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                  onClick={() => toggleDropdown(state.id)}
                                >
                                  <img
                                    src="/images/Antwork/project/project_icon.png"
                                    alt="옵션"
                                    className="w-6 h-6"
                                  />
                                </button>

                                {/* 드롭다운 메뉴 */}
                                {dropdownOpenStateId === state.id && (
                                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        closeDropdown();
                                        setCurrentState(state); // 현재 상태 설정
                                        openModal("state-edit");
                                      }}
                                    >
                                      수정
                                    </button>
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                      onClick={() =>
                                        handleDeleteState(state.id)
                                      }
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-[14px] text-gray-600 mt-3">
                              {state.description}
                            </p>
                          </div>
                          <section className="p-3 bg-blue-50/50 flex flex-col">
                            <div className="flex-1 overflow-y-auto max-h-[641px]">
                              {state?.items?.map((item, index) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={String(item.id)}
                                  index={index}
                                >
                                  {(provided) => (
                                    <article
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-white rounded-lg p-4 shadow-sm mb-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
                                      onClick={() =>
                                        openTaskEditModal(state.id, item)
                                      }
                                    >
                                      <div className="flex items-center justify-between group mb-3">
                                        <div className="flex items-center space-x-2">
                                          <h3 className="text-xl">
                                            {item.title}
                                          </h3>
                                          <button
                                            className="hidden group-hover:flex items-center text-sm text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteTask(
                                                state.id,
                                                item.id
                                              );
                                            }}
                                          >
                                            <img
                                              src="/images/Antwork/project/project_task_delete.png"
                                              alt="삭제"
                                              className="w-6 h-6"
                                            />
                                          </button>
                                        </div>
                                      </div>

                                      <div className="relative">
                                        <div className="absolute top-[-2.5rem] right-2 flex">
                                          {" "}
                                          {/* space-x-3으로 간격 조정 */}
                                          {item.assignedUserDetails &&
                                          item.assignedUserDetails.length >
                                            0 ? (
                                            // 첫 3명의 사용자만 표시
                                            item.assignedUserDetails
                                              .slice(0, 3)
                                              .map((user, index) => (
                                                <img
                                                  key={user.id}
                                                  src={
                                                    user.profileImageUrl ||
                                                    "/images/default_profile.png"
                                                  }
                                                  alt={`Profile of ${user.name}`}
                                                  className={`w-8 h-8 rounded-full border border-gray-300 z-${
                                                    index + 10
                                                  }`}
                                                />
                                              ))
                                          ) : (
                                            <span className="text-gray-500 text-xs">
                                              {" "}
                                            </span>
                                          )}
                                        </div>

                                        {/* 3명을 초과한 사용자 수 표시 */}
                                        {item.assignedUserDetails &&
                                          item.assignedUserDetails.length >
                                            3 && (
                                            <div className="absolute top-[-2.5rem] right-0 flex items-center">
                                              <div className="w-8 h-8 bg-gray-200 text-gray-600 font-bold flex items-center justify-center rounded-full border-2 border-white">
                                                +
                                                {item.assignedUserDetails
                                                  .length - 3}
                                              </div>
                                            </div>
                                          )}
                                      </div>

                                      <div className="flex gap-1">
                                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                                          {item.priorityName || "Unknown"}
                                        </span>
                                        <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                                          {item.sizeName || "Unknown"}
                                        </span>
                                      </div>
                                    </article>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          </section>
                          <div className="pt-3">
                            <button
                              onClick={() => openTaskCreateModal(state.id)}
                              className="w-full flex items-center text-left text-sm text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-white/30"
                            >
                              <img
                                src="/images/Antwork/project/project_addItem.png"
                                alt="추가"
                                className="w-5 h-5 mr-2"
                              />
                              <p className="text-[13px] text-gray-500">
                                Add item
                              </p>
                            </button>
                          </div>
                        </article>
                      )}
                    </Droppable>
                  ))}
                <div className="text-center">
                  <button
                    className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg text-black font-semibold shadow-md transition-all transform hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor:
                        "rgb(217 232 255 / var(--tw-bg-opacity, 1))",
                      fontSize: "15px",
                      border: "none",
                    }}
                    onClick={() => openModal("state-add")}
                  >
                    New Status
                    <svg
                      className="w-5 h-5 ml-2"
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
                  </button>
                </div>
              </section>
            </div>
          </div>
        </article>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold text-gray-600">Loading...</p>
        </div>
      )}
    </DragDropContext>
  );
}
