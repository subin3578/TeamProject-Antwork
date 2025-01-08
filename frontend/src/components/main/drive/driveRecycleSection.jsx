import { useEffect, useRef, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useModalStore from "../../../store/modalStore";
import {
  MyTrashSelectView,
  MyTrashView,
  ToMyDrive,
} from "../../../api/driveAPI";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../../../store/AuthStore";

export default function DriveSection() {
  const { driveFolderId } = useParams(); // URL 파라미터에서 폴더 ID 추출

  // 모달 상태 관리를 위한 useState 추가
  const openModal = useModalStore((state) => state.openModal);

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const driveFileMaker = user?.uid;
  const driveFolderMaker = user?.uid;

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

  const aa = selectedDriveIds[0];
  const menuRef = useRef(null);
  const driveFilesRef = useRef(null);

  //////////////////////////////MyDrive목록 가져오기/////////////////////////////////////////////

  const fetchTrashFolderData = async (driveFolderId) => {
    setIsLoading(true); // 로딩 시작
    const uid = user.uid;
    console.log("ㅁㄴㄴㅇㄹ : 들어오냐?  : " + uid);
    try {
      let response;
      // driveFolderId가 있으면 상세 정보 요청, 없으면 목록 정보 요청
      if (driveFolderId) {
        console.log("읭읭읭? : " + driveFolderId);
        response = await MyTrashSelectView(driveFolderId); // 상세 정보 API 호출
        console.log("휴지통 폴더:", response.data);
      } else {
        response = await MyTrashView(uid); // 목록 정보 API 호출
        console.log("휴지통 폴더+파일 목록 데이터:", response.data);
      }

      // API 응답 구조에 맞게 데이터 추출
      const folders = Array.isArray(response.data.folders)
        ? response.data.folders
        : [];
      const files = Array.isArray(response.data.files)
        ? response.data.files
        : [];
      console.log("휴지통 폴더 데이터 매핑:", folders);
      setFolderStates(
        folders.map((folder) => {
          // 날짜 데이터 변환
          const createdAtArray = folder.driveFolderCreatedAt;

          let formattedCreatedAt = "N/A";
          if (Array.isArray(createdAtArray) && createdAtArray.length >= 3) {
            const [year, month, day] = createdAtArray;
            formattedCreatedAt = `${year}.${String(month).padStart(
              2,
              "0"
            )}.${String(day).padStart(2, "0")}`;
          }

          return {
            isChecked: folder.isChecked || false,
            isStarred: folder.isStarred || false,
            driveFolderName: folder.driveFolderName,
            driveFolderSize: folder.driveFolderSize,
            driveFolderCreatedAt: formattedCreatedAt, // 포맷된 CreatedAt 날짜
            driveFolderMaker: folder.driveFolderMaker,
            driveFolderId: folder.driveFolderId,
            driveParentFolderId: folder.driveParentFolderId,
            driveParentFolderName: folder.parentFolderName,
          };
        })
      );

      setFileStates(
        files.map((file) => {
          // 날짜 데이터 변환
          const createdAtArray = file.driveFileCreatedAt;

          let formattedCreatedAt = "N/A";
          if (Array.isArray(createdAtArray) && createdAtArray.length >= 3) {
            const [year, month, day] = createdAtArray;
            formattedCreatedAt = `${year}.${String(month).padStart(
              2,
              "0"
            )}.${String(day).padStart(2, "0")}`;
          }

          return {
            isChecked: file.isChecked || false,
            isStarred: file.isStarred || false,
            driveFileSsName: file.driveFileSName,
            driveFileSName: file.driveFileSName.includes("_")
              ? file.driveFileSName.split("_")[1]
              : file.driveFileSName,
            Ext: file.driveFileSName.includes(".")
              ? file.driveFileSName.split(".").pop()
              : "",
            driveFileMaker: file.driveFileMaker,
            driveFileSize: file.driveFileSize,
            driveFileCreatedAt: formattedCreatedAt, // 포맷된 CreatedAt 날짜
            driveFileId: file.driveFileId,
            driveParentFolderName: file.parentFolderName,
          };
        })
      );
    } catch (err) {
      console.error("휴지통 폴더 데이터를 가져오는 중 오류 발생:", err);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchTrashFolderData(driveFolderId); // driveFolderId가 있을 때는 상세 정보, 없으면 목록 데이터 불러오기
  }, [driveFolderId]); //  const { folderId } = useParams();의 folderId가 바뀔때마다 감지함

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

  // 중요도 별표 상태 토글
  const toggleFolderStar = (index) => {
    setFolderStates((prevStates) =>
      prevStates.map((state, idx) =>
        idx === index ? { ...state, isStarred: !state.isStarred } : state
      )
    );
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

  const toggleFileStar = (index) => {
    setFileStates((prevStates) =>
      prevStates.map((state, idx) =>
        idx === index ? { ...state, isStarred: !state.isStarred } : state
      )
    );
  };

  // 폴더에서 체크된 항목의 수
  const selectedFolderCount = folderStates.filter(
    (folder) => folder.isChecked
  ).length;

  // 파일에서 체크된 항목의 수
  const selectedFileCount = fileStates.filter((file) => file.isChecked).length;

  // 체크된 항목들의 총합
  const totalSelectedCount = selectedFolderCount + selectedFileCount;

  // 복원하기(상단버튼클릭)
  const MyDrive = async (updatedSelectedIds, selectedDriveFileIds) => {
    try {
      console.log(
        "선택된 아이디들 : ",
        updatedSelectedIds,
        selectedDriveFileIds
      ); // 배열 형태로 출력
      // updatedSelectedIds를 사용하여 서버로 요청하거나 다른 작업을 진행
      const response = await ToMyDrive(
        updatedSelectedIds,
        selectedDriveFileIds
      ); // MyTrashSelectView는 선택된 항목들로 작업을 처리
      console.log("응답 : ", response);
      setIsLoading(true);
      await fetchTrashFolderData(driveFolderId);
      setIsLoading(false);
    } catch (err) {
      console.error("휴지통 폴더 데이터를 가져오는 중 오류 발생:", err);
    }
  };

  // 복원 버튼 클릭 시 ToMyDrive 호출
  const handleRestoreClick = () => {
    // 상태에서 selectedDriveIds 값을 가져와서 ToMyDrive에 전달
    MyDrive(selectedDriveIds, selectedDriveFileIds);
    setMenuVisible(false);
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

  return (
    <>
      {isLoading ? <LoadingAnimation /> : null}
      <div className="bg-white p-[40px] rounded-[8px] border-none h-[850px] flex flex-col overflow-hidden">
        <article className="dirve_header flex-shrink-0">
          <div className="flex justify-between">
            <div className="h-[30px] leading-[30px] text-center">
              <h3>휴지통</h3>
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
        </article>

        <article className="drive_update flex-shrink-0 my-[20px]">
          <div className="flex justify-between">
            <div className="drive_active flex space-x-2">
              <button className="w-[90px] h-[30px] border rounded-[4px] mx-[5px] bg-[#4078ff] text-white">
                휴지통 비우기
              </button>
              {totalSelectedCount > 0 && (
                <div>
                  <button
                    onClick={handleRestoreClick}
                    className="w-[45px] h-[30px] border rounded-[4px]"
                  >
                    복원
                  </button>
                  <span className="ml-[5px]">
                    <span className="text-blue-500">{totalSelectedCount}</span>
                    개 선택
                  </span>
                </div>
              )}
            </div>
            <div>
              <button className="drive_List" onClick={() => toggleView("list")}>
                <img
                  src="/images/Antwork/main/drive/list.png"
                  alt=""
                  className="w-[25px] h-[25px] mx-[10px]"
                />
              </button>
              <button
                className="drive_Album"
                onClick={() => toggleView("album")}
              >
                <img
                  src="/images/Antwork/main/drive/grid.png"
                  alt=""
                  className="w-[25px] h-[25px] mx-[10px]"
                />
              </button>
              <button className="drive_info">
                <img
                  src="/images/Antwork/main/drive/info.png"
                  alt=""
                  className="w-[25px] h-[25px] mx-[10px]"
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
                      <input type="checkbox" />
                    </th>
                    <th className="w-[2%]">⭐</th>
                    <th className="w-[3%]">종류</th>
                    <th className="w-[20%]">이름</th>
                    <th className="w-[10%]">크기</th>
                    <th className="w-[10%]">소유자</th>
                    <th className="w-[10%]">원래위치</th>
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
                                    folder.isStarred
                                      ? "fa-solid text-yellow-500"
                                      : "fa-regular text-gray-300"
                                  }`}
                                ></i>
                              </button>
                            </td>
                            <td>
                              <i className="fa-solid fa-folder text-[16px] text-[#FFC558]"></i>
                            </td>
                            <td
                              onClick={(e) => {
                                e.preventDefault;
                                alert("하위폴더를 보려면 복원해야합니다.");
                              }}
                              className=""
                            >
                              {folder.driveFolderName}
                            </td>
                            <td>{folder.driveFolderSize}</td>
                            <td>{folder.driveFolderMaker}</td>
                            <td>{folder.driveParentFolderName}</td>
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
                                    file.isStarred
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
                            <td>{file.driveFileSName}</td>
                            <td>{file.driveFileSize}</td>
                            <td>{file.driveFileMaker}</td>
                            <td>{file.driveParentFolderName}</td>
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
                        to={`/antwork/drive/recycle/folder/${folder.driveFolderId}`}
                        key={index}
                        onClick={(e) => {
                          // 체크된 상태에서 클릭 시 링크 이동 방지 및 체크박스 해제
                          if (folder.isChecked) {
                            e.preventDefault(); // 링크 이동 방지
                            toggleFolderCheck(index); // 체크 해제
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
                              folder.isStarred
                                ? "text-yellow-500"
                                : "text-gray-300 group-hover:text-gray-500"
                            }`}
                            onClick={() => toggleFolderStar(index)}
                          >
                            <i
                              className={`fa-star ${
                                folder.isStarred ? "fa-solid" : "fa-regular"
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
                            toggleFileCheck(index); // 체크 해제
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
                        <div className="text-center mt-2">
                          {file.driveFileSName}
                        </div>
                        <button
                          className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center ${
                            file.isStarred
                              ? "text-yellow-500"
                              : "text-gray-300 group-hover:text-gray-500"
                          }`}
                          onClick={() => toggleFileStar(index)}
                        >
                          <i
                            className={`fa-star ${
                              file.isStarred ? "fa-solid" : "fa-regular"
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
            <li
              onClick={handleRestoreClick}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer"
            >
              <i className="fa-solid fa-folder-plus mr-2"></i> 복원
            </li>
            <li
              onClick={() => {
                setMenuVisible(false);
                openModal("delete");
              }}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer"
            >
              <i className="fa-solid fa-trash mr-2"></i> 삭제
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
