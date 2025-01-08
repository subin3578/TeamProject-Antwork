/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import BoardPagination from "./boardPagination";
import useAuthStore from "../../../store/AuthStore";
import axiosInstance from "../../../utils/axiosInstance";
import { BOARD_LIST_URI, BOARD_SEARCH_URI } from "../../../api/_URI";
// import { getBoardSearchResults } from "@/api/boardAPI";


{
  /*
    날짜 : 2024/11/27(수)
    생성자 : 김민희
    내용 : BoardList.jsx - 게시판 목록 페이지 화면구현

    수정 내역 : 
    2024/12/03(수) - 김민희 : 글 상세 조회를 위한 응답 데이터 처리 {id}
    2024/12/24(수) - 김민희 : 검색 기능 구현
    2024/12/25(수) - 김민희 : 카테고리별 업로드 기능 구현

  */
}

export default function BoardList({ onPageChange }) {
  // 사용자 인증 상태 가져오기
  const user = useAuthStore((state) => state.user);

  // 상태값 정의
  const { category } = useParams(); // URL 파라미터에서 category 가져오기
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름 상태

  const [boards, setBoards] = useState([]); // 게시글 목록
  const [searchType, setSearchType] = useState("title"); // 검색 타입
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [loading, setLoading] = useState(false); // 로딩 상태

  const [totalBoards, setTotalBoards] = useState(0); // 총 게시글 수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalElements, setTotalElements] = useState(0); // 전체 게시물 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [pageSize, setPageSize] = useState(10); // 페이지당 게시글 수

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

// 카테고리 이름을 가져오는 함수
useEffect(() => {
  const fetchCategoryName = async () => {
    try {
      const response = await axiosInstance.get(`/api/board/category/${category}`);
      setCategoryName(response.data.name); // 받아온 카테고리 이름 상태에 저장
    } catch (error) {
      console.error("카테고리 정보를 가져오는 데 실패했습니다.", error);
    }
  };
  fetchCategoryName();
}, [category]); // category가 변경될 때마다 카테고리 이름을 다시 가져옴


  // 게시글 목록을 가져오는 함수
  const fetchBoardList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(BOARD_LIST_URI, {
        params: {
          category: category,
          page: currentPage - 1,  // 페이지 번호 반영
          size: pageSize,
          type: searchType,
          keyword: searchKeyword,
        },
      });
      setBoards(response.data.content); // 게시글 목록 상태에 저장
      
      console.log("전체 게시글 응답:", response.data);
      
      if (response.data) {
        const totalElements = response.data.totalElements;
        const formattedBoards = response.data.content.map((board, index) => ({
          ...board,
          // 페이지별 번호 계산: 전체 게시글 수 - ((현재 페이지 번호-1) * 페이지 크기 + 현재 인덱스)
          // displayNumber: totalElements - ((currentPage - 1) * pageSize + index), // 최신글 37번
          // 최신글이 1번이 되도록 번호 계산
          displayNumber: ((currentPage - 1) * pageSize + index + 1),
          title: board.title,
          writerName: board.writerName,
          regDate: formatDate(board.regDate),
          hit: board.hit || 0,
          likes: board.likes || 0,
        }));

        setBoards(formattedBoards); //게시글 목록 상태를 저장
        setTotalBoards(response.data.totalElements); // 총 게시글 수 업데이트
        setTotalPages(response.data.totalPages); // 전체 페이지 수 업데이트
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }, [category, currentPage, searchType, searchKeyword, pageSize]);
 
