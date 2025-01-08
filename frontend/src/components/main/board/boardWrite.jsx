/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BoardFileUpload from "./boardFileUpload";
import { postBoard, uploadBoardFile } from "../../../api/boardAPI";
// import { BOARD_LIST_URI } from "../../../api/_URI";
import useAuthStore from "../../../store/AuthStore";

{
  /*
      날짜 : 2024/11/27(수)
      생성자 : 김민희
      내용 : BoardView.jsx - 게시판 글보기 페이지 화면구현
  
      수정 내역 : 
      - 2024/12/03(화) 김민희 - 1차 개발 글쓰기 완료
      - 2024/12/10(화) 김민희 - submitHandler 수정 : 파일 업로드를 위해 FormData 생성
      - 2024/12/23(월) 김민희 - 카테고리 삭제
    */
}

export default function BoardWrite() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user); // 로그인한 사용자 정보
  console.log("사용자 정보 (현재 글쓴이):", user.uid);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [board, setBoard] = useState({
    writerId: "",
    title: "",
    file: null,
    content: "",
  });

  // 컴포넌트 시작시 로그인 체크
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
  }, [user, navigate]);


  const changeHandler = (e) => {
    e.preventDefault();
    setBoard({ ...board, [e.target.name]: e.target.value });
  };

  // 글 쓰기 
  const submitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 유효성 검사
      if (!board.title.trim()) {
        alert("제목을 입력해주세요.");
        return;
      }
      if (!board.content.trim()) {
        alert("내용을 입력해주세요.");
        return;
      }

      console.log("게시글 데이터 전체 (boardWrite):", board);

      // **1. 게시글 데이터 전송 (JSON)**
      const boardInfo = {

        categoryId: 1,
        writerId: user?.id || "guest",
        writerName: user?.name,
        title: board.title.trim(),
        content: board.content.trim(),

      };
      console.log("***boardInfo :", boardInfo);
      const savedBoardId = await postBoard(boardInfo); // `/write` 엔드포인트 호출
      console.log("게시글 저장 완료 -> savedBoardId:", savedBoardId);

      // **2. 파일 업로드 (FormData)**
      if (board.file) {
        const formData = new FormData();

        // uploadRequest 객체를 FormData에 추가 (JSON으로 변환)
        const uploadRequest = {
          boardId: savedBoardId,
          writerId: user?.id || "guest",
        };
        formData.append(
          "uploadRequest",
          new Blob([JSON.stringify(uploadRequest)], { type: "application/json" })
        );

        // 실제 파일 추가
        formData.append("file", board.file);

        console.log("파일 업로드 준비된 FormData:", formData);

        // 파일 업로드 API 호출
        await uploadBoardFile(formData); // `/upload` 엔드포인트 호출
        console.log("파일 업로드 성공");
      }

      alert("글 작성이 완료되었습니다❗️");
      navigate("/antwork/board/list"); // 게시판 리스트로 이동
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("글 작성 또는 파일 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
      <article className="page-list">
        <div className="content-header">
          <h1>새 글 작성</h1>
        </div>
        <form onSubmit={submitHandler} id="myForm" className="space-y-4">
          <table className="w-full h-56 min-h-[300px] border-t-2 border-gray-300 border-collapse">
            <tbody>

              <tr className="border-b border-gray-300">
                <td className="w-20 p-3 text-lg font-bold text-left">작성자</td>
                <td className="w-[780px]">
                  <div className="">{user?.name || ""}</div>
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3 text-lg font-bold text-left">제목</td>
                <td>
                  <input
                    type="text"
                    name="title"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 
                        focus:outline-none focus:ring focus:ring-slate-300 resize-none"
                    placeholder="제목을 입력합니다."
                    required
                    value={board.title}
                    onChange={changeHandler}
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3 text-lg font-bold text-left">파일 첨부</td>
                <td>
                  <BoardFileUpload
                    onFileSelect={(file) => {
                      setBoard({ ...board, file: file }); // 선택된 파일을 부모 컴포넌트의 상태에 저장
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 text-lg font-bold text-left">내용</td>
                <td>
                  <textarea
                    name="content"
                    id="writeContent"
                    className="border border-slate-300 w-full h-96 text-base px-3 py-2 resize-none rounded-md"
                    placeholder="내용을 입력해주세요."
                    required
                    value={board.content}
                    onChange={changeHandler}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center space-x-4">
            <Link
              to="/board"
              className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer box-border"
            >
              취소
            </Link>
            <button
              type="submit"
              id="btnSubmit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 cursor-pointer box-border"
            >
              작성하기
            </button>
          </div>
        </form>
      </article>
    </>
  );
}
export { BoardWrite };
