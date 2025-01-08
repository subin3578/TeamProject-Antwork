/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import useModalStore from "../../../store/modalStore";
import AntWorkLayout from "@/layouts/AntWorkLayout";
import BoardList from "./boardList";
import BoardPagination from "./boardPagination";
import useAuthStore from "../../../store/AuthStore";
import axiosInstance from "../../../utils/axiosInstance";
import { BOARD_LIST_URI, BOARD_SEARCH_URI } from "../../../api/_URI";
{
  /*
    날짜 : 2024/11/25(월)
    생성자 : 김민희
    내용 : BoardMain.jsx - 게시판 메인 홈 페이지 화면구현 (인기급상승 게시물, 자료실 레이아웃)

    수정 내역 : 
    2024/12/13(금) - 김민희 : 게시판 화면 간격 안 맞는 거 수정
    2024/12/25(수) - 김민희 : 게시판 더미데이터 정리

  */
}

export default function BoardMain() {
  const openModal = useModalStore((state) => state.openModal);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title:
        "안녕하세요. 퇴사하겠습니다. 그럼 이만 총총총 헤헤헤 ^^ 글 잘리나 대표님 저 잘라주세요 글자도 잘라주세여",
      author: "김사원 ",
      date: "2024-11-27",
      views: 9697,
      likes: 1016,
      commentCount: 3,
    },
    {
      id: 2,
      title: "오늘 점심 메뉴 추천 해주세여 - 엽떡이었으면 좋겠다 크크크크크크",
      author: "황사원 ",
      date: "2024-11-27",
      views: 9697,
      likes: 1016,
      commentCount: 3,
    },
    {
      id: 3,
      title: "경고 메시지입니다 자유게시판이지만 너무 자유롭지 마십시오.",
      author: "최사원ᖳ ",
      date: "2024-11-27",
      views: 9697,
      likes: 1016,
      commentCount: 3,
    },
    {
      id: 4,
      title: "안녕하세요. 앤드워크에 관한 모든 비밀을 담은 자료입니다!",
      author: "정사원ᖳ ",
      date: "2024-11-27",
      views: 9697,
      likes: 1016,
      commentCount: 3,
    },
    {
      id: 5,
      title: "안녕하세요. 열람권한이 없는 게시물입니다.",
      author: "강사원ᖳ ",
      date: "2024-11-27",
      views: 9697,
      likes: 1016,
      commentCount: 3,
    },
    {
      id: 6,
      title: "성과면담 및 이의제기 안내",
      author: "하사원ᖳ ",
      date: "2024-11-27",
      views: 9697,
      likes: 1016,
      commentCount: 1000,
    },
  ]);
  // 파일 목록
  const [files, setFiles] = useState([
    { id: 1, name: "지출결의서(경조금지원).pdf", size: "12MB", type: "pdf", downloadUrl: "#" },
    { id: 2, name: "연차신청서.hwp", size: "10MB", type: "hwp", downloadUrl: "#" },
    { id: 3, name: "게시판 프로젝트 보고서.ppt", size: "1GB", type: "ppt", downloadUrl: "#" },
    { id: 4, name: "개발환경 설정 가이드.pdf", size: "8MB", type: "pdf", downloadUrl: "#" },
    // { id: 5, name: "코딩 컨벤션 문서.pdf", size: "5MB", type: "pdf", downloadUrl: "#" },
  ]);

  // 파일 삭제 함수
  const handleDelete = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };


  // const [weeklyMenu] = useState([
  //   { day: "월요일", date: "12/25", menu: "비빔밥 / 된장찌개 / 김치 / 멸치볶음" },
  //   { day: "화요일", date: "12/26", menu: "제육볶음 / 미역국 / 김치 / 계란말이" },
  //   { day: "수요일", date: "12/27", menu: "카레라이스 / 유부국 / 김치 / 단무지" },
  //   { day: "목요일", date: "12/28", menu: "돈까스 / 우동 / 김치 / 샐러드" },
  //   { day: "금요일", date: "12/29", menu: "불고기 / 콩나물국 / 김치 / 호박볶음" },
  // ]);

