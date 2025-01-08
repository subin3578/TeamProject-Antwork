import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { User, Send, Download, Heart, MoreHorizontal, Reply, Lock } from 'lucide-react';

export default function BoardDataRoomView() {
  const { id } = useParams();

  // 게시글 데이터
  const [post] = useState({
    id: id,
    title: '2024년도 상반기 영업보고서',
    author: '김차장',
    department: '영업부문',
    date: '2024-04-15',
    views: 245,
    likes: 15,
    content: `2024년도 상반기 영업 실적과 관련된 보고서입니다.
              주요 성과 및 향후 계획이 포함되어 있으니 참고 바랍니다.
              
              1. 영업 실적 개요
              2. 부문별 성과 분석
              3. 시장 동향 분석
              4. 하반기 추진 전략`,
    attachedFiles: [
      {
        id: 'file1',
        name: '2024_상반기_영업보고서.pptx',
        type: 'pptx',
        size: '2.5MB'
      }
    ]
  });

  // 댓글 데이터
  const [comments, setComments] = useState([
    {
      id: 1,
      author: '박부장',
      department: '기획부문',
      content: '세부 실적 자료 확인했습니다. 하반기 계획 수립에 참고하겠습니다.',
      createAt: '2024-04-15',
      isSecret: false,
      replies: [
        {
          id: 101,
          author: '김차장',
          department: '영업부문',
          content: '네, 추가 문의사항 있으시면 연락주세요.',
          createAt: '2024-04-15',
          isSecret: false
        }
      ]
    }
  ]);

  // 댓글 작성 관련 상태
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isSecretComment, setIsSecretComment] = useState(false);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'xlsx': return '📊';
      case 'pptx': return '📑';
      case 'hwp': return '📰';
      default: return '📁';
    }
  };

  const handleDownload = (fileId) => {
    console.log('Downloading file:', fileId);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const commentObject = {
      id: Date.now(),
      author: '현재 사용자',
      department: '소속부서',
      content: newComment,
      createAt: new Date().toISOString().split('T')[0],
      isSecret: isSecretComment,
      replies: []
    };

    if (replyTo) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === replyTo
            ? { ...comment, replies: [...comment.replies, commentObject] }
            : comment
        )
      );
    } else {
      setComments(prev => [...prev, commentObject]);
    }

    setNewComment('');
    setReplyTo(null);
    setIsSecretComment(false);
  };

  const renderComment = (comment, isNested = false) => (
    <div
      key={comment.id}
      className={`flex flex-col p-3 ${isNested ? 'ml-6 border-l-2 border-gray-200' : 'border-b'
        } space-y-2`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User size={16} />
          <span className="font-medium">{comment.author}</span>
          <span className="text-sm text-gray-500">({comment.department})</span>
          <span className="text-slate-600 text-sm">{comment.createAt}</span>
          {comment.isSecret && <Lock size={12} className="text-gray-500" />}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setReplyTo(comment.id);
              setIsSecretComment(false);
            }}
            className="text-gray-500 hover:text-blue-600"
          >
            <Reply size={16} />
          </button>
        </div>
      </div>
      <p className={comment.isSecret ? 'text-gray-500 italic' : ''}>
        {comment.isSecret ? '비밀 댓글입니다.' : comment.content}
      </p>
      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
    </div>
  );

  return (
    <article className="page-list">
      <section className="bg-white rounded-lg shadow">
        {/* 게시글 헤더 */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
              <div className="mt-2 text-sm text-gray-600 flex items-center space-x-4">
                <span>{post.author} ({post.department})</span>
                <span>{post.date}</span>
                <span>조회 {post.views}</span>
                <span>좋아요 {post.likes}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-red-500">
                <Heart size={20} />
              </button>
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreHorizontal size={20} />
                </button>
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to={`/dataroom/edit/${post.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    수정하기
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    삭제하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 첨부파일 */}
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">첨부파일</h3>
          {post.attachedFiles.map((file) => (
            <div
              key={file.id}
              className="flex justify-between items-center bg-white p-3 rounded border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <span>{getFileIcon(file.type)}</span>
                <span>{file.name}</span>
                <span className="text-sm text-gray-500">({file.size})</span>
              </div>
              <button
                onClick={() => handleDownload(file.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* 게시글 본문 */}
        <div className="p-6 min-h-[200px]">
          <div className="prose max-w-none">
            {post.content.split('\n').map((line, index) => (
              <p key={index} className="mb-4">{line}</p>
            ))}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">댓글</h3>
          <div className="mb-4">
            {comments.map(comment => renderComment(comment))}
          </div>

          <div className="flex items-start space-x-2">
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? '답글 작성...' : '댓글 작성...'}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex items-center mt-2 space-x-2">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={isSecretComment}
                    onChange={() => setIsSecretComment(!isSecretComment)}
                    className="form-checkbox"
                  />
                  <span>비밀 댓글</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
          <Link
            to="/dataroom"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            목록으로
          </Link>
          <div className="space-x-2">
            <Link
              to={`/dataroom/edit/${post.id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              수정
            </Link>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              삭제
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}

export { BoardDataRoomView };