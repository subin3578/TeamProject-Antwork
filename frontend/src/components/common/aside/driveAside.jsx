import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DriveModal from "../modal/driveModal";
import useModalStore from "../../../store/modalStore";
import useAuthStore from "@/store/AuthStore";
import {
  MyDriveSelectView,
  MyDriveView,
  selectDriveAllSize,
  ShareDriveView,
} from "@/api/driveAPI";
import { size } from "lodash";

export default function DriveAside({ asideVisible, refreshUsage }) {
  // 모달 상태 관리를 위한 useState 추가
  const openModal = useModalStore((state) => state.openModal);

  const [folderStates, setFolderStates] = useState([]);
  const [shareFolderStates, setShareFolderStates] = useState([]);
  const [fileStates, setFileStates] = useState([]);

  const [size, setSize] = useState(0); // 현재 사용량
  const [limit, setLimit] = useState(0); // 총 용량

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기


  const [isMyOpen, setIsMyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const fetchFolderData = async (driveFolderId) => {
    // 로딩 시작
    const uid = user.uid;
    const userId = user.id;
    try {
      let response;
      let response1;
      // driveFolderId가 있으면 상세 정보 요청, 없으면 목록 정보 요청
      if (driveFolderId) {
        response = await MyDriveSelectView(driveFolderId); // 상세 정보 API 호출
        console.log("선택된 폴더:", response.data);
      } else {
        console.log("일로 들어가니?");
        response = await MyDriveView(uid); // 목록 정보 API 호출

        response1 = await ShareDriveView(userId);
        console.log("폴더+파일 목록 데이터:", response.data);
      }

      // API 응답 구조에 맞게 데이터 추출
      const folders = Array.isArray(response.data.folders)
        ? response.data.folders
        : [];
      const shareFolers = Array.isArray(response1.data.folders)
        ? response1.data.folders
        : [];
      const files = Array.isArray(response.data.files)
        ? response.data.files
        : [];

      console.log("폴더 데이터 매핑:", folders);
      setFolderStates(
        folders.map((folder) => ({
          isChecked: folder.isChecked || false,
          isStarred: folder.isStarred || false,
          driveFolderName: folder.driveFolderName,
          driveFolderSize: folder.driveFolderSize,
          driveFolderCreatedAt: folder.driveFolderCreatedAt,
          driveFolderMaker: folder.driveFolderMaker,
          driveFolderId: folder.driveFolderId,
          driveParentFolderId: folder.driveParentFolderId,
          driveParentFolderName: folder.parentFolderName,
          driveShareType: folder.driveFolderShareType,
        }))
      );
      setShareFolderStates(
        shareFolers.map((folder) => ({
          isChecked: folder.isChecked || false,
          isStarred: folder.isStarred || false,
          driveFolderName: folder.driveFolderName,
          driveFolderSize: folder.driveFolderSize,
          driveFolderCreatedAt: folder.driveFolderCreatedAt,
          driveFolderMaker: folder.driveFolderMaker,
          driveFolderId: folder.driveFolderId,
          driveParentFolderId: folder.driveParentFolderId,
          driveParentFolderName: folder.parentFolderName,
          driveShareType: folder.driveFolderShareType,
        }))
      );

      setFileStates(
        files.map((file) => ({
          isChecked: file.isChecked || false,
          isStarred: file.isStarred || false,
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
          driveFileCreatedAt: file.driveFileCreatedAt,
          driveFileId: file.driveFileId,
        }))
      );
    } catch (err) {
      console.error("폴더 데이터를 가져오는 중 오류 발생:", err);
    }
  };
  const fileAllSize = async () => {
    console.log("여기로 들어와?");
    const rate = user?.companyRate; // 무료/유료
    console.log("rate 값이 얼마임? : " + rate);
    const uid = user.uid;
    try {
      const response = await selectDriveAllSize(uid,rate);
      console.log("총 파일 크기:", response.data);

      // 서버에서 받아온 데이터를 상태로 설정
      const fileSize = response.data.driveFileSize; // 바이트로 전달
      const fileLimitSize = response.data.driveFileLimitSize; // 바이트로 전달

      // 상태 업데이트: 바이트 값 그대로 유지
      setSize(fileSize); // 사용량 (bytes)
      setLimit(fileLimitSize); // 총 용량 (bytes)
    } catch (error) {
      console.error("fileAllSize 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchFolderData();
    fileAllSize(); // driveFolderId가 변경될 때마다 데이터 로드
  }, []);

  // `refreshUsage`에 `fileAllSize` 함수 전달
  useEffect(() => {
    if (refreshUsage) {
      refreshUsage.current = fileAllSize;
    }
  }, [refreshUsage]);

  const HorizontalBar = ({ usedSpace, totalSpace }) => {
    const [percentage, setPercentage] = useState(0);
    const [usedSpaceDisplay, setUsedSpaceDisplay] = useState(""); // 표시용 사용량
    const [totalSpaceDisplay, setTotalSpaceDisplay] = useState(""); // 표시용 총 용량

    useEffect(() => {
      if (totalSpace > 0) {
        // 퍼센트 계산 (바이트 기준으로 정확히 계산)
        const percentageValue = (usedSpace / totalSpace) * 100;
        setPercentage(percentageValue); // 계산된 퍼센트 값 설정

        // 사용량 단위 변환
        const usedSpaceInMB = usedSpace / 1024 ** 2; // 바이트 → MB
        const usedSpaceFormatted =
          usedSpaceInMB >= 1024
            ? `${(usedSpaceInMB / 1024).toFixed(2)} GB` // 1024MB 이상이면 GB
            : `${usedSpaceInMB.toFixed(2)} MB`; // MB 유지
        setUsedSpaceDisplay(usedSpaceFormatted);

        // 총 용량 단위 변환
        const totalSpaceInGB = totalSpace / 1024 ** 3; // 바이트 → GB
        const totalSpaceFormatted = `${totalSpaceInGB.toFixed(2)} GB`;
        setTotalSpaceDisplay(totalSpaceFormatted);
      }
    }, [usedSpace, totalSpace]);

    return (
      <div className="w-full max-w-xl mx-auto mt-6">
        {/* 배경 막대 */}
        <div className="flex mb-2 items-center justify-between">
          <span className="text-sm text-gray-600">{usedSpaceDisplay}</span>
          <span className="text-sm text-gray-600">{totalSpaceDisplay}</span>
        </div>

        <div className="w-full bg-gray-300 rounded-full h-4">
          {/* 실제 사용된 용량을 표시하는 막대 */}
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* 퍼센트 표시 */}
        <div className="text-center text-sm mt-2 font-semibold">
          {percentage.toFixed(2)}% 사용 중 {/* 소수점 6자리까지 표시 */}
        </div>
      </div>
    );
  };

  return (
    <>
      <aside className={`sidebar ${!asideVisible ? "hidden" : ""} table-cell`}>
        <div className="logo !border-b-0">
          <span className="sub-title">My Drives</span>

          <span className="title">DRIVE</span>
          <button
            onClick={() => openModal("insert")}
            className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 mt-6 h-14"
            style={{ backgroundColor: "#D9E8FF" }}
          >
            <svg
              className="w-6 h-6"
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
            <span className="text-xl">New Folder</span>
          </button>
        </div>
        <DriveModal />
        <ul className="a mt-20">
          <li className="">
            <div className="flex items-center border-b border-[#d9d9d9] mb-[10px]">
              <span
                className="m-[3px] cursor-pointer"
                onClick={() => setIsMyOpen(!isMyOpen)}
              >
                <img
                  src={
                    isMyOpen
                      ? "/images/Antwork/main/drive/위화살표.png"
                      : "/images/Antwork/main/drive/아래화살표.png"
                  }
                  alt="화살표 아이콘"
                  className="w-4 h-4"
                />
              </span>
              <Link
                to="/antwork/drive"
                href="#"
                className="w-[195px] h-[40px] flex items-center"
              >
                <span className="main-cate">내 드라이브</span>
              </Link>
            </div>
            <div
              className={`Mydrive_List transition-all duration-300 overflow-hidden ${
                isMyOpen ? "max-h-screen" : "max-h-0"
              } pl-8`}
            >
              <ul>
                {folderStates.map((folder, index) => {
                  return (
                    <li key={`folder-${index}`}>
                      <a href="#">
                        <div className="flex items-start items-center mb-2">
                          <i className="fa-solid fa-folder text-[16px] text-[#FFC558]"></i>
                          <span className="ml-[10px]">
                            <Link
                              to={`/antwork/drive/folder/${folder.driveFolderId}`}
                            >
                              {folder.driveFolderName}
                            </Link>
                          </span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
          <li className="">
            <div className="flex items-center border-b border-[#d9d9d9] mb-[10px]">
              <span
                className="m-[3px] cursor-pointer"
                onClick={() => setIsShareOpen(!isShareOpen)}
              >
                <img
                  src={
                    isShareOpen
                      ? "/images/Antwork/main/drive/위화살표.png"
                      : "/images/Antwork/main/drive/아래화살표.png"
                  }
                  alt="화살표 아이콘"
                  className="w-4 h-4"
                />
              </span>
              <Link
                to="/antwork/drive/share"
                href="#"
                className="w-[195px] h-[40px] flex items-center"
              >
                <span className="main-cate">공유 드라이브</span>
              </Link>
            </div>
            <div
              className={`Mydrive_List transition-all duration-300 overflow-hidden ${
                isShareOpen ? "max-h-screen" : "max-h-0"
              } pl-8`}
            >
              <ul>
                {shareFolderStates.map((folder, index) => {
                  return (
                    <li key={`folder-${index}`}>
                      <a href="#">
                        <div className="flex items-start items-center mb-2">
                          <i className="fa-solid fa-folder-open text-[16px] text-[#6BBFFC]"></i>
                          <span className="ml-[10px]">
                            <Link
                              to={`/antwork/drive/share/folder/${folder.driveFolderId}`}
                            >
                              {folder.driveFolderName}
                            </Link>
                          </span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
          <li className="lnb-item mt-[10px]">
            <div className="lnb-header !mb-[10px]">
              {/* <img
                src="/images/ico/page_delete24_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              /> */}
              <i className="fa-solid fa-trash-can text-[14px] text-[#A4CDD4] ml-[2.5px]"></i>
              <Link
                to="/antwork/drive/recycle"
                className="main-cate !text-[13px] text-[#757575]"
              >
                휴지통
              </Link>
            </div>
            <div className="lnb-header !mb-[10px]">
              {/* <img
                src="/images/Antwork/main/drive/kid_star.png"
                className="cate-icon !w-[22px] !h-[22px]"
              /> */}
              <i className="fa-solid fa-star text-[14px] text-[#FFC558] ml-[1px]"></i>
              <Link
                to="/antwork/drive/asdf"
                className="main-cate !text-[13px] text-[#757575]"
              >
                즐겨찾기
              </Link>
            </div>
            <div className="lnb-header !mb-[10px]">
              {/* <img
                src="/images/ico/page_setting_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              /> */}
              <i className="fa-solid fa-gear text-[14px] text-[#919191] ml-[2px]"></i>

              <Link
                to="/antwork/setting/drive"
                className="main-cate !text-[13px] text-[#757575]"
              >
                설정
              </Link>
            </div>
          </li>
          <li className="lnb-item">
            <div className="lnb-header !mb-[10px] w-[180px]">
              <HorizontalBar usedSpace={size} totalSpace={limit} />
              <Link
                to="/antwork/drive/recycle"
                className="main-cate !text-[16px] text-[#757575]"
              ></Link>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
}