// --- 수정 2: 주간 메뉴 데이터 업데이트 ---
const [weeklyMenu] = useState([
  { 
    day: "목요일", 
    date: "12/26", 
    menu: {
      main: "소고기 미역국",
      side: ["흑미밥", "계란말이", "김치", "멸치볶음"],
      dessert: "티라미숙해 케이크"
    }
  },
  // { 
  //   day: "화요일", 
  //   date: "12/26", 
  //   menu: {
  //     main: "돈까스",
  //     side: ["백미밥", "우동", "김치", "샐러드"],
  //     dessert: "오렌지"
  //   }
  // },
  // { 
  //   day: "수요일", 
  //   date: "12/27", 
  //   menu: {
  //     main: "카레라이스",
  //     side: ["백미밥", "유부국", "김치", "단무지"],
  //     dessert: "푸딩"
  //   }
  // },
  // { 
  //   day: "목요일", 
  //   date: "12/28", 
  //   menu: {
  //     main: "갈비탕",
  //     side: ["백미밥", "도토리묵", "김치", "시금치나물"],
  //     dessert: "바나나"
  //   }
  // },
  // { 
  //   day: "금요일", 
  //   date: "12/29", 
  //   menu: {
  //     main: "불고기",
  //     side: ["흑미밥", "콩나물국", "김치", "호박볶음"],
  //     dessert: "수박"
  //   }
  // }
]);

// 파일 아이콘 컴포넌트
const FileIcon = ({ type }) => {
  switch(type) {
    case 'pdf':
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 18h12a2 2 0 002-2V6l-5-5H4a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      );
    case 'hwp':
      return (
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
        </svg>
      );
    case 'ppt':
      return (
        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
        </svg>
      );
  }
};


// 자료실 아이템 컴포넌트
const FileItem = ({ file, onDownload }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg">
        <FileIcon type={file.type} />
      </div>
      <div className="overflow-hidden">
        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
        <p className="text-xs text-gray-500">{file.size}</p>
      </div>
    </div>
    <button
      onClick={onDownload}
      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>
      <span className="text-sm">다운로드</span>
    </button>
  </div>
);

