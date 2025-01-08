/* eslint-disable react/prop-types */
import axiosInstance from "../../../utils/axiosInstance";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/AuthStore";
// import { Lock, Reply, User, Send, ThumbsUp } from "lucide-react";
// import { ThumbsUp, Download, Box } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import {
  BOARD_VIEW_URI,
} from "../../../api/_URI";
import BoardComment from "./boardComment";
import BoardFileDownload from "./boardFileDownload";
import { toast } from 'react-toastify';
import { updateBoardApi, deleteBoardApi, uploadBoardFile } from "@/api/boardAPI";
// import { uploadBoardFile } from "../../../api/boardAPI";

export default function BoardView() {
  // URL 파라미터와 네비게이션 설정
  const { id } = useParams(); // URL 파라미터로 받은 게시글 ID
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  console.log("사용자 정보 (user.uid) :", user.uid);
  console.log("사용자 정보 (user) :", user);


  const formatDate = (dateValue) => {
    // dateValue가 없으면 빈 문자열 반환
    if (!dateValue) return '';

    try {
      // 날짜 문자열이면 new Date()로 변환
      if (typeof dateValue === 'string') {
        return new Date(dateValue).toLocaleDateString('ko-KR');
      }

      // 배열이면 배열 요소 사용
      if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        return `${year}년 ${month}월 ${day}일`;
      }

      // Date 객체면 바로 변환
      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString('ko-KR');
      }

      return '날짜 형식 오류';

    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '날짜 형식 오류';
    }
  };

  // 업로드된 파일 목록 상태 초기화
  const [fileList, setFileList] = useState([]);
  console.log("업로드된 파일 목록:", fileList);

  // 수정 모드와 로딩 상태 관리
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 수정할 게시글 데이터 상태 관리
  const [updateBoard, setUpdateBoard] = useState({
    id: "",
    title: "",
    content: "",
    attachedFiles: null,
    regDate: "",
  });

  // 게시글 기본 데이터 상태 관리
  const [board, setBoard] = useState({
    id: "",
    title: "",
    writer: "",
    writerName: "",
    regDate: "",
    hit: 0,
    content: "",
    // attachedFiles: null,
    attachedFiles: [], // 빈 배열로 초기화
  });
  // ------------------------------------------------------------------------------------------------------------------- 

  // 좋아요 관련 상태
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchBoardData = async () => {
      console.log("안녕 게시글 데이터");
      console.log("게시글 데이터 전체:", board);

      console.log("사용자 ID : ", user.id);
      console.log("게시글 Writer : ", board.writer);

      console.log("게시글 writerName :", board.writerName);  // writerName이 무엇인지 확인
      // fetchBoardData 함수 내부에 추가

      if (!id) {
        console.warn("게시글 ID가 없습니다.");
        return;
      }

      try {
        // 게시글 데이터 조회
        const response = await axiosInstance.get(`${BOARD_VIEW_URI}/${id}`);
        console.log("서버 응답 데이터:", response.data);

        // 날짜 데이터 확인
        if (response.data.regDate) {
          console.log("날짜 형식:", response.data.regDate);
        }

        // 게시글 데이터 설정 전에 날짜 형식 변환
        // const formattedData = {
        //   ...response.data,
        //   regDate: response.data.regDate ? new Date(response.data.regDate) : new Date()
        // };

        // 게시글 데이터 설정
        setBoard(response.data);
        // setBoard(formattedData);

        // 수정 폼 초기값 설정
        setUpdateBoard({
          id: response.data.id,
          title: response.data.title,
          content: response.data.content,
          attachedFiles: response.data.attachedFiles,
          regDate: response.data.regDate,
        });

        console.log("수정 폼 초기값 전체", response.data);
        console.log("날짜 > ", response.data.regDate);




        // 좋아요 상태 설정
        setLikes(response.data.likes || 0);
        setIsLiked(response.data.isLiked || false);

        // 파일 목록 별도 조회
        const fileResponse = await axiosInstance.get(`${BOARD_VIEW_URI}/${id}/files`);

        if (fileResponse.data) {
          setFileList(fileResponse.data);
          console.log("파일 데이터:", fileResponse.data);
        }


      } catch (error) {
        console.error("게시글 데이터 로딩 실패:", error);
        toast.error("게시글을 불러오는데 실패했습니다.");
      }

    };

    fetchBoardData();

  }, [id]);

  // ------------------------------------------------------------------------------------------------------------------- 


  // 좋아요 처리 함수
  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axiosInstance.post(`${BOARD_VIEW_URI}/${id}/like`);

      if (response.data.success) {
        setLikes(response.data.likeCount);
        setIsLiked(response.data.liked);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };
  // ------------------------------------------------------------------------------------------------------------------- 

  // 게시글 수정 처리 함수 (수정 후 저장 클릭 -> 실행)
  const handleUpdate = async () => {
    console.log("게시글 수정 처리 요청");
    console.log("게시글 데이터 전체:", board);

    console.log("사용자 ID : ", user.id);
    console.log("게시글 Writer : ", board.writer);

    console.log("게시글 writerName :", board.writerName);  // writerName이 무엇인지 확인


    // 사용자 권한 확인
    if (Number(user.id) !== Number(board.writer)) {
      console.error("수정 권한 없음: user.id와 board.writer가 다릅니다.");
      alert("수정 권한이 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      // 수정할 데이터 준비
      const formData = new FormData();
      formData.append("id", updateBoard.id);
      formData.append("title", updateBoard.title);
      formData.append("content", updateBoard.content);

      if (updateBoard.attachedFiles) {
        Array.from(updateBoard.attachedFiles).forEach((file) => {
          formData.append("files", file);
        });
      }
      if (updateBoard.attachedFiles) {
        formData.append("boardId", updateBoard.id);
        formData.append("writerId", updateBoard.writerId);
        formData.append("boardFile", updateBoard.file);
        await uploadBoardFile(formData); // 파일 업로드 함수 호출
      }
      const response = await updateBoardApi(user.id, formData); // 기존 updateBoardApi 호출 방식에서 파라미터 수정
      if (response) {
        setBoard((prevBoard) => ({
          ...prevBoard,
          title: updateBoard.title,
          writerName: board.writerName,
          content: updateBoard.content,
          updatedAt: new Date().toISOString(),
          cate1: updateBoard.cate1,
          cate2: updateBoard.cate2,
        }));
        setIsUpdate(false);
        alert("수정이 완료되었습니다 ❗️");
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------------------------------------------------- 

  // 게시글 삭제 처리 함수
  const handleDelete = async () => {
    if (!user || Number(user.id) !== Number(board.writer)) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까❓❓❓")) return;

    setIsLoading(true);
    try {
      const isDeleted = await deleteBoardApi(id);

      if (isDeleted) {
        alert("삭제되었습니다 ❗️❗️❗️");
        navigate("/antwork/board/list");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("❌❌❌ 삭제 중 오류가 발생했습니다. ❌❌❌");
    } finally {
      setIsLoading(false);
    }
  };
  // ------------------------------------------------------------------------------------------------------------------- 

  return (
    <article className="page-list">
      <section className="h-auto">
        {/* 게시글 헤더 */}
        <div className="border-gray-200">

          <div className="">
            <div className="mb-4">
              {/* 카테고리 */}
              <div className="text-sm text-gray-600 mr-2 mb-1">
                {/* {board.cate1} &gt; {board.cate2} */}
                커뮤니티 &gt; 자유게시판
              </div>

              {/* 제목 영역 */}
              {isUpdate ? (
                // 수정 모드 - 제목
                <input
                  type="text"
                  value={updateBoard.title}
                  onChange={(e) =>
                    setUpdateBoard({ ...updateBoard, title: e.target.value })
                  }
                  className="w-full p-2 text-2xl font-bold border rounded"
                  disabled={isLoading}
                />
              ) : (
                // 보기 모드 - 제목
                <h1 className="text-2xl font-bold text-gray-800">
                  {board.title}
                </h1>
              )}
            </div>

            {/* 작성자 정보 */}
            {/* <div className="text-right text-[14px] text-gray-500 flex items-center mt-4">
              <div className="writer">
                <strong>작성자&nbsp;:&nbsp;&nbsp;</strong>

                {
                  board.writerName
                    ? board.writerName // 게시글 작성자가 있으면 표시
                    : user?.name || "익명" // 없으면 로그인한 사용자의 이름, 그것도 없으면 '익명'
                }
                <span className="mx-2 text-slate-300 !text-[10px]">&#124;</span>
              </div> */}

              {/* 작성자 정보 영역 - 제목 아래로 이동 */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 pb-4">
                <div className="writer">
                  <span>작성자: </span>
                  <span className="font-medium">
                    {board.writerName
                      ? board.writerName
                      : user?.name || "익명"}
                  </span>
                </div>


              {/* 작성일: 날짜 yyyy-mm-dd */}
              <div className="date">
                <strong>작성일&nbsp;:&nbsp;&nbsp;</strong>
                {board.regDate ? 
                  `${board.regDate[0]}-${board.regDate[1]}-${board.regDate[2]}` : 
                  ''}
                <span className="mx-2 text-slate-300 !text-[10px]">&#124;</span>
              </div>

              {/* 조회수 */}
              <div className="hit">
                <strong>조회수&nbsp;:&nbsp;&nbsp;</strong>
                {board.hit}
              </div>
            </div>

            {/* 좋아요 버튼 */}
            {!isUpdate && (
              <button
                onClick={handleLike}
                disabled={isLoading}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md
                  transition-all duration-200 mb-4
                  ${isLiked
                    ? "bg-blue-100 hover:bg-blue-200 text-blue-600"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <ThumbsUp
                  size={16}
                  className={`${isLiked ? "fill-blue-600" : ""}`}
                />
                <span className="ml-1">좋아요 {likes}</span>
              </button>
            )}
          </div>
        </div>

        {/* 게시글 본문 */}
        <div className="pt-6 pb-12 border-t border-slate-200">

          {/* 파일 다운로드 컴포넌트  */}
          <BoardFileDownload files={fileList} />

          <div className="flex  items-start">
            {isUpdate ? (
              // 수정 모드 - 본문
              <div className="w-full">
                <textarea
                  value={updateBoard.content}
                  onChange={(e) =>
                    setUpdateBoard({ ...updateBoard, content: e.target.value })
                  }
                  className="w-full p-2 border rounded min-h-[300px]"
                  rows="15"
                  disabled={isLoading}
                />

                {/* 수정 시 - 파일 선택 */}
                <div className="mt-4">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setUpdateBoard({ ...updateBoard, attachedFiles: files });
                    }}
                    className="mt-2"
                    disabled={isLoading}
                  />
                </div>


              </div>
            ) : (
              // 보기 모드 - 본문
              <div className="prose max-w-[calc(100%-120px)]">
                {board.content &&
                  board.content
                    .split("\n")
                    .map((line, index) => <p key={index}>{line}</p>)}
              </div>
            )}
          </div>
        </div>

        {/* 댓글 영역 comment */}
        <BoardComment boardId={id} />

        {/* 버튼 영역 */}
        <div className="p-4 bg-gray-100 flex justify-between">

          <Link
            to="/antwork/board/list"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            목록으로
          </Link>

          {user && user.id == board.writer && (
            <div className="space-x-2">
              {isUpdate ? (
                <>
                  {/* 수정 버튼 클릭 시 (사용자에게 보여지는 버튼) */}
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    {isLoading ? "저장 중..." : "저장"}
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("수정을 취소하시겠습니까?")) {
                        setIsUpdate(false);
                        setUpdateBoard({
                          title: board.title,
                          content: board.content,
                          attachedFiles: board.attachedFiles,
                        });
                      }
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    취소
                  </button>

                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsUpdate(true)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    {isLoading ? "삭제 중..." : "삭제"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}

export { BoardView };
