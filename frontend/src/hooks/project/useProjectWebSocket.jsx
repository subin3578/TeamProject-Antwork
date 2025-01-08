import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { update } from "lodash";
import { WS_URL } from "@/api/_URI";

const useProjectWebSocket = ({
  userId,
  projectId,
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
}) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.error(
        "❌ User ID is not available. WebSocket will not be initialized."
      );
      return;
    }

    if (!projectId) {
      console.error("❌ Project ID is not available");
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
      stompClientRef.current = client;

      // 구독 설정
      const subscription = client.subscribe(
        `/topic/project/${userId}`,
        (message) => {
          try {
            const data = JSON.parse(message.body); // 메시지 파싱
            console.log("🔔 알림 메시지 수신:", JSON.stringify(data));

            // 현재 보고 있는 프로젝트의 변경사항만 처리
            if (String(data.projectId) !== String(projectId)) {
              console.log(
                "다른 프로젝트의 변경사항이므로 무시 - 현재:",
                String(projectId),
                "수신된:",
                String(data.projectId)
              );
              return;
            }

            // 메시지의 action에 따라 처리
            switch (data.action) {
              // 협업자 초대
              case "collaboratorAdd":
                console.log("협업자 추가 메시지 수신:", data);
                // 최신 협업자 목록을 가져오는 함수 호출
                fetchCollaborators()
                  .then(() =>
                    console.log(
                      "✅ 협업자 목록이 성공적으로 업데이트되었습니다."
                    )
                  )
                  .catch((error) =>
                    console.error("❌ 협업자 목록 갱신 중 에러:", error)
                  );
                break;
              // 협업자 삭제
              case "collaboratorDelete":
                console.log("setCollaborators : " + setCollaborators);
                setCollaborators((prevCollaborators) => {
                  console.log("2222prevCollaborators:", prevCollaborators); // 상태 업데이트 전에 현재 상태를 찍어봄
                  const updatedCollaborators = prevCollaborators.filter(
                    (collaborator) => collaborator.id !== data.userId
                  );
                  console.log("updatedCollaborators:", updatedCollaborators); // 상태 업데이트 후 새 배열을 찍어봄
                  return updatedCollaborators;
                });
                fetchStatesAndTasks();
                break;
              // 작업상태 추가
              case "stateInsert":
                const newState = { ...data, items: [] };
                handleAddState(newState);
                break;
              // 작업상태 수정
              case "stateUpdate":
                const updatedState = { ...data };
                handleEditState(updatedState);
                break;
              // 작업상태 삭제
              case "stateDelete":
                setStates((prevStates) => {
                  console.log("prevStates:", prevStates);
                  const updatedStates = prevStates.filter(
                    (state) => String(state.id) !== String(data.id)
                  );
                  console.log("updatedStates:", updatedStates);
                  return updatedStates;
                });
                break;
              // 작업 추가
              case "taskInsert":
                setStates((prevStates) =>
                  prevStates.map((state) => {
                    if (String(state.id) === String(data.stateId)) {
                      // 중복 작업 확인
                      const isDuplicate = state.items.some(
                        (item) => item.id === data.id
                      );
                      if (isDuplicate) {
                        console.warn(
                          "⚠️ 중복된 작업입니다. 추가하지 않습니다."
                        );
                        return state;
                      }
                      // 중복이 아니면 작업 추가
                      return {
                        ...state,
                        items: [...(state.items || []), data],
                      };
                    }
                    return state;
                  })
                );
                break;
              // 작업 수정
              case "taskUpdate":
                setStates((prevStates) =>
                  prevStates.map((state) => {
                    // 수정된 작업이 속한 상태인지 확인
                    if (String(state.id) === String(data.stateId)) {
                      return {
                        ...state,
                        items: state.items.map((item) =>
                          String(item.id) === String(data.id)
                            ? { ...item, ...data }
                            : item
                        ),
                      };
                    }
                    return state;
                  })
                );
                break;
              // 작업 삭제
              case "taskDelete":
                setStates((prevStates) =>
                  prevStates.map((state) => ({
                    ...state,
                    items: state.items.filter(
                      (item) => String(item.id) !== String(data.id)
                    ),
                  }))
                );
                break;
              // 작업 드래그앤드랍
              case "taskDrag":
                console.log("🚚 작업 드래그 앤 드롭 메시지 수신:", data);

                setStates((prevStates) => {
                  let originalTask = null;

                  // 기존 상태에서 작업 찾기 및 제거
                  const updatedStates = prevStates.map((state) => {
                    const filteredItems = state.items.filter((item) => {
                      if (String(item.id) === String(data.id)) {
                        originalTask = item; // 기존 작업 객체 저장
                        return false; // 해당 작업 제거
                      }
                      return true;
                    });

                    return {
                      ...state,
                      items: filteredItems,
                    };
                  });

                  // 기존 작업과 수신된 데이터를 병합
                  if (originalTask) {
                    const updatedTask = {
                      ...originalTask, // 기존 작업의 모든 속성 유지
                      ...data, // 새 데이터 병합
                      assignedUserDetails:
                        originalTask.assignedUserDetails || [], // 작업담당자 유지
                      priorityName: data.priorityName || "Unknown",
                      sizeName: data.sizeName || "Unknown",
                    };

                    // 새로운 stateId에 맞는 상태에 작업 추가
                    return updatedStates.map((state) => {
                      if (String(state.id) === String(data.stateId)) {
                        return {
                          ...state,
                          items: [...state.items, updatedTask],
                        };
                      }
                      return state;
                    });
                  }

                  console.warn("⚠️ 기존 작업을 찾을 수 없습니다.");
                  return updatedStates;
                });

                console.log("✅ 작업이 실시간으로 업데이트되었습니다.");
                break;

              // 프로젝트 수정
              case "projectUpdate":
                console.log("🔄 프로젝트 이름 업데이트 수신:", data);

                setProject((prevProject) =>
                  prevProject.id === data.id
                    ? { ...prevProject, projectName: data.projectName }
                    : prevProject
                );

                console.log(
                  "✅ 프로젝트 이름이 실시간으로 업데이트되었습니다."
                );
                break;
              // 프로젝트 상태변경
              case "projectStatusUpdate":
                console.log("🔄 프로젝트 상태 업데이트 수신:", data);

                setProject((prevProject) =>
                  prevProject.id === data.id
                    ? {
                        ...prevProject,
                        projectName: data.projectName,
                        status: data.status,
                      }
                    : prevProject
                );
                console.log(
                  "✅ 프로젝트 상태가 실시간으로 업데이트되었습니다."
                );
                break;
            }
          } catch (error) {
            console.error("❌ 메시지 처리 중 에러:", error);
          }
        }
      );

      console.log("📩 Subscribed to: /topic/project/" + userId);

      return () => subscription.unsubscribe();
    };

    client.onDisconnect = () => {
      console.log("🔴 WebSocket 연결 해제");
      stompClientRef.current = null;
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
  }, [userId, projectId]);

  return stompClientRef;
};

export default useProjectWebSocket;