// 식단표 아이템 컴포넌트
const MenuItem = ({ item }) => (
  <div className="menu-item bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-100 transition-all duration-200">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-xl">
        <span className="text-blue-600 font-medium">{item.date.split('/')[1]}</span>
      </div>
      <div>
        <h4 className="font-medium">{item.day}</h4>
      </div>
    </div>
    <div className="ml-13 space-y-1.5">
      <p className="text-sm text-gray-900">{item.menu.main}</p>
      <div className="flex flex-wrap gap-1">
        {item.menu.side.map((side, idx) => (
          <span key={idx} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full">
            {side}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-500">후식: {item.menu.dessert}</p>
    </div>
  </div>
);
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

    const response = await axiosInstance.get(BOARD_SEARCH_URI, {
      params: {
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

    console.log("검색 응답 데이터:", response.data);

    if (response.data) {
      const totalElements = response.data.totalElements;
      const formattedBoards = response.data.content.map((board, index) => ({
        ...board,
        displayNumber: ((currentPage - 1) * pageSize + index),
        title: board.title,
        writerName: board.writerName,
        regDate: formatDate(board.regDate),
        hit: board.hit || 0,
        likes: board.likes || 0,
      }));

      setBoards(formattedBoards);
      setTotalBoards(response.data.totalElements);
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


// 스타일 태그 추가
// const StyleTag = () => (
//   <style jsx global>{`
//     ${scrollbarStyles}
    
//     .article-title {
//       padding: 0.5rem 1rem;
//       line-height: 1.5;
//     }
    
//     .article-content {
//       padding: 1rem;
//       line-height: 1.6;
//     }
    
//     .table-cell-ellipsis {
//       max-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }
//   `}</style>
// );

  return (
    <>

      <article className="page-list">
        <div className="content-header">
          <h1>게시판 홈</h1>
          <p className="!mb-5">게시판 메인 페이지 입니다.</p>

          {/* 게시판 홈(메인) 검색 */}

          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <select className="border border-gray-300 rounded py-2 px-2 mr-2 w-20 cursor-pointer">
                <option>제목</option>
                <option>내용</option>
                <option>작성자</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력해 주세요."
                className="border border-gray-300 rounded py-2 px-4 mr-2"
              />
              <button className="bg-slate-500 text-white py-2 px-4 rounded hover:bg-gray-400">
                검색
              </button>
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

          <section className="main_article flex">

            {/* 게시판 리스트 */}
            <article className="page-list mr-7 !min-h-[340px] h-[380px]">
                <div className="content-header">
                  <h1 className="!mb-3 ">🔥 인기 게시물</h1>
                  <p className="">여러분들의 많은 관심을 가진 게시글</p>
                </div>

                <div className="page-grid cursor-pointer h">
                  {/* 인기급상승 게시물  */}
                  <div className="page-card cursor-pointer">
                    <div className="card-content">
                      <div className="user-info">
                        {/* <img src="/api/placeholder/32/32" alt="profile" className="avatar bg-slate-500"/> */}
                        <div className="user-details w-[300px]">
                          <h3 className="!text-[15px] mb-2 truncate text-ellipsis whitespace-nowrap">
                            <span className="text-blue-500 !text-[15px]">[공지] </span>
                            2024 신입 개발자 멘토링 프로그램 참가자 모집
                          </h3>
                          <p className="!mt-3 !text-[12px] line-clamp-2">
                            안녕하세요, (주)AntWork 여러분
                            올해도 신입 개발자 멘토링 프로그램을 진행합니다.
                            시니어 개발자분들의 적극적인 참여 부탁드립니다.
                          </p>
                          <ul className="mt-4 flex gap-2">
                            <li className="article_create_date w-13 h-7 flex items-center gap-1.5 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/create_date.svg"
                                alt="create_at 작성일"
                              />
                              <span className="article_create_at w-13]">
                                {" "}
                                2024-12-20{" "}
                              </span>
                            </li>

                            <li className="article_view w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/eye.svg"
                                alt="eye views 조회수"
                              />
                              <span className="view_count"> 628 </span>
                            </li>

                            <li className="article_comment w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/comment.svg"
                                alt="comment 댓글수"
                              />
                              <span className="article_comment_count">
                                {" "}
                                23{" "}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* <button className="options-btn">⋮</button> */}
                    </div>
                  </div>
                  {/* 인기게시물 끝 */}

                  {/* 인기급상승 게시물  2*/}
                  <div className="page-card ">
                    <div className="card-content">
                      <div className="user-info">
                        {/* <img src="/api/placeholder/32/32" alt="profile" className="avatar bg-slate-500"/> */}
                        <div className="user-details w-[300px]">
                          <h3 className="!text-[15px] mb-2 truncate text-ellipsis whitespace-nowrap">
                            
                            <span className="text-blue-500 !text-[15px]">[기술공유] </span>
                            Spring Security 6.0 마이그레이션 가이드
                          </h3>
                          <p className="!mt-3 !text-[12px] line-clamp-2">
                          최근 진행한 Spring Security 6.0 마이그레이션 경험을 공유합니다.
                          주요 변경사항과 트러블슈팅 내용입니다.

                          1.WebSecurityConfigurerAdapter 대체 방안
                          2.SecurityFilterChain 구성 변경점
                          3.CORS 설정 변경 사항
                          4.OAuth2 인증 플로우 수정
                          5.테스트 코드 마이그레이션
                          자세한 내용은 첨부된 기술문서를 참고해주세요.
                          </p>
                          <ul className="mt-4 flex gap-2">
                            <li className="article_create_date w-13 h-7 flex items-center gap-1.5 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/create_date.svg"
                                alt="create_at 작성일"
                              />
                              <span className="article_create_at w-13]">
                                {" "}
                                2024-12-27{" "}
                              </span>
                            </li>

                            <li className="article_view w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/eye.svg"
                                alt="eye views 조회수"
                              />
                              <span className="view_count"> 196 </span>
                            </li>

                            <li className="article_comment w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/comment.svg"
                                alt="comment 댓글수"
                              />
                              <span className="article_comment_count">
                                {" "}
                                7{" "}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* <button className="options-btn">⋮</button> */}
                    </div>
                  </div>
                  {/* 인기게시물 끝 2*/}
                </div>

                
            </article>
            {/* 자료실 */}
            {/* <article className="page-list mr-7 !min-h-[340px] h-[380px] flex-1 min-w-[300px] bg-white rounded-2xl ">
              <div className="content-header border-b border-gray-100 pb-4">
                <h1 className="!mb-3">📚 자료실</h1>
                <p>자주 사용하는 문서 양식과 개발 가이드</p>
              </div>
              
              <div className="file-list space-y-3 mt-4 pr-2">
                {files.map((file) => (
                  <div key={file.id} 
                      className="file-item flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                        {file.type === 'pdf' && 
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 18h12a2 2 0 002-2V6.414A2 2 0 0017.414 5L13 .586A2 2 0 0011.586 0H4a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                          </svg>
                        }
                        {file.type === 'hwp' && 
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                          </svg>
                        }
                        {file.type === 'ppt' && 
                          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                          </svg>
                        }
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({file.size})</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open(file.downloadUrl, '_blank')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                    >
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            </article> */}
            <article className="page-list mr-7 !min-h-[340px] h-[380px] flex-1 min-w-[300px]">
              <div className="content-header border-b border-gray-100 pb-4">
                <h1 className="!mb-3">📚 자료실</h1>
                <p>자주 사용하는 문서 양식과 개발 가이드</p>
              </div>
              
              <div className="space-y-2 mt-4">
                {files.map((file) => (
                  
                  <div key={file.id} className="file-item flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg">
                        <FileIcon type={file.type} />
                      </div>
                      <div>
                        <p className="!text-[13px] text-gray-900">{file.name}</p>
                        <p className="!text-[10px] text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open(file.downloadUrl, '_blank')}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </article>


            {/* 주간 식단표 */}
            {/* <article className="page-list !min-h-[340px] h-[380px] flex-1 min-w-[300px] bg-white rounded-2xl">
              <div className="content-header border-b border-gray-100 pb-4">
                <h1 className="!mb-3">🍱 이번 주 식단표</h1>
                <p>구내식당 주간 메뉴</p>
              </div>
              
              <div className="menu-list mt-4 overflow-y-auto pr-2 max-h-[280px] custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                  {weeklyMenu.map((item, index) => (
                    <div key={index} className="relative overflow-hidden">
                      <div className="menu-item bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-lg text-sm font-medium">
                              {item.date.split('/')[1]}
                            </span>
                            <span className="ml-3 font-medium text-gray-900">{item.day}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            {item.date}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">메인</span>
                            <span className="text-sm text-gray-600">{item.menu.main}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">반찬</span>
                            <div className="flex flex-wrap gap-2">
                              {item.menu.side.map((side, sideIndex) => (
                                <span key={sideIndex} className="text-sm text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full">
                                  {side}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">후식</span>
                            <span className="text-sm text-gray-600">{item.menu.dessert}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article> */}
            <article className="page-list !min-h-[340px] h-[380px] flex-1 min-w-[300px] bg-white rounded-2xl shadow-md">
              <div className="content-header border-b border-gray-100 pb-4">
                <h1 className="!mb-3">🍱 이번 주 식단표</h1>
                <p>구내식당 주간 메뉴</p>
              </div>
              
              <div className="menu-list mt-4 overflow-y-auto pr-2 max-h-[280px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <div className="grid grid-cols-1 gap-4">
                  {weeklyMenu.map((item, index) => (
                    <div key={index} className="menu-card bg-white overflow-hidden">
                      {/* 요일 헤더 */}
                      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {item.date.split('/')[1]}
                          </div>
                          <span className="ml-3 font-medium">{item.day}</span>
                        </div>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      
                      {/* 메뉴 콘텐츠 */}
                      <div className="p-4">
                        {/* 메인 메뉴 */}
                        <div className="mb-3">
                          <div className="bg-yellow-50 rounded-lg p-3">
                            <span className="block text-xs text-yellow-700 mb-1">메인 메뉴</span>
                            <span className="text-sm font-medium text-gray-900">{item.menu.main}</span>
                          </div>
                        </div>
                        
                        {/* 반찬 */}
                        <div className="mb-3">
                          <span className="block text-xs text-gray-500 mb-2">반찬</span>
                          <div className="flex flex-wrap gap-2">
                            {item.menu.side.map((side, sideIndex) => (
                              <span 
                                key={sideIndex} 
                                className="inline-block bg-gray-100 rounded-lg px-3 py-1 text-sm text-gray-700"
                              >
                                {side}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* 후식 */}
                        <div className="bg-pink-50 rounded-lg p-2 inline-block">
                          <span className="text-sm text-pink-700">🍰 {item.menu.dessert}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            
          

          </section>
          
          {/* BoardList 컨테이너 */}
          {/* <section className="board-list-container mt-4">
            <article className="page-list">
              <AntWorkLayout>
                <BoardList />
              </AntWorkLayout>
            </article>
          </section> */}

    <article className="page-list">
      <div className="content-header mx-auto">
        <h1>🌈 자유게시판</h1>
        <p className="!mb-5">
          {/* 친애하는 Antwork 여러분 마음속 깊은 이야기를 자유롭게 공유해
          주십시오 ^^ ! */}
          Antwork 개발자 여러분, 모두 파이팅입니다! 🙌
        </p>
      </div>

      {/* 상단 버튼 및 통계 */}
      <section className="">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            <span>전체 게시 글: </span>
            <strong>{totalBoards.toLocaleString()} 개</strong>
          </div>


        </div>
        
      </section>

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

        
        </div>

        {/* 게시글 목록 테이블 */}

        <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal rounded-[10px] text-center">
          <tr>
            <th className="py-3 px-6 text-center whitespace-nowrap w-11">번호</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/2">제목</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/11">작성자</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/6">날짜</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/10">조회</th>
            <th className="py-3 px-6 text-center whitespace-nowrap w-1/10">좋아요</th>
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
                  <td className="py-3 px-6 text-center">
                    {board.displayNumber}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <Link to={`/antwork/board/view/${board.id}`} className="hover:text-blue-500">
                      {board.title
                        ? board.title.length > 30
                          ? `${board.title.slice(0, 30)}...`
                          : board.title
                        : "제목 없음"}
                      <span className="text-blue-500 ml-2">({board.comment || 0})</span>
                    </Link>
                  </td>

                  {/* 작성자 */}
                  <td className="py-3 px-6 text-center">
                    {board.writerName ? board.writerName : "익명"}  
                    {/* {board.writerName
                      ? board.writerName.length > 2
                        ? `${board.writerName.charAt(0)}${"*".repeat(
                            board.writerName.length - 2
                          )}${board.writerName.slice(-1)}`
                        : `${board.writerName.charAt(0)}*`
                      : "익명"} */}
                  </td>

                  <td className="py-3 px-6 text-center">
                    {board.regDate ? formatDate(board.regDate) : "날짜 없음"}
                  </td>
                  <td className="py-3 px-6 text-center">{board.hit || 0}</td>
                  <td className="py-3 px-6 text-center">❤️ {board.likes || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3 px-6 text-center">
                  {searchKeyword ? "검색 결과가 없습니다." : "게시글이 없습니다."}
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


        </div>
      </article>
      
      {/* 커스텀 스크롤바 스타일 */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cdcdcd;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </>
  );
}
export { BoardMain };
