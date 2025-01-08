/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

{
    /*
        날짜 : 2024/12/05(목)
        생성자 : 김민희
        내용 : BoardPagination.jsx - 게시판 글보기 페이지네이션 화면구현 컴포넌트화 
    
        수정 내역 : 
        - 2024/12/05(목) 김민희 - 페이지 번호 클릭 시 해당 페이지로 이동
    
      */
}


export default function BoardPagination({ currentPage, totalPages, totalElements, onPageChange }) {
// 1. 상태 관리
const [isLoading, setIsLoading] = useState(false);
    
// 2. 페이지 번호 계산
const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    const effectiveTotalPages = Math.max(1, totalPages);

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + maxVisible - 1, effectiveTotalPages);

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
    }

    return pageNumbers;
};

// 3. 페이지 변경 처리
const handlePageChange = (pageNumber) => {
    const validatedPage = Math.min(Math.max(1, pageNumber), totalPages);
    setIsLoading(true);
    
    try {
        onPageChange(validatedPage);
    } finally {
        setIsLoading(false);
    }
};

    return (
        <>
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow">
                {/* <p className="mb-4 text-gray-600">현재 페이지: {currentPage}</p>
                    <p className="mb-4 text-gray-600">
                    {totalElements > 0
                        ? `전체 ${totalElements}개 중 ${currentPage} 페이지`
                        : "게시물이 없습니다"}
                </p> */}

                <div className="flex items-center justify-center space-x-1">
                    {/* 첫 페이지로 */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1 || isLoading}
                        className={`w-10 h-10 mx-1 border rounded-md flex items-center justify-center transition-colors duration-200
                        ${(currentPage === 1 || isLoading)
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}
                    >
                        &lt;&lt;
                    </button>

                    {/* 이전 페이지 */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className={`w-10 h-10 mx-1 border rounded-md flex items-center justify-center transition-colors duration-200
                        ${(currentPage === 1 || isLoading)
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}
                    >
                        &lt;
                    </button>

                    {/* 페이지 숫자들 */}
                    {getPageNumbers().map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            disabled={isLoading}
                            className={`w-10 h-10 mx-1 border rounded-md flex items-center justify-center transition-colors duration-200
                            ${currentPage === number
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}
                        >
                            {number}
                        </button>
                    ))}

                    {/* 다음 페이지 */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isLoading}
                        className={`w-10 h-10 mx-1 border rounded-md flex items-center justify-center transition-colors duration-200
                        ${(currentPage === totalPages || isLoading)
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}
                    >
                        &gt;
                    </button>

                    {/* 마지막 페이지로 */}
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages || isLoading}
                        className={`w-10 h-10 mx-1 border rounded-md flex items-center justify-center transition-colors duration-200
                        ${(currentPage === totalPages || isLoading)
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}
                    >
                        &gt;&gt;
                    </button>

                    {/* 로딩 상태 표시 */}
                    {/* {isLoading && <span className="ml-2 text-gray-500">로딩중...</span>} */}
                </div>


            </div>
        </>
    );
};

