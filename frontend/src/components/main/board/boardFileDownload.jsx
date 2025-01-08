/* eslint-disable react/prop-types */
// import { useState, useEffect } from 'react';
import { Download, Box } from 'lucide-react';
import axiosInstance from "../../../utils/axiosInstance";
// import { useParams } from "react-router-dom";

{
/*
날짜 : 2024/12/10(화)
생성자 : 김민희
내용 : BoardFileUpload.jsx - 게시글 상세 보기 - 첨부파일 다운로드 컴포넌트

주요기능:
    1. 첨부파일 목록 표시
    2. 파일 다운로드 기능
    3. 파일 크기 포맷팅 

*/
}

// 파일 크기 상수 정의
const LARGE_FILE_SIZE = 100 * 1024 * 1024; // 100MB를 바이트로 변환


const AttachmentItem = ({ file }) => (
<div className="flex items-center justify-between bg-gray-50 p-3 rounded">
<div className="flex items-center gap-2">
    <Box className="w-4 h-4 text-gray-500" />
    <span>{file.name}</span>
    <span className="text-sm text-gray-500">({file.size})</span>
</div>
<button className="p-1 hover:bg-gray-200 rounded">
    <Download className="w-4 h-4" />
</button>
</div>
);


export default function BoardFileDownload({ files }) {


    // 파일 크기를 보기 좋게 변환하는 함수 (예: 1024 bytes -> 1KB)
    const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];

    };


    // 대용량 파일이 하나라도 있는지 확인하는 함수
    const hasLargeFiles = files?.some(file => file.boardFileSize >= LARGE_FILE_SIZE);

    // 파일 다운로드 처리 함수
    const handleDownload = async (boardFileId, fileName) => {
        try {
            // 파일 다운로드 요청 (서버에서 파일 데이터를 Blob으로 받음)
            const response = await axiosInstance.get(`/board/files/download/${boardFileId}`, {
                responseType: 'blob' // 응답을 blob 형태로 받음 (기서 응답을 Blob으로 받도록 지정)
            });
            
            // Blob URL 생성 및 다운로드 링크 생성
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            
            // 다운로드 트리거
            document.body.appendChild(link);
            link.click();
            
            // 메모리 정리
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        }
    };



    return (

        <>
            {/* 첨부파일이 있는 경우에만 컴포넌트 표시 */}
            {files && files.length > 0 && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold mb-2">첨부파일</h3>
                    <div className="space-y-2">
                        {/* 파일 목록 매핑 */}
                        {files.map((file) => (
                            <div key={file.boardFileId} 
                                className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                {/* 파일 정보 표시 영역 */}
                                <div className="flex items-center gap-2">
                                    <Box className="w-4 h-4 text-gray-500" />
                                    <span>{file.boardFileOName}</span>
                                    <span className="text-sm text-gray-500">
                                        ({formatFileSize(file.boardFileSize)})
                                    </span>
                                    {/* 대용량 파일 표시 */}
                                    {file.boardFileSize >= LARGE_FILE_SIZE && (
                                        <span className="text-xs text-orange-500 font-medium">
                                            대용량
                                        </span>
                                    )}
                                </div>
                                {/* 다운로드 버튼 */}
                                <button 
                                    onClick={() => handleDownload(file.boardFileId, file.boardFileOName)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* 안내 메시지 */}
                    {hasLargeFiles && (
                        <div className="text-sm text-gray-500 mt-2">
                            대용량 첨부파일은 30일 보관 / 100회 다운로드 가능
                        </div>
                    )}
                </div>
            )}
        </>
    );
    }

export { BoardFileDownload };