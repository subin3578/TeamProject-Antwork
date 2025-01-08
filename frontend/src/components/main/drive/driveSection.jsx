import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import useModalStore from "../../../store/modalStore";
import {
  driveFileDownload,
  driveFilesInsert,
  driveFolderInsert,
  driveIsStared,
  MyDriveSelectView,
  MyDriveView,
  selectDriveAllSize,
  ToMyTrash,
} from "../../../api/driveAPI";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../../../store/AuthStore";


export default function DriveSection({ refreshUsage }) {
  const { driveFolderId } = useParams(); // URL 파라미터에서 폴더 ID 추출

  // 모달 상태 관리를 위한 useState 추가
  const openModal = useModalStore((state) => state.openModal);

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  const driveFileMaker = user?.uid;
  const driveFolderMaker = user?.uid;

  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState([
    { id: null, name: "MY DRIVE" },
  ]); // 초기 경로

  // const updateDriveUsage = useDriveStore((state) => state.updateDriveUsage);

  const [menuVisible, setMenuVisible] = useState(false); // 컨텍스트 메뉴 표시 상태
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // 메뉴 위치
  const [isListView, setIsListView] = useState(true); // 리스트와 앨범 뷰 전환 상태

  const [folderStates, setFolderStates] = useState([]);
  const [fileStates, setFileStates] = useState([]);

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedDriveIds, setSelectedDriveIds] = useState([]); // 체크된 폴더들의 ID
  const [selectedDriveName, setSelectedDriveName] = useState([]); // 체크된 폴더들의 ID

  const [selectedDriveFileIds, setSelectedDriveFileIds] = useState([]); // 체크된 폴더들의 ID
  const [selectedDriveFileName, setSelectedDriveFileName] = useState([]); // 체크된 폴더들의 ID

  const [selectStarId, setSelectStarId] = useState([]);

  const [activeBreadcrumb, setActiveBreadcrumb] = useState(null); //네비게이션 위치치

  const aa = selectedDriveIds[0];
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const driveFilesRef = useRef(null);

  ////////////////파일,폴더 업로드/////////////////////

  const fileAllSize = async () => {
    console.log("여기로 들어와? ");
    const uid = user.uid;
    try {
      const response = await selectDriveAllSize(uid);
      console.log("총 파일 크기:", response.data);
      console.log("adsf : " + response.data.driveFileLimitSize);
      console.log("asdfasdf :" + response.data.driveFileSize);
    } catch (error) {
      console.error("fileAllSize 중 오류 발생:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //파일업로드(클릭)
  const handleFileUpload = async () => {
    const driveFiles = driveFilesRef.current.files;
    if (driveFiles.length > 0) {
      const formData = new FormData();
      Array.from(driveFiles).forEach((file) => {
        formData.append("driveFiles", file);
        console.log("야옹이거어캐나와 ? :", file);
      });
      formData.append("driveFileMaker", driveFileMaker);
      if (driveFolderId) {
        formData.append("driveFolderId", driveFolderId);
      }
      console.log("드라이브파일아이디 : " + driveFolderId);

      try {
        const response = await driveFilesInsert(formData);
        console.log("백엔드 응답 안받아도됨:", response);
        driveFilesRef.current.value = "";
        // 최신 데이터 가져오기
        setIsLoading(true);
        await fetchFolderData(driveFolderId);
        setIsLoading(false);
        // 파일 업로드 후 DriveAside 상태 갱신 호출
        if (refreshUsage && refreshUsage.current) {
          refreshUsage.current();
        }
        setIsDropdownOpen(false);
      } catch (err) {
        console.error("에러에러에러", err);
      }
    }
  };

  //폴더 업로드(클릭)
  const handleFolderUpload = async (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);

    // 폴더 이름 추출 (첫 번째 파일의 경로를 기준으로)
    const driveFolderName = fileList[0].webkitRelativePath.split("/")[0];
    console.log("먀오오오오옹:", driveFolderName);
    console.log("드라이브폴더아이뒤 : ", driveFolderId);
    try {
      const data = {
        driveFolderName,
        driveFolderMaker,
        driveFolderId,
      };
      const folderResponse = await driveFolderInsert(data);
      const driveFolderId1 = folderResponse.driveFolderId;

      // 폴더 ID와 파일 데이터 설정
      const formData = new FormData();
      formData.append("driveFolderId", driveFolderId1);
      console.log("마요는귀여웡 : " + driveFolderId1);
      formData.append("driveFileMaker", driveFileMaker);

      for (let file of fileList) {
        formData.append("driveFiles", file, file.webkitRelativePath); // 상대 경로 포함
        console.log("웨에에에에에에옭 : ", file);
      }

      // 서버로 파일 업로드 요청
      const fileResponse = await driveFilesInsert(formData);
      console.log("아니 도대체 먼데 : " + fileResponse.status);
      console.log("아니 도대체 먼데 : ", fileResponse[0]);

      if (fileResponse !== null && fileResponse !== undefined) {
        alert("폴더 업로드 성공!");
      } else {
        throw new Error("폴더 업로드 실패");
      }
      setIsLoading(true);
      await fetchFolderData(driveFolderId);
      setIsLoading(false);
      // 드롭다운 닫기
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("폴더 업로드 에러:", error.message);
      alert("폴더 업로드 중 문제가 발생했습니다.");
    }
  };

  /////////////파일다운로드//////////////

  const handleDownload = async (driveFileId) => {
    try {
      const response = await driveFileDownload(driveFileId);

      // 서버 응답에서 Content-Disposition 헤더와 Content-Type을 사용하여 파일 저장
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "downloaded_file";

      // Content-Disposition에서 파일 이름 추출
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      // MIME 타입 설정
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // 파일 다운로드
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // 추출된 파일 이름 사용
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("파일 다운로드 완료:", fileName);
      return response;
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
      throw error;
    }
  };

  //////////////////////////////MyDrive목록 가져오기////////////////////////////////////

  const fetchFolderData = async (driveFolderId) => {
    setIsLoading(true); // 로딩 시작
    const uid = user.uid;
    try {
      let response;
      // driveFolderId가 있으면 상세 정보 요청, 없으면 목록 정보 요청
      if (driveFolderId) {
        response = await MyDriveSelectView(driveFolderId, uid); // 상세 정보 API 호출
        console.log("선택된 폴더:", response.data);
      } else {
        response = await MyDriveView(uid); // 목록 정보 API 호출
        console.log("폴더+파일 목록 데이터:", response.data);
      }

      // API 응답 구조에 맞게 데이터 추출
      const folders = Array.isArray(response.data.folders)
        ? response.data.folders
        : [];
      const files = Array.isArray(response.data.files)
        ? response.data.files
        : [];

      const breadcrumbs = response.data.breadcrumbs || []; // 배열로 설정
      setBreadcrumbs(breadcrumbs);

      console.log("폴더 데이터 매핑:", folders);
      setFolderStates(
        folders.map((folder) => {
          // 날짜 데이터 변환
          const dateArray = folder.driveFolderCreatedAt; // 배열 형태의 날짜
          let formattedDate = "N/A";

          if (Array.isArray(dateArray) && dateArray.length >= 3) {
            // 배열에서 연도, 월, 일 추출 및 포맷팅
            const [year, month, day] = dateArray;
            formattedDate = `${year}.${String(month).padStart(2, "0")}.${String(
              day
            ).padStart(2, "0")}`;
          }

          return {
            isChecked: folder.isChecked || false,
            isStared: folder.driveFolderIsStared || false,
            driveFolderName: folder.driveFolderName,
            driveFolderSize: folder.driveFolderSize,
            driveFolderCreatedAt: formattedDate, // 포맷된 날짜를 설정
            driveFolderMaker: folder.driveFolderMaker,
            driveFolderId: folder.driveFolderId,
            driveParentFolderId: folder.driveParentFolderId,
            driveParentFolderName: folder.parentFolderName,
            driveShareType: folder.driveFolderShareType,
          };
        })
      );

      setFileStates(
        files.map((file) => {
          // 날짜 데이터 변환
          const dateArray = file.driveFileCreatedAt; // 배열 형태의 날짜
          let formattedDate = "N/A";

          if (Array.isArray(dateArray) && dateArray.length >= 3) {
            // 배열에서 연도, 월, 일 추출 및 포맷팅
            const [year, month, day] = dateArray;
            formattedDate = `${year}.${String(month).padStart(2, "0")}.${String(
              day
            ).padStart(2, "0")}`;
          }

          return {
            isChecked: file.isChecked || false,
            isStared: file.driveIsStarted || false,
            driveFolderId: file.driveFolderId,
            driveFileSsName: file.driveFileSName,
            driveFileSName: file.driveFileSName.includes("_")
              ? file.driveFileSName.split("_")[1]
              : file.driveFileSName,
            Ext: file.driveFileSName.includes(".")
              ? file.driveFileSName.split(".").pop()
              : "",
            driveFileMaker: file.driveFileMaker,
            driveFileSize: file.driveFileSize,
            driveFileCreatedAt: formattedDate, // 포맷된 날짜 설정
            driveFileId: file.driveFileId,
          };
        })
      );
    } catch (err) {
      console.error("폴더 데이터를 가져오는 중 오류 발생:", err);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const formatFileSize = (driveFileSize) => {
    if (driveFileSize >= 1024 * 1024 * 1024) {
      return `${(driveFileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (driveFileSize >= 1024 * 1024) {
      return `${(driveFileSize / (1024 * 1024)).toFixed(2)} MB`;
    } else if (driveFileSize >= 1024) {
      return `${(driveFileSize / 1024).toFixed(2)} KB`;
    } else {
      return `${driveFileSize} BT`;
    }
  };

  //상위 네비게이션
  const handleBreadcrumbClick = (breadcrumbId) => {
    console.log("asdfasdf : " + breadcrumbId);
    if (breadcrumbId) {
      navigate(`/antwork/drive/folder/${breadcrumbId}`); // 클릭한 폴더로 이동
    } else {
      navigate("/antwork/drive"); // 최상위 폴더로 이동
    }
  };

  //주소의 드라이브 아이디가 바뀔때마다 실행
  useEffect(() => {
    fetchFolderData(driveFolderId); // driveFolderId가 있을 때는 상세 정보, 없으면 목록 데이터 불러오기
  }, [driveFolderId]); //  const { folderId } = useParams();의 folderId가 바뀔때마다 감지함

  //네비게이션변경시 확인하는 콘솔코드
  useEffect(() => {
    console.log("Updated Breadcrumbs:", breadcrumbs);
  }, [breadcrumbs]);

  // useEffect(() => {
  //   if (menuVisible) {
  //     console.log("현재 선택된 Drive ID:", selectedDriveId);
  //   }
  // }, [menuVisible, selectedDriveId]);

  ////////////////////////////////오른쪽 커스텀메뉴, 체크박스, 별표/////////////////////////////////////

  const handleContextMenu = (event, index, type) => {
    event.preventDefault(); // 기본 우클릭 메뉴 방지

    // 클릭 위치 저장
    const { clientX, clientY } = event;
    setMenuPosition({ x: clientX, y: clientY }); // 커스텀 메뉴 위치 설정
    setMenuVisible(true); // 커스텀 메뉴 열기

    if (type === "folder") {
      // 폴더 우클릭: 폴더만 체크하고 파일 관련 상태 초기화
      toggleFolderCheck(index, true); // forceExclusive=true로 현재 폴더만 체크

      // 파일 선택 상태와 관련된 상태 초기화
      setFileStates((prevStates) =>
        prevStates.map((file) => ({
          ...file,
          isChecked: false, // 모든 파일 선택 해제
        }))
      );
      setSelectedDriveFileIds([]); // 선택된 파일 ID 초기화
      setSelectedDriveFileName([]); // 선택된 파일 이름 초기화
    } else if (type === "file") {
      // 파일 우클릭: 파일만 체크하고 폴더 관련 상태 초기화
      toggleFileCheck(index, true); // forceExclusive=true로 현재 파일만 체크

      // 폴더 선택 상태와 관련된 상태 초기화
      setFolderStates((prevStates) =>
        prevStates.map((folder) => ({
          ...folder,
          isChecked: false, // 모든 폴더 선택 해제
        }))
      );
      setSelectedDriveIds([]); // 선택된 폴더 ID 초기화
      setSelectedDriveName([]); // 선택된 폴더 이름 초기화
    }
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleCloseMenu(); // 메뉴 외부 클릭 시 닫기
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 리스트/앨범 뷰 전환 함수
  const toggleView = (viewType) => {
    if (viewType === "list") {
      setIsListView(true);
    } else if (viewType === "album") {
      setIsListView(false);
    }
  };

  //폴더 체크박스⭐⭐
  const toggleFolderCheck = (index, forceExclusive = false) => {
    const updatedFolders = [...folderStates];

    if (forceExclusive) {
      // 모든 선택 해제
      updatedFolders.forEach((folder) => (folder.isChecked = false));
      // 현재 항목만 선택
      updatedFolders[index].isChecked = true;
    } else {
      // 선택 상태를 토글 (좌클릭 동작)
      updatedFolders[index].isChecked = !updatedFolders[index].isChecked;
    }

    // 선택된 폴더들의 ID 추출
    const updatedSelectedIds = updatedFolders
      .filter((folder) => folder.isChecked) // 체크된 폴더만
      .map((folder) => folder.driveFolderId); // ID 추출

    const updatedSelectedName = updatedFolders
      .filter((folder) => folder.isChecked) // 체크된 폴더만
      .map((folder) => folder.driveFolderName); // 이름 추출

    // 상태 업데이트
    setFolderStates(updatedFolders);
    setSelectedDriveIds(updatedSelectedIds);
    setSelectedDriveName(updatedSelectedName);

    console.log("현재 체크된 폴더 IDs:", updatedSelectedIds);
    console.log("이름 : ", updatedSelectedName);

    // 최신 선택된 ID 반환
    return updatedSelectedIds;
  };

  // 중요도 별표 상태 토글⭐⭐
  const toggleFolderStar = async (index) => {
    const uid = user.uid;
    try {
      let selectedFolder;

      // 선택된 폴더 상태 업데이트
      const updatedStates = folderStates.map((state, idx) => {
        if (idx === index) {
          selectedFolder = { ...state, isStared: !state.isStared }; // 선택된 폴더
          return selectedFolder;
        }
        return state;
      });

      setFolderStates(updatedStates); // 상태 업데이트

      if (selectedFolder) {
        console.log("선택된 폴더 ID:", selectedFolder.driveFolderId);

        // 선택된 폴더가 있는 경우 백엔드에 상태 업데이트
        const response = await driveIsStared({
          driveFolderId: selectedFolder.driveFolderId, // JSON 형식으로 전달
          userId: uid,
          driveFileId: null,
        });

        // driveFilesInsert가 response 형식을 반환하지 않으면 오류 발생
        if (response.status !== 200) {
          throw new Error("백엔드 응답 실패");
        }
        console.log("백엔드 응답:", response.data.isStared);
      }
    } catch (error) {
      console.error("백엔드 전송 에러:", error);
    }
  };

  ////파일체크❤️❤️
  const toggleFileCheck = (index, forceExclusive = false) => {
    const updatedFiles = [...fileStates];

    if (forceExclusive) {
      // 모든 선택 해제
      updatedFiles.forEach((File) => (File.isChecked = false));
      // 현재 항목만 선택
      updatedFiles[index].isChecked = true;
    } else {
      // 선택 상태를 토글 (좌클릭 동작)
      updatedFiles[index].isChecked = !updatedFiles[index].isChecked;
    }

    // 선택된 폴더들의 ID 추출
    const updatedSelectedIds = updatedFiles
      .filter((File) => File.isChecked) // 체크된 폴더만
      .map((File) => File.driveFileId); // ID 추출

    const updatedSelectedName = updatedFiles
      .filter((File) => File.isChecked) // 체크된 폴더만
      .map((File) => File.driveFileSsName); // 이름 추출

    // 상태 업데이트
    setFileStates(updatedFiles);
    setSelectedDriveFileIds(updatedSelectedIds);
    setSelectedDriveFileName(updatedSelectedName);

    console.log("현재 체크된 파일 IDs:", updatedSelectedIds);
    console.log("이름 : ", updatedSelectedName);

    // 최신 선택된 ID 반환
    return updatedSelectedIds;
  };
  ////파일 별표❤️❤️
  const toggleFileStar = async (index) => {
    const uid = user.uid;
    try {
      let selectedFiles;

      // 선택된 폴더 상태 업데이트
      const updatedStates = fileStates.map((state, idx) => {
        if (idx === index) {
          selectedFiles = { ...state, isStared: !state.isStared }; // 선택된 폴더
          return selectedFiles;
        }
        return state;
      });

      setFileStates(updatedStates); // 상태 업데이트

      if (selectedFiles) {
        console.log("선택된 폴더 ID:", selectedFiles.driveFileId);

        // 선택된 폴더가 있는 경우 백엔드에 상태 업데이트
        const response = await driveIsStared({
          driveFolderId: null, // JSON 형식으로 전달
          userId: uid,
          driveFileId: selectedFiles.driveFileId,
        });

        // driveFilesInsert가 response 형식을 반환하지 않으면 오류 발생
        if (response.status !== 200) {
          throw new Error("백엔드 응답 실패");
        }
        console.log("백엔드 응답:", response.data.isStared);
      }
    } catch (error) {
      console.error("백엔드 전송 에러:", error);
    }
  };

  const handleSelectAll = (isChecked) => {
    //폴더 상태 업데이트
    const updatedFolders = folderStates.map((folder) => ({
      ...folder,
      isChecked: isChecked,
    }));
    // 파일 상태 업데이트
    const updatedFiles = fileStates.map((file) => ({
      ...file,
      isChecked: isChecked,
    }));
    // 상태 업데이트
    setFolderStates(updatedFolders);
    setFileStates(updatedFiles);

    // 선택된 ID와 이름을 업데이트
    const updatedSelectedFolderIds = updatedFolders
      .filter((folder) => folder.isChecked) // 체크된 폴더만
      .map((folder) => folder.driveFolderId); // ID 추출

    const updatedSelectedFolderName = updatedFolders
      .filter((folder) => folder.isChecked) // 체크된 폴더만
      .map((folder) => folder.driveFolderName); // 이름 추출
    const updatedSelectedFileIds = updatedFiles
      .filter((File) => File.isChecked) // 체크된 폴더만
      .map((File) => File.driveFileId); // ID 추출

    const updatedSelectedFileName = updatedFiles
      .filter((File) => File.isChecked) // 체크된 폴더만
      .map((File) => File.driveFileSsName); // 이름 추출
    setSelectedDriveIds(updatedSelectedFolderIds);
    console.log("먀먀먀먀 : " + updatedSelectedFolderIds);
    setSelectedDriveName(updatedSelectedFolderName);
    setSelectedDriveFileIds(updatedSelectedFileIds);
    console.log("모모모모 : " + updatedSelectedFileIds);
    setSelectedDriveFileName(updatedSelectedFileName);
  };
  const isAllSelected =
    folderStates.every((folder) => folder.isChecked) &&
    fileStates.every((file) => file.isChecked);

  // 폴더에서 체크된 항목의 수
  const selectedFolderCount = folderStates.filter(
    (folder) => folder.isChecked
  ).length;

  // 파일에서 체크된 항목의 수
  const selectedFileCount = fileStates.filter((file) => file.isChecked).length;

  // 체크된 항목들의 총합
  const totalSelectedCount = selectedFolderCount + selectedFileCount;

  //휴지통으로
  const ToMyDrive = async (updatedSelectedIds, selectedDriveFileIds) => {
    try {
      console.log(
        "선택된 아이디들 : ",
        updatedSelectedIds,
        selectedDriveFileIds
      ); // 배열 형태로 출력
      // updatedSelectedIds를 사용하여 서버로 요청하거나 다른 작업을 진행
      const response = await ToMyTrash(
        updatedSelectedIds,
        selectedDriveFileIds
      ); // MyTrashSelectView는 선택된 항목들로 작업을 처리
      console.log("응답 : ", response);
      setIsLoading(true);
      await fetchFolderData(driveFolderId);
      setIsLoading(false);
    } catch (err) {
      console.error("휴지통 폴더 데이터를 가져오는 중 오류 발생:", err);
    }
  };

  // 복원 버튼 클릭 시 ToMyDrive 호출
  const handleRestoreClick = () => {
    // 상태에서 selectedDriveIds 값을 가져와서 ToMyDrive에 전달
    ToMyDrive(selectedDriveIds, selectedDriveFileIds);
  };

  // 로딩 애니메이션 컴포넌트
  const LoadingAnimation = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce fast"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce fast animation-delay-200"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce fast animation-delay-400"></div>
      </div>
    </div>
  );

  //   /////// 폴더이름 조회
  // const FolderName = async (driveFolderNameId) => {
  //   try {
  //     const response = await driveFolderFind(driveFolderNameId);
  //     console.log("response: ", response);

  //     // 폴더 이름과 ID를 함께 모달로 전달
  //     openModal("name", { id: driveFolderNameId, name: response.data });
  //   } catch (err) {
  //     console.error("에러 발생: ", err);
  //   }
  // };
  return (
    <>
      {isLoading ? <LoadingAnimation /> : null}
      <div className="bg-white p-[20px] rounded-[8px] border-none h-[850px] flex flex-col overflow-hidden">
        <article className="drive_header flex-shrink-0">
          <div className="flex justify-between">
            <div className="h-[45px] leading-[24px] text-center">
              <h1 className="text-[21px] font-semibold !text-left">DRIVE</h1>
              <p className="text-[15px] text-[#6b7280]">MY DRIVE입니다.</p>
            </div>
            <div className="border w-[250px] h-[30px] rounded-[4px] flex items-center">
              <input
                className="bg-[#D9E8FF] w-[190px] h-[30px] rounded-[4px] pl-[3px]"
                type="text"
                value={null}
                name="drive_search"
                placeholder="파일검색"
              />
              <button className="mx-[4px] w-[20px] h-[15px]">
                <img
                  src="/images/Antwork/main/drive/arrow_drop_down.png"
                  alt=""
                />
              </button>
              <button className="mx-[5px] w-[20px] h-[15px]">
                <img src="/images/Antwork/main/drive/search.png" alt="" />
              </button>
            </div>
          </div>
          <div className="breadcrumbs text-gray-500 text-sm text-left h-[15px] mt-[7px] overflow-hidden whitespace-nowrap">
            {breadcrumbs.map((breadcrumb, index) => (
              <span key={breadcrumb.id || index}>
                {index > 0 && " → "}
                <button
                  onClick={() => handleBreadcrumbClick(breadcrumb.id)}
                  className={`${
                    driveFolderId === breadcrumb.id
                      ? "text-yellow-500"
                      : "text-black-500"
                  } hover:underline`}
                >
                  {breadcrumb.name}
                </button>
              </span>
            ))}
          </div>
        </article>

        <article className="drive_update flex-shrink-0 mt-[10px] mb-[20px]">
          <div className="flex justify-between">
            <div className="drive_active flex space-x-2">
              <button
                onClick={toggleDropdown}
                className="w-[70px] h-[30px] border rounded-[4px] bg-[#4078ff] text-white"
              >
                업로드
              </button>
              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute mt-11 w-[150px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {/* 파일 올리기 */}
                  <label
                    htmlFor="fileUpload"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    파일 올리기
                  </label>
                  <input
                    type="file"
                    name="driveFiles"
                    ref={driveFilesRef}
                    id="fileUpload"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />

                  {/* 폴더 올리기 */}
                  <label
                    htmlFor="folderUpload"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    폴더 올리기
                  </label>
                  <input
                    type="file"
                    id="folderUpload"
                    className="hidden"
                    webkitdirectory="true"
                    onChange={handleFolderUpload}
                  />
                </div>
              )}
              <button
                onClick={() =>
                  openModal("insert", {
                    driveFolderId,
                    onFolderAdd: (newFolder) => {
                      setFolderStates((prevState) => [...prevState, newFolder]); // 기존 상태 배열에 새 폴더 추가
                    },
                  })
                } // driveFolderId 값을 객체로 전달
                className="w-[70px] h-[30px] border rounded-[4px]"
              >
                새폴더
              </button>
              <button className="w-[70px] h-[30px] border rounded-[4px]">
                파일유형
              </button>
              {totalSelectedCount > 0 && (
                <div>
                  <button
                    onClick={handleRestoreClick}
                    className="w-[45px] h-[30px] border rounded-[4px]"
                  >
                    휴지통
                  </button>
                  <span className="ml-[5px]">
                    <span className="text-blue-500">{totalSelectedCount}</span>
                    개 선택
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button className="drive_List" onClick={() => toggleView("list")}>
                <img
                  src="/images/Antwork/main/drive/list.png"
                  alt=""
                  className="w-[25px] h-[25px]"
                />
              </button>
              <button
                className="drive_Album"
                onClick={() => toggleView("album")}
              >
                <img
                  src="/images/Antwork/main/drive/grid.png"
                  alt=""
                  className="w-[25px] h-[25px]"
                />
              </button>
              <button className="drive_info">
                <img
                  src="/images/Antwork/main/drive/info.png"
                  alt=""
                  className="w-[25px] h-[25px]"
                />
              </button>
            </div>
          </div>
        </article>
        <article className="drive_main flex-grow overflow-y-auto">
          <div>
            {isLoading ? (
              // 로딩 중일 때 콘텐츠 렌더링을 방지
              <div></div>
            ) : isListView ? (
              // 리스트 뷰
              <table className="w-full border-y">
                <thead>
                  <tr className="h-14">
                    <th className="w-[3%]">
                      <input
                        checked={isAllSelected} // 모든 항목이 선택되었을 때 checked상태를 유지
                        onChange={(e) => handleSelectAll(e.target.checked)} //전체 선택/해제처리
                        disabled={
                          folderStates.length === 0 && fileStates.length === 0
                        }
                        type="checkbox"
                      />
                    </th>
                    <th className="w-[2%]">⭐</th>
                    <th className="w-[3%]">종류</th>
                    <th className="w-[20%]">이름</th>
                    <th className="w-[10%]">크기</th>
                    <th className="w-[10%]">소유자</th>
                    <th className="w-[10%]">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {folderStates.length === 0 && fileStates.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center border-t h-[50px] font-bold"
                      >
                        업로드된 폴더가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {/* 폴더 */}
                      {folderStates.map((folder, index) => {
                        console.log("폴더 데이터:", folder); // 폴더 객체 확인
                        return (
                          <tr
                            key={`folder-${index}`}
                            className={`text-center align-middle h-16 border-t hover:bg-gray-100 ${
                              folder.isChecked ? "bg-blue-50" : ""
                            }`}
                            onContextMenu={(e) =>
                              handleContextMenu(e, index, "folder")
                            } // 커스텀 메뉴 표시
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={folder.isChecked}
                                onChange={() => toggleFolderCheck(index)}
                              />
                            </td>
                            <td>
                              <button onClick={() => toggleFolderStar(index)}>
                                <i
                                  className={`fa-star cursor-pointer text-xl ${
                                    folder.isStared
                                      ? "fa-solid text-yellow-500"
                                      : "fa-regular text-gray-300"
                                  }`}
                                ></i>
                              </button>
                            </td>
                            <td>
                              <i
                                className={
                                  folder.driveShareType === 1
                                    ? "fa-solid fa-folder-open text-[16px] text-[#FFC558]" // driveFoldershareType이 1일 경우
                                    : "fa-solid fa-folder text-[16px] text-[#FFC558]" // 그 외의 경우
                                }
                              ></i>
                            </td>
                            <td>
                              <Link
                                to={`/antwork/drive/folder/${folder.driveFolderId}`}
                              >
                                {folder.driveFolderName}
                              </Link>
                            </td>
                            <td>{folder.driveFolderSize}</td>
                            <td>{folder.driveFolderMaker}</td>
                            <td>{folder.driveFolderCreatedAt}</td>
                          </tr>
                        );
                      })}

                      {/* 파일 */}
                      {fileStates.map((file, index) => {
                        console.log("파일 데이터:", file); // 파일 객체 확인
                        return (
                          <tr
                            key={`file-${index}`}
                            className={`text-center align-middle h-16 border-t hover:bg-gray-100 ${
                              file.isChecked ? "bg-blue-50" : ""
                            }`}
                            onContextMenu={(e) =>
                              handleContextMenu(e, index, "file")
                            } // 커스텀 메뉴 표시
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={file.isChecked}
                                onChange={() => toggleFileCheck(index)}
                              />
                            </td>
                            <td>
                              <button onClick={() => toggleFileStar(index)}>
                                <i
                                  className={`fa-star cursor-pointer text-xl ${
                                    file.isStared
                                      ? "fa-solid text-yellow-500"
                                      : "fa-regular text-gray-300"
                                  }`}
                                ></i>
                              </button>
                            </td>
                            <td>
                              {file.Ext === "txt" && (
                                <i className="fa-solid fa-file-lines text-[16px] text-[#6D8EC2]"></i>
                              )}
                              {["png", "jpg", "jpeg"].includes(file.Ext) && (
                                <i className="fa-solid fa-image text-[16px] text-[#779C76]"></i>
                              )}
                              {file.Ext === "zip" && (
                                <i className="fa-solid fa-file-zipper text-[16px] text-[#6B5E69]"></i>
                              )}
                              {file.Ext === "csv" && (
                                <i className="fa-solid fa-file-fragment text-[16px] text-[#7559AB]"></i>
                              )}
                              {![
                                "txt",
                                "png",
                                "jpg",
                                "jpeg",
                                "zip",
                                "csv",
                                "folder",
                              ].includes(file.Ext) && (
                                <i className="fa-solid fa-file-import text-[16px] text-[#847E8C]"></i>
                              )}
                            </td>
                            <td
                              onClick={() => handleDownload(file.driveFileId)}
                            >
                              {file.driveFileSName}
                            </td>
                            <td>{formatFileSize(file.driveFileSize)}</td>
                            <td>{file.driveFileMaker}</td>
                            <td>{file.driveFileCreatedAt}</td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            ) : (
              // 앨범 뷰
              <div className="grid grid-cols-10 gap-8">
                {folderStates.length === 0 && fileStates.length === 0 ? (
                  <div className="border-t w-full">
                    업로드 된 파일이 없습니다
                  </div>
                ) : (
                  <>
                    {/* 폴더 */}
                    {folderStates.map((folder, index) => (
                      <Link
                        to={`/antwork/drive/folder/${folder.driveFolderId}`}
                        key={index}
                        onClick={(e) => {
                          // 체크된 상태에서 클릭 시 링크 이동 방지 및 체크박스 해제
                          if (folder.isChecked) {
                            e.preventDefault(); // 링크 이동 방지
                            // toggleFolderCheck(index); // 체크 해제
                          }
                        }}
                      >
                        <div
                          className={`relative border p-4 group rounded-md ${
                            folder.isChecked
                              ? "bg-blue-50 border-blue-500"
                              : "hover:bg-gray-100"
                          } transition`}
                          onContextMenu={(e) =>
                            handleContextMenu(e, index, "folder")
                          } // 커스텀 메뉴 표시
                        >
                          <div
                            className={`absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border ${
                              folder.isChecked
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-400 border-gray-300 group-hover:border-gray-500"
                            } ${
                              folder.isChecked
                                ? ""
                                : "opacity-0 group-hover:opacity-100"
                            } transition-opacity`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFolderCheck(index);
                            }}
                          >
                            {folder.isChecked && (
                              <i className="fa-solid fa-check"></i>
                            )}
                          </div>
                          <i className="fa-solid fa-folder text-[43px] text-[#FFC558] mx-20 my-[25px]"></i>
                          <div className="text-center mt-2">
                            {folder.driveFolderName}
                          </div>
                          <button
                            className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center ${
                              folder.isStared
                                ? "text-yellow-500"
                                : "text-gray-300 group-hover:text-gray-500"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFolderStar(index);
                            }}
                          >
                            <i
                              className={`fa-star ${
                                folder.isStared ? "fa-solid" : "fa-regular"
                              }`}
                            ></i>
                          </button>
                        </div>
                      </Link>
                    ))}
                    {/* 파일 */}
                    {fileStates.map((file, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          // 체크된 상태에서 클릭 시 링크 이동 방지 및 체크박스 해제
                          if (file.isChecked) {
                            e.preventDefault(); // 링크 이동 방지
                            // toggleFileCheck(index); // 체크 해제
                          }
                        }}
                        className={`relative border p-4 group rounded-md ${
                          file.isChecked
                            ? "bg-blue-50 border-blue-500"
                            : "hover:bg-gray-100"
                        } transition`}
                        onContextMenu={(e) =>
                          handleContextMenu(e, index, "file")
                        } // 커스텀 메뉴 표시
                      >
                        <div
                          className={`absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border ${
                            file.isChecked
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-400 border-gray-300 group-hover:border-gray-500"
                          } ${
                            file.isChecked
                              ? ""
                              : "opacity-0 group-hover:opacity-100"
                          } transition-opacity`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFileCheck(index);
                          }}
                        >
                          {file.isChecked && (
                            <i className="fa-solid fa-check"></i>
                          )}
                        </div>
                        {file.Ext === "txt" && (
                          <i className="fa-solid fa-file-lines  text-[43px] text-[#6D8EC2] mx-20 my-[25px]"></i>
                        )}
                        {["png", "jpg", "jpeg"].includes(file.Ext) && (
                          <i className="fa-solid fa-image text-[43px] text-[#779C76] mx-20 my-[25px]"></i>
                        )}
                        {file.Ext === "zip" && (
                          <i className="fa-solid fa-file-zipper text-[43px] text-[#6B5E69] mx-20 my-[25px]"></i>
                        )}
                        {file.Ext === "csv" && (
                          <i className="fa-solid fa-file-fragment text-[43px] text-[#7559AB] mx-20 my-[25px]"></i>
                        )}
                        {![
                          "txt",
                          "png",
                          "jpg",
                          "jpeg",
                          "zip",
                          "csv",
                          "folder",
                        ].includes(file.Ext) && (
                          <i className="fa-solid fa-file-import text-[43px] text-[#847E8C] mx-20 my-[25px]"></i>
                        )}
                        <div
                          onClick={() => handleDownload(file.driveFileId)}
                          className="text-center mt-2"
                        >
                          {file.driveFileSName}
                        </div>
                        <button
                          className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center ${
                            file.isStared
                              ? "text-yellow-500"
                              : "text-gray-300 group-hover:text-gray-500"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFileStar(index)}}
                        >
                          <i
                            className={`fa-star ${
                              file.isStared ? "fa-solid" : "fa-regular"
                            }`}
                          ></i>
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
      {/* 커스텀 메뉴 */}
      {menuVisible && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
            zIndex: 50,
          }}
          className="w-[200px] bg-white shadow-lg border rounded-md py-2"
        >
          <ul>
            <li className="py-1 px-3 hover:bg-gray-100 cursor-pointer">
              <i className="fa-solid fa-folder-open mr-2"></i> 열기
            </li>
            <li className="py-1 px-3 hover:bg-gray-100 cursor-pointer">
              <i className="fa-solid fa-folder-plus mr-2 my-2"></i> 새 폴더
            </li>
            <li className="py-1 px-3 hover:bg-gray-100 cursor-pointer">
              <i className="fa-solid fa-file-upload mr-2 my-2"></i> 업로드
            </li>
            <li className="py-1 px-3 hover:bg-gray-100 cursor-pointer">
              <i className="fa-solid fa-file-arrow-down mr-2 my-2"></i> 다운로드
            </li>
            <li className="py-1 px-3 hover:bg-gray-100 cursor-pointer border-t">
              <i className="fa-solid fa-star mr-2 my-2"></i> 즐겨찾기 추가
            </li>
            <li
              onClick={() => {
                console.log("asdf");
                setMenuVisible(false);
                openModal("recycle", {
                  id: selectedDriveIds[0],
                  fileid: selectedDriveFileIds[0],
                });
                console.log("이거 찍혀? : " + selectedDriveIds[0]);
                console.log("오호오오호오호호 : " + selectedDriveFileIds[0]);
              }}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer border-t"
            >
              <i className="fa-solid fa-trash mr-2 my-2"></i> 삭제
            </li>
            <li
              onClick={() => {
                console.log("폴더 공유하기");
                setMenuVisible(false);
                openModal("c_share", {
                  id: selectedDriveIds[0],
                  fileid: selectedDriveFileIds[0],
                });
              }}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer border-t"
            >
              <i className="fa-solid fa-users mr-2 my-2"></i> 공유하기
            </li>
            <li
              onClick={() => {
                console.log("asdf");
                setMenuVisible(false);
                openModal("move", {
                  id: selectedDriveIds[0],
                  fileid: selectedDriveFileIds[0],
                });
              }}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer border-t"
            >
              <i className="fa-solid fa-plane mr-2 my-2"></i> 이동하기
            </li>
            <li
              onClick={() => {
                setMenuVisible(false);
                openModal("name", {
                  name: selectedDriveName[0],
                  id: selectedDriveIds[0],
                }); // 선택된 ID 하나만 전달
                console.log("이거 찍혀? : " + selectedDriveIds[0]);
                console.log("이거는 찍혀 ?  : " + selectedDriveName[0]);
              }}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer border-t"
            >
              <i className="fa-solid fa-pen mr-2 my-2"></i> 이름 바꾸기
            </li>
            <li className="py-1 px-3 hover:bg-gray-100 cursor-pointer">
              <i className="fa-solid fa-circle-info mr-2"></i> 상세정보
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
