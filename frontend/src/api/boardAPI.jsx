// import axios from "axios";
import axiosInstance from "./../utils/axiosInstance";
import {
    BOARD_WRITE_URI, // 게시판 글쓰기
    BOARD_LIST_URI, // 게시판 리스트 (글목록)
    BOARD_VIEW_URI, // 게시판 뷰 (글보기)
    BOARD_UPDATE_URI,
    BOARD_DELETE_URI,
    BOARD_COMMENT_URI,
    BOARD_SEARCH_URI
    //BOARD_MAIN_URI, // 게시판 메인

} from "./_URI";

// 글쓰기
export const postBoard = async (data) => {
    try {
        console.log('요청 URL (boardAPI -----) : ', BOARD_WRITE_URI);
        console.log('API_SERVER_HOST (boardAPI -----) :', import.meta.env.VITE_API_SERVER_HOST);
        console.log('요청 데이터 (boardAPI -----) : ', data);
        console.log('API_SERVER_HOST (boardAPI -----) :', import.meta.env.VITE_API_SERVER_HOST);

        const response = await axiosInstance.post(BOARD_WRITE_URI, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('API_SERVER_HOST (boardAPI -----) :', import.meta.env.VITE_API_SERVER_HOST);

        // if (response.status !== 200 && response.status !== 201) {
        //     throw new Error('게시글 저장에 실패했습니다. 다시 시도해주세요.');

        // }

        if (response.status !== 200 && response.status !== 201) {
            console.error('게시글 저장 실패: 서버 응답 상태 코드가 예상 범위 밖입니다.(boardAPI -----)', {
                status: response.status, // 상태 코드
                statusText: response.statusText || '상태 메시지 없음', // 상태 메시지
                data: response.data || '응답 데이터 없음', // 서버에서 반환된 데이터
                requestUrl: BOARD_WRITE_URI, // 요청한 URL
                requestData: data // 전송한 데이터
            });
            throw new Error('⚠️게시글 저장에 실패했습니다. 다시 시도해주세요. ⚠️');
        }

        console.log('응답 데이터 (boardAPI -----) : ', response);
        console.log('API_SERVER_HOST (boardAPI -----) :', import.meta.env.VITE_API_SERVER_HOST);
        return response.data;
    } catch (error) {
        console.error('게시글 글쓰기 에러 상세 (boardAPI -----) : ', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        console.log('API_SERVER_HOST (boardAPI -----) :', import.meta.env.VITE_API_SERVER_HOST);
        throw error;

    }
};

// 파일 업로드
export const uploadBoardFile = async (formData) => {
    try {
        const response = await axiosInstance.post('/board/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status !== 200) {
            throw new Error('파일 업로드에 실패했습니다.');
        }

        return response.data;
    } catch (error) {
        console.error('파일 업로드 에러:', error);
        throw error;
    }
};

// 게시글 목록 조회
export const getBoardList = async () => {
    try {
        const response = await axiosInstance.get(BOARD_LIST_URI, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log("API 응답 데이터: ", response.data);
        return response.data; // 전체 응답 반환
    } catch (error) {
        console.error("게시글 목록 조회 에러:", {
            message: error.message, // "Request failed with status code 404"
            stack: error.stack, // 디버깅을 위한 에러 스택
            config: error.config, // Axios 요청 설정 정보 
            response: {
                data: error.response?.data, // 서버에서 반환된 데이터 {message: "Not Found"}
                status: error.response?.status, // 상태 코드 (404, 500)
                headers: error.response?.headers, // 서버 응답 헤더
            },
        });
        throw error; // 에러를 호출하는 쪽에서 처리하도록 전달
    }
};

// 게시글 상세 조회 
export const getBoardById = async (id) => {

    try {
        const { data } = await axiosInstance.get(`${BOARD_VIEW_URI}/${id}`);
        console.log('게시글 데이터:', data);
        return data;
    } catch (error) {
        // 좀 더 구체적인 에러 처리
        if (error.response) {
            // 서버가 응답을 반환했지만 2xx 범위를 벗어난 상태 코드
            console.error('게시글 조회 실패:', error.response.status, error.response.data);
            throw new Error(error.response.data.message || '게시글을 불러오는데 실패했습니다');
        } else if (error.request) {
            // 요청이 전송되었지만 응답을 받지 못함
            console.error('서버 응답 없음:', error.request);
            throw new Error('서버에서 응답이 없습니다');
        } else {
            // 요청 설정 중에 문제가 발생
            console.error('요청 설정 오류:', error.message);
            throw new Error('요청 중 오류가 발생했습니다');
        }
    }
};




// 게시글 수정 API
export const updateBoardApi = async (uid, data) => {
    console.log("게시글 수정 API 영역 시작");
    try {
        console.log('요청 URL : ', `${BOARD_UPDATE_URI}/${uid}`);
        console.log('요청 데이터 : ', data);

        const response = await axiosInstance.put(`${BOARD_UPDATE_URI}/${uid}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (![200, 201].includes(response.status)) {
            throw new Error('게시글 수정에 실패했습니다. 다시 시도해주세요.');
        }

        console.log('응답 데이터 : ', response.data);
        return response.data;
    } catch (error) {
        console.error('게시글 수정 에러 상세 : ', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        throw error;
    }
};

// 게시글 삭제 API
export const deleteBoardApi = async (uid) => {
    console.log("=== 삭제 API 함수 시작 ===");
    console.log("삭제할 게시글 ID:", uid);
    console.log("API 기본 주소:", import.meta.env.VITE_API_SERVER_HOST);
    console.log("삭제 URI:", BOARD_DELETE_URI);

    try {
        const fullUrl = `${BOARD_DELETE_URI}/${uid}`;
        console.log("최종 요청 URL:", fullUrl);

        const response = await axiosInstance.delete(fullUrl);
        console.log("서버 응답:", response);

        if (response.status === 204) {
            console.log("삭제 성공");
            return true;
        }

        console.log("예상치 못한 응답 상태:", response.status);
        throw new Error('게시글 삭제에 실패했습니다.');
    } catch (error) {
        console.error("삭제 API 에러:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            }
        });
        throw error;
    }
};



// 댓글 작성
export const createComment = async (boardId, commentData, user) => {
    try {

        const requestData = {
            content: commentData.content,
            parentCommentId: commentData.parentId,
            secret: commentData.isSecret,
            userId: user.id // 로그인된 사용자 ID 추가
        };

        const response = await axiosInstance.post(
            `${BOARD_COMMENT_URI}/${boardId}`,
            requestData
        );
        return response.data;
    } catch (error) {
        console.error('댓글 작성 실패:', error);
        throw error;
    }
};


// 댓글 수정
export const updateComment = async (commentId, updateData) => {
    try {
        const response = await axiosInstance.put(
            `${BOARD_COMMENT_URI}/${commentId}`,
            updateData
        );

        return response.data;
    } catch (error) {
        console.error('댓글 수정 실패:', error);
        throw error;
    }
};


// 댓글 삭제
export const deleteComment = async (commentId, userId) => {
    try {
        const response = await axiosInstance.delete(
            `${BOARD_COMMENT_URI}/${commentId}/${userId}`
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('댓글 삭제 실패:', error);
        throw error;
    }
};

// 댓글 목록 조회
export const getCommentList = async (boardId, userId, isAdmin = false) => {
    try {
        const response = await axiosInstance.get(
            `${BOARD_COMMENT_URI}/board/${boardId}?userId=${userId}&isAdmin=${isAdmin}`
        );
        return response.data;
    } catch (error) {
        console.error('댓글 목록 조회 실패:', error);
        throw error;
    }
};


// 게시글 검색 
// export const getBoardSearchResults = async (searchType, searchKeyword, pageSize) => {
//     try {
        
//         // 요청 직전
//         console.log("글 검색 API 호출 URL:", BOARD_LIST_URI);
//         console.log("글 검색 API 호출 params:", {
//             type: searchType,
//             keyword: searchKeyword,
//             size: pageSize,
//         });
        
//         const response = await axiosInstance.get(BOARD_SEARCH_URI, {
//             params: {
//                 keyword: searchKeyword,
//                 type: searchType,  // 검색 타입 (title, content, writerName 등)
//                 size: pageSize,
//             },
//             timeout: 5000,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Request-For': 'board-list-search',
//             }
//         });
//         console.log("API 응답 데이터: ", response.data);
//         return response.data; // 검색 결과 반환
//     } catch (error) {
//         console.error("게시글 검색 에러:", error);
//         throw error; // 에러를 호출하는 쪽에서 처리하도록 전달
//     }
// };