/* eslint-disable react/prop-types */
import axiosInstance from "../../../utils/axiosInstance";
// import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../store/AuthStore";
import { Lock, Reply, User, Send } from "lucide-react";
import { BOARD_COMMENT_URI } from "../../../api/_URI";
import { deleteComment, updateComment } from "@/api/boardAPI";

export default function BoardComment({ boardId }) {
    const user = useAuthStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);

    // 댓글 관련 상태 관리
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [isSecretComment, setIsSecretComment] = useState(false);


    // 댓글 수정 상태
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    // 댓글 입력 작성 버튼 (버튼 높이)
    const textareaRef = useRef(null);
    // 댓글 입력창 상태
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            console.log()
            e.preventDefault(); // 기본 줄바꿈 동작 방지
            handleAddComment();
        }
    };

    // -----------------------------------------------------------------------------------------------------------

    // 댓글 작성 버튼 （버튼 높이）
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newComment]);


    // 댓글 목록 불러오기
    useEffect(() => {
        console.log("댓글 목록 불러오기 - 시작 - ");
        const fetchComments = async () => {
            try {
                const response = await axiosInstance.get(`${BOARD_COMMENT_URI}/${boardId}?userId=${user?.id}`);
                const fetchedComments = response.data.data || []; // 배열로 변환

                // 날짜 포맷팅 추가
                const formattedComments = fetchedComments.map(comment => ({
                    ...comment,
                    createdAt: comment.createdAt.split('T')[0]  // 2024-12-19T08:58:35 -> 2024-12-19
                }));


                console.log("❗️ 댓글 목록 123 :  ", formattedComments);
                setComments(formattedComments);

                console.log("❗️ 댓글 목록 불러오기 :  ", response.data);

            } catch (error) {
                console.error('❗️ 댓글 목록 불러오기 실패:', error);
            }
        };

        console.log("댓글 목록 불러오기 - 완료 - ");
        console.log("user?.id", user?.id);
        console.log("comments", comments);



        fetchComments();
    }, [boardId]);
    // -----------------------------------------------------------------------------------------------------------

    //  댓글 수정 처리 함수
    const handleEditComment = async (commentId) => {
        if (!user) return;
        const comment = comments.find(c => c.id === commentId);
        setEditingCommentId(commentId);
        setEditedContent(comment.content);
    };

    //  댓글 수정 저장
    const handleSaveEdit = async (commentId) => {
        if (!editedContent.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const updatedData = {
                content: editedContent,
                secret: isSecretComment,
                userId: user?.id,
            };
            const response = await updateComment(commentId, updatedData);

            if (response.success) {
                // 댓글 목록 새로고침
                const commentsResponse = await axiosInstance.get(`${BOARD_COMMENT_URI}/${boardId}?userId=${user.id}`);
                setComments(commentsResponse.data.data || []);
                setEditingCommentId(null);
                setEditedContent("");
            }
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            alert('댓글 수정 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 댓글 작성 처리
    const handleAddComment = async () => {
        console.log("댓글 작성 처리 - 시작 - ");

        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!newComment.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            console.log("댓글 작성 처리 - try - ");
            const response = await axiosInstance.post(`${BOARD_COMMENT_URI}/${boardId}`, {
                content: newComment,
                parentCommentId: replyTo,
                secret: isSecretComment,
                userId: user.id // 사용자 ID
            });
            console.log('return data' + JSON.stringify(response.data.data))
            if (response.data) {
                // 날짜 포맷팅 추가                
                response.data.data.createdAt = response.data.data.createdAt.split('T')[0]

                // 새 댓글을 댓글 목록에 추가
                setComments((prevComments) => [...prevComments, response.data.data]);

                // 입력 폼 초기화
                setNewComment('');
                setReplyTo(null);
                setIsSecretComment(false);
                console.log(" 댓글 작성 데이터 :  ", response.data);
            }
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert('댓글 작성 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };
    // -----------------------------------------------------------------------------------------------------------

    // 댓글 삭제 처리
    const handleDeleteComment = async (commentId) => {
        if (!user) return;

        // 삭제 확인 팝업
        if (!window.confirm('댓글을 삭제하시겠습니까 ❓')) return;

        setIsLoading(true);

        try {
            const response = await deleteComment(commentId, user?.id);  // user.id()
            console.log("➡️ 댓글 삭제 응답 데이터 : ", response);

            if (response.success) {
                // 삭제 성공 메시지
                alert("댓글이 삭제되었습니다 ❗️");

                // 댓글 목록 새로고침
                const commentsResponse = await axiosInstance.get(`${BOARD_COMMENT_URI}/${boardId}?userId=${user?.id}`);


                console.log("✅ 댓글 목록 새로고침 성공 : ", commentsResponse.data);
                setComments(commentsResponse.data.data);
            } else {
                console.warn("댓글 삭제 응답이 실패로 표시됨:", response.data.message);
                console.log("(삭제 응답 아래 ↓) 전체 응답 데이터:", response);
            }
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');

        } finally {
            setIsLoading(false);

        }
    };



    // -----------------------------------------------------------------------------------------------------------

    // 댓글 렌더링
    const renderComment = (comment, isNested = false) => (
        <div
            key={comment.id}
            className={`flex flex-col p-3 ${isNested ? "ml-6 border-l-2 border-gray-200" : "border-b"
                } space-y-2`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {comment.writerImage && (
                        <img
                            src={comment.writerImage}
                            alt={comment.writerName}
                            className="w-10 h-10 rounded-full border-2 border-white -ml-2 shadow-[1px_px_1px_rgba(0,0,0,0.2)]"
                        />
                    )}
                    <span className="font-medium">{comment.writerName}</span>
                    <span className="text-sm text-gray-500">({comment.writerDepartment})</span>
                    <span className="text-slate-600 text-sm">
                        {comment.createdAt}
                    </span>
                </div>
                <div className="flex space-x-2">
                    {!isNested && (
                        <button
                            onClick={() => {
                                setReplyTo(comment.id);
                                setIsSecretComment(false);
                            }}
                            className="text-gray-500 hover:text-blue-600"
                        >
                            <Reply size={16} />
                        </button>
                    )}


                    {/* *** 수정: 수정 버튼 추가 */}
                    {user?.id == comment.writerId && (
                        <>
                            <button
                                onClick={() => handleEditComment(comment.id)}
                                className="text-gray-500 hover:text-blue-600 text-sm"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-gray-500 hover:text-red-600 text-sm"
                            >
                                삭제
                            </button>
                        </>
                    )}
                    {/* *** 수정 끝: 수정 버튼 추가 */}

                </div>
            </div>



            {/* *** 수정 버튼 클릭 시 : 댓글 수정 *** */}
            {editingCommentId === comment.id ? (
                <div className="flex items-start space-x-2">
                    <div className="flex-grow">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                        <div className="flex items-center mt-2 space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isSecretComment}
                                    onChange={() => setIsSecretComment(!isSecretComment)}
                                    className="form-checkbox"
                                />
                                <span className="text-sm text-gray-600">비밀 댓글</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => handleSaveEdit(comment.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            disabled={isLoading}
                        >
                            수정
                        </button>
                        <button
                            onClick={() => {
                                setEditingCommentId(null);
                                setEditedContent("");
                            }}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                        >
                            취소
                        </button>
                    </div>
                </div>
            ) : (
                <p className={comment.secret && user?.id !== comment.writerId ? "text-gray-600 italic" : ""}>
                    {comment.secret && user?.id !== comment.writerId ? "🔐 비밀 댓글입니다." : comment.content}
                </p>
            )}
        </div>
    );

    // -----------------------------------------------------------------------------------------------------------


    return (
        <div className="mt-8 pt-4 pb-4 bg-white border-t border-slate-200">
            <h3 className="text-lg font-semibold mb-[-4]">
                댓글&nbsp;
                {/* 댓글 갯수 카운트 */}
                <span className="text-blue-400 ">{comments.length > 0 && `(${comments.length})`} </span>
            </h3>

            {/* 댓글 목록 */}
            <div className="mb-4">
                {comments.map(comment => renderComment(comment))}
            </div>

            {/* 댓글 작성 폼 */}
            {user ? (
                <div className="flex items-start space-x-2">
                    <div className="flex-grow">

                        {/* 댓글 입력창 */}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // 기본 줄바꿈 동작 방지
                                    handleAddComment(); // 댓글 전송 함수 호출
                                }
                            }}
                            placeholder={replyTo ? "답글을 입력하세요." : "댓글을 입력해주세요."}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />

                        <div className="flex items-center mt-2 space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isSecretComment}
                                    onChange={() => setIsSecretComment(!isSecretComment)}
                                    className="form-checkbox"
                                />
                                <span className="text-sm text-gray-600">비밀 댓글</span>
                            </label>
                            {replyTo && (
                                <button
                                    onClick={() => setReplyTo(null)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    답글 취소
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 댓글 입력 버튼 */}
                    <div className="cursor-pointer">
                        <button
                            onClick={handleAddComment}
                            onKeyDown={handleKeyPress} // enter 했을 때 바로 입력됨 
                            disabled={isLoading || !newComment.trim()}
                            className={`cursor-pointer
                                bg-slate-600 text-white p-2 rounded-lg hover:bg-slate-700
                                transition-all duration-200 px-6 py-2 flex items-center justify-center
                                h-24
                            `}

                            onChange={(e) => handleAddComment(e.target.value)}
                        >
                            댓글 <br/>
                            작성
                        </button>
                    </div>
                    


                </div>
            ) : (
                <div className="text-center py-4 text-gray-500">
                    댓글을 작성하려면 로그인이 필요합니다.
                </div>
            )}
        </div>
    );
}

export { BoardComment };