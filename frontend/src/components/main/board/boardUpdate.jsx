/* eslint-disable react/prop-types */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BOARD_LIST_URI, BOARD_UPDATE_URI, BOARD_VIEW_URI } from "../../../api/_URI";
import axiosInstance from "../../../utils/axiosInstance";
import useAuthStore from "../../../store/AuthStore";
import { toast } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';

// 상수 정의
const MESSAGES = {
    LOADING: '수정 중...',
    SUCCESS: '게시글이 성공적으로 수정되었습니다.',
    ERROR: {
        LOAD_FAIL: '게시글을 불러오는데 실패했습니다.',
        REQUIRED_FIELDS: '제목과 내용을 모두 입력해주세요.',
        NO_PERMISSION: '수정 권한이 없습니다.',
        UNKNOWN: '오류가 발생했습니다.'
    },
    CONFIRM: {
        CANCEL: '작성 중인 내용이 있습니다. 정말 취소하시겠습니까?'
    }
};

// 에러 폴백 컴포넌트
function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <div className="text-red-500 p-4 text-center">
            <p>오류가 발생했습니다:</p>
            <pre className="mt-2">{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                다시 시도
            </button>
        </div>
    );
}

// 로딩 컴포넌트
const LoadingSpinner = () => (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

export default function BoardUpdateWrapper() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BoardUpdate />
        </ErrorBoundary>
    );
}

function BoardUpdate() {
    const { id } = useParams();
    console.log("게시글 ID:", id);

    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    console.log("사용자 정보:", user);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        content: '',
        writer: '',
        regDate: '',
        hit: 0,
        likes: 0
    });

    const [originalData, setOriginalData] = useState(null);
    console.log('4. originalData... ', originalData);

    const [isLoading, setIsLoading] = useState(false);
    console.log('5. isLoading... ', isLoading);


    useEffect(() => {
        const fetchBoard = async () => {
            console.log('안녕 수정하러 왔니?');
            
            setIsLoading(true);
            console.log('setIsLoading... ', true);
            
            try {
                const response = await axiosInstance.get(`${BOARD_VIEW_URI}/${id}`);
                
                console.log('try 안에 들어온 데이터:', response);
                
                if (response.data.success) {
                    const boardData = response.data.data;
                    console.log('try if 안에 들어온 데이터:', boardData);

                    setFormData(boardData);
                    console.log('setFormData :', boardData);
                    setOriginalData(boardData);
                    console.log('setOriginalData :', boardData);

                    // 권한 체크
                    if (boardData.writer !== user?.username) {
                        console.log('권한 체크 -----------------');
                        console.log('권한 체크 1', boardData.writer);
                        console.log('권한 체크 2', user?.username);
                        toast.error(MESSAGES.ERROR.NO_PERMISSION);
                    }
                } else {
                    throw new Error(response.data.message || MESSAGES.ERROR.LOAD_FAIL);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message;
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoard();
    }, [id, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        const isContentChanged = 
            formData.title !== originalData?.title || 
            formData.content !== originalData?.content;

        if (isContentChanged) {
            if (window.confirm(MESSAGES.CONFIRM.CANCEL)) {
                navigate(`${BOARD_VIEW_URI}/${id}`);
            }
        } else {
            navigate(`${BOARD_VIEW_URI}/${id}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.warning(MESSAGES.ERROR.REQUIRED_FIELDS);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosInstance.put(
                `${BOARD_UPDATE_URI}/${id}`,
                

                {
                    title: formData.title.trim(),
                    content: formData.content.trim()
                }
            );
            console.log('title', formData.title.trim());
            console.log('content', formData.content.trim());

            if (response.data.success) {
                toast.success(MESSAGES.SUCCESS);
                navigate(`${BOARD_VIEW_URI}/${id}`);
            } else {
                throw new Error(response.data.message || MESSAGES.ERROR.UNKNOWN);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <article className="page-list">
            {isLoading && <LoadingSpinner />}
            <section className="h-auto">
                <form onSubmit={handleSubmit} className="relative">
                    {/* 게시글 헤더 */}
                    <div className="border-gray-200">
                        <div className="mb-4">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full text-2xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                                placeholder="제목을 입력하세요"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="text-right text-[14px] text-gray-500 flex items-center justify-end mt-4">
                            <div className="writer">
                                <strong>작성자&nbsp;:&nbsp;&nbsp;</strong>
                                {formData.writer || user?.username || ''}
                            </div>
                        </div>
                    </div>

                    {/* 게시글 본문 */}
                    <div className="pt-6 pb-12 border-t border-slate-200">
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="w-full min-h-[400px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="내용을 입력하세요"
                            disabled={isLoading}
                        />
                    </div>

                    {/* 버튼 영역 */}
                    <div className="p-4 bg-gray-100 flex justify-between">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            disabled={isLoading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white rounded transition`}
                            disabled={isLoading}
                        >
                            {isLoading ? MESSAGES.LOADING : '수정완료'}
                        </button>
                    </div>
                </form>
            </section>
        </article>
    );
}

export { BoardUpdate };