// 검색 기능
const search123 = async () => {
  try {
    setLoading(true);
    if (!searchKeyword.trim()) {
      return fetchBoardList();
    }
    // 검색 요청 전
    console.log("검색 요청 파라미터:", {
      category,
      page: currentPage - 1,
      size: pageSize,
      type: searchType,
      keyword: searchKeyword,
    });

    const response = await axiosInstance.get(BOARD_SEARCH_URI, {
      params: {
        category: category,  
        page: currentPage - 1,  
        type: searchType,
        keyword: searchKeyword,
        size: pageSize,
      },
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-For': 'board-list',
      },
    });

    console.log("-------- 검색 응답 데이터 전체 구조 : --------", response.data);
    console.log("검색 결과 게시글 : ", response.data.content);

    if (response.data) {
      const totalElements = response.data.totalElements;
      const formattedBoards = response.data.content.map((board, index) => ({
        ...board,
        displayNumber: ((currentPage - 1) * pageSize + index + 1), 
        title: board.title,
        writerName: board.writerName,
        regDate: formatDate(board.regDate),
        hit: board.hit || 0,
        likes: board.likes || 0,
      }));

      setBoards(formattedBoards);
      setTotalBoards(response.data.totalElements);
      setTotalPages(response.data.totalPages);  
      setTotalElements(response.data.totalElements);
    }
  } catch (error) {
    console.error("검색 실패:", error);
    setBoards([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchBoardList();
}, [category, fetchBoardList]); // category가 바뀔 때마다 fetchBoardList 호출


  // 초기 로딩 및 검색 조건 변경 시 실행
  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);


  // 검색 초기화 핸들러
  const handleResetSearch = useCallback(() => {
    setSearchType("title");
    setSearchKeyword("");
    setCurrentPage(1); // 페이지를 1로 고정
    fetchBoardList(); // 올바른 데이터 호출 함수 사용
  }, [fetchBoardList]);

  // 페이지 데이터 처리
  const handlePageData = useCallback((newData) => {
    setBoards(newData);
    
  }, []);

   //  페이지 변경 시 데이터 가져오는 함수
   const fetchBoardData = async (page) => {
    try {
      const response = await axiosInstance.get(`/board/list?page=${page - 1}&size=10`);
      
      if (response.data && Array.isArray(response.data.content)) {
        const { content, totalElements, totalPages, number } = response.data;

        setBoards(content);
        setTotalElements(totalElements);
        setTotalPages(totalPages);
        setCurrentPage(number + 1); // 페이지 번호는 1부터 시작하므로 +1
      } else {
        throw new Error("데이터가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("[게시판 데이터 로드 실패]", error);
    }
  };

  useEffect(() => {
    fetchBoardData(currentPage);
  }, [currentPage]);

// 페이지 변경 처리를 위한 단일 함수
const handlePageChange = useCallback((page) => {
  setCurrentPage(page);
  fetchBoardList(); // 기존의 fetchBoardList 함수 재사용
}, [fetchBoardList]);

// 게시글 데이터 업데이트를 위한 콜백
const onBoardDataUpdate = useCallback((newBoards) => {
  setBoards(newBoards);
}, []);

  return (
    <article className="page-list">
      <div className="content-header mx-auto">
        <h1>자유게시판</h1>
        <p className="!mb-5">
          Antwork 개발자 여러분, 모두 파이팅입니다! 🙌
        </p>
      </div>

      {/* 게시글 검색 */}
      <section className="h-[800px] overflow-auto">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-gray-300 rounded py-2 px-2 mr-2 w-22 cursor-pointer"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="writerName">작성자</option>
            </select>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어를 입력해 주세요."
              className="border border-gray-300 rounded py-2 px-4 mr-2"
            />
            <div className="flex items-center cursor-pointer">
              <button
                onClick={() => search123()}
                className="bg-gray-500 cursor-pointer  py-2 px-4 rounded text-white mr-2"
                disabled={loading}
              >
                검색
              </button>
            </div>

            {searchKeyword && (
              <button
                onClick={() => handleResetSearch()}
                className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-500"
                disabled={loading}
              >
                초기화
              </button>
            )}
          </div>

          {/* 글쓰기 버튼 */}
          <div className="flex items-center">
            <Link to="/antwork/board/write">
              <button className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600">
                글쓰기
              </button>
            </Link>
          </div>

        </div>

        {/* 게시글 목록 테이블 */}

        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            <span>전체 게시 글: </span>
            <strong>{totalBoards.toLocaleString()} 개</strong>
          </div>

          <div className="text-gray-600">
            {/* <span>현재: </span> */}
            <strong className="text-blue-600">{currentPage}</strong>
            {/* &nbsp;/&nbsp; */}
            /
            <strong className="text-[11px] text-slate-700">{totalPages}</strong> 페이지
          </div>
        </div>


        <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal rounded-[10px] text-center">
          <tr>
            <th className="py-3 px-6 text-center whitespace-nowrap w-11">번호</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/2">제목</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/11">작성자</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/11">날짜</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/10">조회</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-3/10">좋아요</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/11">파일</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-3 px-6 text-center">
                  <div className="flex justify-center items-center py-4">
                    🔎 게시판 데이터를 불러오는 중...
                  </div>
                </td>
              </tr>
            ) : Array.isArray(boards) && boards.length > 0 ? (
              boards.map((board) => (
                <tr key={board.id} className="border-b border-gray-200 hover:bg-gray-100">
                  {/* 게시글 번호 */}
                  <td className="py-3 px-6 text-center">
                    {board.displayNumber}
                  </td>

                  {/* 제목과 댓글 수 */}
                  <td className="py-3 px-6 text-left">
                    <Link to={`/antwork/board/view/${board.id}`} className="hover:text-blue-500">
                      {board.title
                        ? board.title.length > 50
                          ? `${board.title.slice(0, 50)}...`
                          : board.title
                        : "제목 없음"}

                        {/* 댓글 수 */}
                      <span className="text-blue-500 ml-2">({board.comment || 0})</span>
                    </Link>
                  </td>

                  {/* 작성자 */}
                  <td className="py-3 px-6 text-center">
                    {board.writerName ? board.writerName : "익명"}  
                    {/* 익명게시판 ver */}
                    {/* {board.writerName
                      ? board.writerName.length > 2
                        ? `${board.writerName.charAt(0)}${"*".repeat(
                            board.writerName.length - 2
                          )}${board.writerName.slice(-1)}`
                        : `${board.writerName.charAt(0)}*`
                      : "익명"} */}
                  </td>
                  
                  {/* 작성일 */}
                  <td className="py-3 px-6 text-center">
                    {board.regDate ? formatDate(board.regDate) : "날짜 없음"}
                  </td>

                  {/* 조회수 */}
                  <td className="py-3 px-6 text-center">{board.hit || 0}</td>

                  {/* 좋아요 수 */}
                  <td className="py-3 px-6 text-center">❤️ {board.likes || 0}</td>

                  {/* 파일 */}
                  <td className="py-3 px-6 text-center">
                    {board.file ? (
                      <span>💾</span>  // 파일이 있으면 파일 아이콘
                    ) : (
                      <span>💾</span>  // 파일이 없으면 하이픈 표시
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3 px-6 text-center">
                  {searchKeyword ? "🔍 검색 결과가 없습니다.  " : "🔍 게시글이 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <BoardPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(page) => {
              setCurrentPage(page);
              fetchBoardList();
          }}
      />
      </section>
    </article>
  );
}

export { BoardList };