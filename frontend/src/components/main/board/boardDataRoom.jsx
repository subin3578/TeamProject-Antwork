/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useState } from "react";
{
  /*
    날짜 : 2024/11/29(금)
    생성자 : 김민희
    내용 : boardDataRoom.jsx - 자료실 게시판 목록 페이지 화면구현

    수정 내역 : 

  */
}

export default function BoardDataRoom() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '2024년도 상반기 영업보고서',
      author: '김차장',
      department: '영업부문',
      date: '2024-04-15',
      views: 245,
      likes: 15,
      commentCount: 3,
      fileType: 'pptx',
      fileSize: '2.5MB',
      hasFile: true,
      fileId: 'file1'
    },
    {
      id: 2,
      title: '신규 프로젝트 기획안',
      author: '박부장',
      department: '기획부문',
      date: '2024-04-14',
      views: 189,
      likes: 8,
      commentCount: 5,
      fileType: 'docx',
      fileSize: '1.8MB',
      hasFile: true,
      fileId: 'file2'
    },
    {
      id: 3,
      title: '인사평가 가이드라인',
      author: '이과장',
      department: '인사부문',
      date: '2024-04-13',
      views: 567,
      likes: 42,
      commentCount: 12,
      fileType: 'pdf',
      fileSize: '3.2MB',
      hasFile: true,
      fileId: 'file3'
    },
    {
      id: 4,
      title: '2024 교육훈련 계획서',
      author: '정대리',
      department: '인사부문',
      date: '2024-04-12',
      views: 178,
      likes: 23,
      commentCount: 7,
      fileType: 'hwp',
      fileSize: '1.1MB',
      hasFile: true,
      fileId: 'file4'
    },
    {
      id: 5,
      title: '분기별 실적보고서',
      author: '김과장',
      department: '재무부문',
      date: '2024-04-11',
      views: 342,
      likes: 19,
      commentCount: 4,
      fileType: 'xlsx',
      fileSize: '4.5MB',
      hasFile: true,
      fileId: 'file5'
    },
    {
      id: 6,
      title: '고객만족도 조사결과',
      author: '이사원',
      department: '마케팅부문',
      date: '2024-04-10',
      views: 231,
      likes: 27,
      commentCount: 8,
      fileType: 'pdf',
      fileSize: '2.7MB',
      hasFile: true,
      fileId: 'file6'
    },
    {
      id: 7,
      title: '신입사원 교육자료',
      author: '박과장',
      department: '인사부문',
      date: '2024-04-09',
      views: 423,
      likes: 31,
      commentCount: 6,
      fileType: 'pptx',
      fileSize: '5.8MB',
      hasFile: true,
      fileId: 'file7'
    },
    {
      id: 8,
      title: '업무매뉴얼 개정안',
      author: '최부장',
      department: '경영지원부문',
      date: '2024-04-08',
      views: 289,
      likes: 15,
      commentCount: 9,
      fileType: 'docx',
      fileSize: '1.9MB',
      hasFile: true,
      fileId: 'file8'
    },
    {
      id: 9,
      title: '부서별 예산계획',
      author: '강과장',
      department: '재무부문',
      date: '2024-04-07',
      views: 156,
      likes: 12,
      commentCount: 3,
      fileType: 'xlsx',
      fileSize: '3.4MB',
      hasFile: true,
      fileId: 'file9'
    },
    {
      id: 10,
      title: '프로젝트 진행보고서',
      author: '윤차장',
      department: 'IT부문',
      date: '2024-04-06',
      views: 198,
      likes: 21,
      commentCount: 5,
      fileType: 'hwp',
      fileSize: '2.2MB',
      hasFile: true,
      fileId: 'file10'
    }
  ]);

  const handleDownload = (fileId) => {
    console.log('Downloading file:', fileId);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'xlsx':
        return '📊';
      case 'pptx':
        return '📑';
      case 'hwp':
        return '📰';
      default:
        return '📁';
    }
  };

  return (
    <>
      <article className="page-list">
        <div className="content-header mx-auto">
          <h1>자료실</h1>
          <p className="!mb-5">업무에 필요한 자료를 공유하고 다운로드 할 수 있습니다.</p>
        </div>
        <section className="bg-white rounded-lg shadow">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">전체 자료</h2>
            <Link to="/antwork/board/write" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              글쓰기
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">기능</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getFileIcon(post.fileType)}</span>
                        <Link to="/antwork/board/boardDataView" className="text-blue-600 hover:underline">
                          {post.title}
                        </Link>
                        <span className="ml-2 text-gray-500 text-sm">({post.fileSize})</span>
                        {post.commentCount > 0 && (
                          <span className="ml-2 text-red-500 text-sm">[{post.commentCount}]</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{post.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{post.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{post.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{post.views}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => handleDownload(post.fileId)} className="text-blue-500 hover:text-blue-700">
                          ⬇️
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">❤️</button>
                        <div className="relative group">
                          <button className="text-gray-500 hover:text-gray-700">⋯</button>
                          <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <Link to={`/dataroom/edit/${post.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">수정하기</Link>
                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">삭제하기</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </>
  );
}

export { BoardDataRoom };