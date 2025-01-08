/* eslint-disable react/prop-types */
import useToggle from "../../../hooks/useToggle";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoryModal from "../modal/CategoryModal";

import {
  BOARD_CATEGORY_ALL_URI,
  BOARD_CATEGORY_INSERT_URI,
} from "../../../api/_URI";
import axiosInstance from "@/utils/axiosInstance";

{
  /*
    날짜 : 2024/11/26(화)
    생성자 : 김민희
    내용 : boardAside.jsx - 카테고리 토글 메뉴 및 검색 추가

    수정 내역 : 
    2024/11/25 - 김민희 : 토글 메뉴 컴포넌트화를 위해 토글 메뉴 컴포넌트 분리
    2024/11/27 - 김민희 : write(글쓰기 아이콘), list(글목록) 링크 연결
    2024/12/25 - 김민희 : 카테고리 명 입력 시 aside에 바로 출력되도록 수정
  */
}

export default function BoardAside({ asideVisible }) {
  const [toggles, toggleSection] = useToggle({
    communityList: true,
    dataList: true,
  });
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);



  // 카테고리 추가
  const addCategory = async (categoryData) => {
    console.log("🔍 카테고리 추가 데이터:", categoryData);
    try {
      const categoryRequestData = {
        name: categoryData.name
      };
      
      const response = await axiosInstance.post(
        BOARD_CATEGORY_INSERT_URI,
        categoryRequestData
      );
      
      if (response.status === 200 || response.status === 201) {
        // 성공 시 사용자에게 알림
        alert(`📍 '${categoryData.name}' 카테고리가 성공적으로 추가되었습니다 !`);
        console.log("카테고리 추가 성공:", response.data);
        await fetchCategories();  // 목록 새로고침
        setCategoryModalOpen(false);  // 모달 닫기
        return true;
      }
    } catch (error) {
      // 실패 시 사용자에게 알림
      alert('카테고리 추가에 실패했습니다. 다시 시도해주세요.');
      console.error("카테고리 추가 실패:", error);
      console.log("에러 응답:", error.response?.data);
      return false;
    }
};

  // 카테고리 조회
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(BOARD_CATEGORY_ALL_URI);
      console.log("카테고리 목록 조회 결과:", response.data);  // 응답 데이터 구조 확인
      setCategories(response.data);
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <aside className={`sidebar ${!asideVisible ? "hidden" : ""} table-cell`}>
        <div className="logo !border-b-0">
          <span className="sub-title">Notice Board</span>
          <Link to="/antwork/board/write">
            <button
              className="image-button-css !bg-[url('/images/ico/page_write_22_999999.svg')] cursor-pointer display-block"
              aria-label="글쓰기(작성)"
            ></button>
          </Link>
          <span className="title">게시판</span>
        </div>
        <ul className="lnb inline-grid">
          <li className="lnb-item">
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_home_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px] cursor-pointer"
              />
              <Link
                to="/antwork/board"
                className="main-cate !text-[16px] cursor-pointer"
              >
                홈 바로가기
              </Link>

              <div className=""></div>
            </div>

            <div className="lnb-header !pb-[15px] border-b border-[#ddd]">
              <img
                src="/images/ico/page_search_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <span className="main-cate !text-[16px] ">검색</span>
            </div>
          </li>

          {/* 토글메뉴 > 메뉴 */}
          <li className="lnb-item !mt-[15px] !h-[auto] border-b border-[#ddd]">

            <div
              className="lnb-header cursor-pointer "
              onClick={() => {
                toggleSection("communityList");
              }}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex ">
                전사게시판{" "}
                <img
                  src={
                    toggles.communityList
                      ? "/images/ico/page_dropup_20_999999.svg" // 열렸을 때 이미지
                      : "/images/ico/page_dropdown_20_999999.svg" // 닫혔을 때 이미지
                  }
                  alt="toggle"
                />
              </span>
            </div>

            {/* 토글 메뉴 1 */}
            {toggles.communityList && (
              <ol>
                <li>
                  <Link to="/antwork/board/list">📑&nbsp;&nbsp;공지사항</Link>
                </li>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link to={`/antwork/board/list/${category.id}`}>
                        📑&nbsp;&nbsp;{category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="text-gray-500">등록된 카테고리가 없습니다.</span>
                  </li>
                )}
              </ol>
            )}
            
            {/* 부서게시판 22 */}
            <div
              className="lnb-header cursor-pointer mt-[20px] mb-[20px]"
              onClick={() => {
                toggleSection("communityList");
              }}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex ">
                부서게시판{" "}
                <img
                  src={
                    toggles.communityList
                      ? "/images/ico/page_dropup_20_999999.svg" // 열렸을 때 이미지
                      : "/images/ico/page_dropdown_20_999999.svg" // 닫혔을 때 이미지
                  }
                  alt="toggle"
                />
              </span>
            </div>

            {/* 토글 메뉴 22 */}
            {toggles.communityList && (
              <ol className="mb-[20px]">
                <li>
                  <Link to="/antwork/board/list">📑&nbsp;&nbsp;엔티티정의서</Link>
                </li>
                <li>
                  <Link to="/antwork/board/list">📑&nbsp;&nbsp;기술스택공유</Link>
                </li>
                <li>
                  <Link to="/antwork/board/list">📑&nbsp;&nbsp;코드정의서</Link>
                </li>
                <li>
                  <Link to="/antwork/board/list">📑&nbsp;&nbsp;ERD_실서버</Link>
                </li>

              </ol>
            )}

          </li>

          <li className="lnb-item">
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 mb-5 h-14"
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
              <span className="text-xl">게시판 추가</span>
            </button>
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_delete24_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link
                to="/antwork/board"
                className="main-cate !text-[16px] text-[#757575]"
              >
                휴지통
              </Link>
            </div>
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_setting_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link
                to="/antwork/board"
                className="main-cate !text-[16px] text-[#757575]"
              >
                설정
              </Link>
            </div>
          </li>
        </ul>
      </aside>
      {isCategoryModalOpen && (
        <CategoryModal
          onClose={() => setCategoryModalOpen(false)}
          onSubmit={addCategory}
        />
      )}
    </>
  );
}
