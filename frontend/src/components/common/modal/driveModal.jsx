import { useEffect, useState } from "react";
import useModalStore from "./../../../store/modalStore";
import {
  addDriveCollaborators,
  driveFolderInsert,
  driveFolderNewNameUpDate,
  driveFolderTrashUpDate,
  MoveToFolder,
  MyDriveSelectView,
  MyDriveView,
  removeDriveCollaborator,
  selectDriveCollaborators,
} from "../../../api/driveAPI";
import useAuthStore from "../../../store/AuthStore";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {
  getProjectCollaborators,
  removeProjectCollaborator,
} from "@/api/projectAPI";
import { fetchDepartmentsByCompanyId } from "@/api/departmentAPI";

export default function DriveModal() {
  const { isOpen, type, props, closeModal, updateProps } = useModalStore();
  const [driveFolderName, setdriveFolderName] = useState("");
  const [ModifyName, setModfiyName] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [collaborators, setCollaborators] = useState([]);

  const [folderStates, setFolderStates] = useState([]);

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  const driveFolderNameId = props.id;
  const selectedDriveFileId = props.fileid;
  const driveFolderNewName = props.name;
  const driveFolderId = props.driveFolderId;
  const driveFolderMaker = user?.uid;

  //폴더 이동시 작동되는 폴더 조회 메서드드
  // 폴더 데이터 로드 함수
  const fetchFolderData = async (driveFolderId = null) => {
    try {
      const response = driveFolderId
        ? await MyDriveSelectView(driveFolderId)
        : await MyDriveView(user.uid);

      const folders = Array.isArray(response.data.folders)
        ? response.data.folders.map((folder) => ({
            driveFolderId: folder.driveFolderId,
            driveFolderName: folder.driveFolderName,
            driveParentFolderId: folder.driveParentFolderId,
            isExpanded: false,
            childrenLoaded: false,
          }))
        : [];

      setFolderStates((prevState) => {
        const existingIds = new Set(prevState.map((f) => f.driveFolderId));
        const newFolders = folders.filter(
          (folder) => !existingIds.has(folder.driveFolderId)
        );

        return [...prevState, ...newFolders];
      });
    } catch (error) {
      console.error("폴더 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const toggleFolder = async (folderId) => {
    setFolderStates((prevState) =>
      prevState.map((folder) =>
        folder.driveFolderId === folderId
          ? { ...folder, isExpanded: !folder.isExpanded }
          : folder
      )
    );

    const folder = folderStates.find((f) => f.driveFolderId === folderId);

    if (folder && !folder.isExpanded && !folder.childrenLoaded) {
      await fetchFolderData(folderId);
      setFolderStates((prevState) =>
        prevState.map((folder) =>
          folder.driveFolderId === folderId
            ? { ...folder, childrenLoaded: true }
            : folder
        )
      );
    }
  };

  const renderTree = (parentId = null) => {
    // parentId를 기준으로 자식 폴더 필터링
    const childFolders = folderStates.filter(
      (folder) => folder.driveParentFolderId === parentId
    );

    return childFolders.map((folder) => (
      <div key={folder.driveFolderId} style={{ marginLeft: "10px" }}>
        <span
          onClick={() => toggleFolder(folder.driveFolderId)}
          style={{ cursor: "pointer" }}
        >
          {folder.isExpanded ? "▼" : "▶"}
        </span>
        {/* 폴더 이름 클릭 시 폴더 이동 */}
        <span
          onClick={() => onFolderClick(folder.driveFolderId)}
          style={{ cursor: "pointer", color: "blue" }} // 클릭 가능하도록 스타일 추가
        >
          {folder.driveFolderName}
        </span>
        {/* 자식 폴더 렌더링 */}
        {folder.isExpanded && renderTree(folder.driveFolderId)}
      </div>
    ));
  };

  const onFolderClick = async (folderId) => {
    const uid = user.uid;
    const driveFolderId = driveFolderNameId; //이동할 폴더
    const driveFileId = selectedDriveFileId; // 이동할 파일일
    const selectDriveFolderId = folderId; //이동 될 폴더
    try {
      if (driveFolderId == selectDriveFolderId) {
        alert("선택된 폴더가 동일합니다.");
        return;
      }
      // 선택된 폴더 ID를 백엔드로 전송
      const response = await MoveToFolder({
        driveFolderId,
        selectDriveFolderId,
        uid,
        driveFileId,
      });
      console.log("response ", response);
      if (response) {
        alert("선택한 파일(폴더)가 이동되었습니다");
        closeModal();
        location.reload();
      }

      // 필요하면 상태 업데이트
      // setCurrentFolderId(folderId); // 상태로 현재 폴더 ID 관리
    } catch (error) {
      console.error("폴더 이동 오류:", error);
    }
  };

  // 선택된 작업담당자 관리하기 위한 상태
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  console.log(
    "selectedCollaborators : " + JSON.stringify(selectedCollaborators)
  );

  // const toggleCollaboratorsDropdown = () => {
  //   setIsCollaboratorsDropdownOpen(!isCollaboratorsDropdownOpen);
  // };

  //협업자목록록 가져오는 fetch함수
  const fetchCollaborators = async () => {
    try {
      if (driveFolderNameId) {
        const data = await selectDriveCollaborators(driveFolderNameId);
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

  // // 작업담당자 선택 핸들러
  // const handleSelectCollaborator = (collaborator) => {
  //   if (!selectedCollaborators.some((c) => c.id === collaborator.id)) {
  //     setSelectedCollaborators((prev) => [...prev, collaborator]); // collaborator 객체를 추가
  //   }
  // };

  // // 작업담당자 삭제 핸들러
  // const handleRemoveAssignedUser = (id) => {
  //   setSelectedCollaborators((prev) => prev.filter((c) => c.id !== id)); // 객체를 삭제
  // };

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
  }, [user?.id]);

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
    console.log("projectId:", driveFolderNameId);

    try {
      await addDriveCollaborators(driveFolderNameId, userIds);
      alert("협업자가 성공적으로 초대되었습니다!");

      // 협업자 목록 다시 불러오기
      const updatedCollaborators = await selectDriveCollaborators(
        driveFolderNameId
      );
      console.log("updatedCollaborators : " + updatedCollaborators);
      setCollaborators(updatedCollaborators);
      console.log("ㅁㄴㅇㄻㄴㅇㄹ: " + updatedCollaborators);

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
      await removeDriveCollaborator(driveFolderNameId, userId);
      // 협업자 목록 갱신
      const updatedCollaborators = await selectDriveCollaborators(
        driveFolderNameId
      );
      setCollaborators(updatedCollaborators);

      alert("협업자가 삭제되었습니다.");
    } catch (error) {
      console.error("협업자 삭제 실패:", error);
      alert("협업자 삭제에 실패했습니다.");
    }
  };

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (type === "insert") {
      console.log("dasfaadsfadsf : " + props.driveFolderId);
      console.log(driveFolderId);
      setdriveFolderName("");
    } else if (type === "name" && driveFolderNameId) {
      setModfiyName(driveFolderNewName);
    } else if (type === "recycle") {
      console.log("오로오롱 : " + driveFolderNameId, selectedDriveFileId);
    } else if (type === "move") {
      fetchFolderData();
      console.log("이거 아이디 머임? : " + driveFolderNameId);
    }
  }, [type]);

  if (!isOpen) return null;

  //이름바꾸기
  const handleNameSubmit = async () => {
    if (!ModifyName.trim()) {
      alert("폴더 이름을 입력하세요!");
      return;
    }
    console.log("asdf  : " + driveFolderNameId);
    try {
      if (driveFolderNameId) {
        const data = {
          driveFolderId: driveFolderNameId,
          driveFolderName: ModifyName,
        };
        console.log("datadata : ", data);
        const response = await driveFolderNewNameUpDate(data);
        console.log("ㅇㅁㄴㅇㄹ : ", response);

        closeModal();
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
    return;
  };

  //폴더등록
  const handleFolderSubmit = async () => {
    if (!driveFolderName.trim()) {
      alert("폴더 이름을 입력하세요!");
      return;
    }
    try {
      const data = {
        driveFolderName,
        driveFolderId,
        driveFolderMaker,
      };
      const response = await driveFolderInsert(data);

      // 백엔드 응답 확인
      console.log("Response from backend:", response);
      alert("폴더가 등록되었습니다.");

      // 날짜 포맷 변경 로직
      const formatDate = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length >= 3) {
          const [year, month, day] = dateArray;
          return `${year}.${String(month).padStart(2, "0")}.${String(
            day
          ).padStart(2, "0")}`;
        }
        return "N/A"; // 기본값
      };

      const formattedCreatedAt = formatDate(response.driveFolderCreatedAt);
      const formattedSharedAt = formatDate(response.driveFolderCreatedAt);

      if (props?.onFolderAdd) {
        props.onFolderAdd({
          driveFolderName: response.driveFolderName,
          driveFolderId: response.driveFolderId,
          driveFolderCreatedAt: formattedCreatedAt, // 포맷된 CreatedAt 날짜
          driveFolderSharedAt: formattedSharedAt, // 포맷된 SharedAt 날짜
          driveFolderSize: response.driveFolderSize,
          driveFolderMaker: response.driveFolderMaker,
          driveParentFolderId: response.driveParentFolderId,
          isChecked: false,
          isStarred: false,
        });
      }

      closeModal();
    } catch (error) {
      console.error("에러 발생:", error);
      alert("폴더 생성 중 문제가 발생했습니다.");
    }
  };

  //휴지통이동
  const handleRecycleSubmit = async () => {
    try {
      const response = await driveFolderTrashUpDate(
        driveFolderNameId,
        selectedDriveFileId
      );
      console.log("ㅇㅁㄴㅇㄹ : ", response);
      closeModal();
    } catch (error) {
      console.error("에러 발생:", error);
    }
    return;
  };

  const renderContent = () => {
    switch (type) {
      case "insert":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <i className="fa-solid fa-folder text-[#5C9CE6] text-xl"></i>
                <h2 className="text-lg font-semibold">새 폴더 만들기</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4">
                <input
                  type="text"
                  value={driveFolderName}
                  onChange={(e) => setdriveFolderName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="새 폴더"
                />
              </div>

              <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={handleFolderSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        );

      case "name":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">이름 바꾸기</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4">
                <input
                  type="text"
                  value={ModifyName}
                  onChange={(e) => setModfiyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="이름 바꾸기"
                />
              </div>

              <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={handleNameSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        );

      case "move":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <i className="fa-solid fa-folder text-[#5C9CE6] text-xl"></i>
                <h2 className="text-lg font-semibold">위치 선택</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4">
                <div className="border p-[5px]">
                  {/* 최상위 폴더 렌더링 */}
                  {renderTree(null)}
                </div>
              </div>

              <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={handleFolderSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        );
      case "delete":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[300px]">
              <div className="flex justify-between items-center px-6 pt-4 border-gray-200">
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900 ml-[auto]"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-4 text-center">
                <i className="fa-solid fa-circle-info text-[#5C9CE6] text-[20px] pb-[30px]"></i>
                <h3>'ㅁㄴㅇㄹ' 항목을 삭제하시겠습니까?</h3>
                <p>휴지통에서 삭제하신 항목은 복구할 수 없습니다.</p>
              </div>

              <div className="flex justify-center items-center gap-4 px-6 pt-4 pb-8">
                <button
                  onClick={handleNameSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  확인
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        );
      case "recycle":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[300px]">
              <div className="flex justify-between items-center px-6 pt-4 border-gray-200">
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900 ml-[auto]"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-4 text-center">
                <i className="fa-solid fa-circle-info text-[#5C9CE6] text-[20px] pb-[30px]"></i>
                <h3>'1개' 항목을 삭제하시겠습니까?</h3>
                <p>공유 중이거나 즐겨 찾는 파일도 함께 삭제되며,</p>
                <p>삭제된 항목은 휴지통으로 이동합니다.</p>
              </div>

              <div className="flex justify-center items-center gap-4 px-6 pt-4 pb-8">
                <button
                  onClick={handleRecycleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  확인
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        );
      case "out":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[300px]">
              <div className="flex justify-between items-center px-6 pt-4 border-gray-200">
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900 ml-[auto]"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-4 text-center">
                <i className="fa-solid fa-circle-info text-[#5C9CE6] text-[20px] pb-[30px]"></i>
                <h3>공유받은 항목에서 제거됩니다.</h3>
                <p>멤버 초대를 받은 폴더에서 나가며</p>
                <p>링크 공유를 받은 항목을 목록에서 제거합니다.</p>
              </div>

              <div className="flex justify-center items-center gap-4 px-6 pt-4 pb-8">
                <button
                  onClick={handleNameSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  확인
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        );
      case "c_share":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[600px] h-[650px] p-[10px] flex flex-col">
              {/* 상단 헤더 */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <i className="fa-solid fa-folder text-[#5C9CE6] text-xl"></i>
                <h2 className="text-lg font-semibold">공용 폴더 만들기</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900 text-xl"
                >
                  ✕
                </button>
              </div>

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
                      {collaborators.map((collaborator) => {
                        console.log("헐헐? : ", collaborator);
                        // departments와 collaborator 매칭
                        const matchedUser = departments
                          .flatMap((dept) => dept.users) // 모든 부서의 사용자 배열을 평탄화
                          .find((u) => u.id === collaborator.user_id); // 협업자의 user_id와 일치하는 사용자 찾기

                        const isOwner = collaborator.owner === true; // 소유자인지 확인
                        console.log("ㅇ헐ㄹ : ", matchedUser);

                        return (
                          <li
                            key={collaborator.user_id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                          >
                            {/* 사용자 이름과 직책 표시 */}
                            <span className="text-gray-800 font-medium">
                              {matchedUser
                                ? `${matchedUser.name} (${
                                    matchedUser.position || "직책 없음"
                                  })`
                                : "알 수 없는 사용자"}
                            </span>

                            {/* 소유자 여부에 따른 표시 */}
                            {isOwner ? (
                              <span className="text-green-500 text-sm font-medium">
                                생성자
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  handleRemoveCollaborator(collaborator.user_id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                삭제
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">현재 협업자가 없습니다.</p>
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
      default:
        return <div>모달 내용이 없습니다.</div>;
    }
  };

  return renderContent();
}
