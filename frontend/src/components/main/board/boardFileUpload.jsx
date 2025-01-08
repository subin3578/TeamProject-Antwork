/* eslint-disable react/prop-types */
// import axiosInstance from "../../../utils/axiosInstance";
import { Upload , X } from 'lucide-react';
import { useState } from "react";

{
   /*
    날짜 : 2024/12/04(수)
    생성자 : 김민희
    내용 : BoardFileUpload.jsx - 글쓰기 파일 업로드 드래그 앤 드롭 화면구현

    수정 내역 : 
    2024/12/10(화) - 김민희 : 백엔드 연결 , 업로드 기능구현

  */
}

export default function BoardFileUpload({ onFileSelect }) {
    // 드래그 상태와 선택된 파일 상태 관리
    const [dragActive, setDragActive] = useState(false);  // 드래그 중인지 여부
    const [selectedFile, setSelectedFile] = useState(null);  // 선택된 파일 정보
    // const [isUploading, setIsUploading] = useState(false); // 업로드 상태
    
    // 파일 드래그 
    const handleDrag = (e) => {
        e.preventDefault();  // 브라우저 기본 동작 방지
        e.stopPropagation();  // 이벤트 버블링 방지
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);  // 파일이 드래그되어 들어오면 상태 변경
        } else if (e.type === "dragleave") {
            setDragActive(false);  // 드래그가 영역을 벗어나면 상태 변경
        }
    };

    // 파일 드롭 (onDrop)
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);  // 드래그 상태 해제
    
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {  // 드롭된 파일 확인
            const file = e.dataTransfer.files[0];  // 첫 번째 파일만 가져옴
            setSelectedFile(file);  // 파일 상태 업데이트
            onFileSelect(file);  // 부모 컴포넌트에 파일 정보 전달
            
        }
    };

    // 파일 선택 (onChange)
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {  // 선택된 파일이 있는지 확인
            const file = e.target.files[0];  // 첫 번째 파일만 선택
            setSelectedFile(file);  // 선택된 파일 상태 업데이트
            onFileSelect(file);  // 부모 컴포넌트에 파일 정보 전달
    
        }
    };

    
    // 파일 제거
    const handleRemove = () => {
        setSelectedFile(null);  // 선택된 파일 상태 초기화
        onFileSelect(null);  // 부모 컴포넌트에 null 전달
    };

    // 파일 크기 포맷팅  
    const formatFileSize = (bytes) => {
        return `${(bytes / 1024).toFixed(2)}KB`;  // 바이트를 KB로 변환하고 소수점 2자리까지 표시
    };


    return (
        <div className="w-full">
            {/* 파일 선택 전 */}
            {!selectedFile ? (
                <div
                    className={`relative flex flex-col items-center justify-center w-full border border-gray-300 rounded-md px-3 py-2
                        focus-within:outline-none focus-within:ring focus-within:ring-slate-300
                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept="*/*"
                    />
                    
                    <div className="flex items-center justify-center gap-2 py-1">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                            <span className="font-semibold">파일을 드래그</span>하거나 <span className="font-semibold">클릭</span>하여 업로드
                        </span>
                    </div>
                </div>
            ) : (
                // 파일 선택 후
                <div className="flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">파일</span>
                        </div>
                        <span className="text-sm">{selectedFile.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</span>
                        <button
                            onClick={handleRemove}
                            className="text-gray-500 hover:text-gray-700"
                            type="button"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {/* {isUploading && <p className="text-sm text-blue-500 mt-2">업로드 중...</p>} */}
                </div>
            )}
        </div>
    );
}
