const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
export const API_SERVER_URI = `${API_SERVER_HOST}`;

// department
export const DEPARTMENT_INSERT_URI = `${API_SERVER_HOST}/department/insert`; // 부서 생성
export const DEPARTMENT_SELECT_URI = `${API_SERVER_HOST}/department/byCompany`; // 회사별 부서 조회
export const DEPARTMENT_UPDATE_URI = `${API_SERVER_HOST}/department`; // 부서 이름 수정
export const DEPARTMENT_USER_UPDATE_URI = `${API_SERVER_HOST}/department/move-user`; // 유저 부서 이동
export const DEPARTMENT_DELETE_URI = `${API_SERVER_HOST}/department`; // 부서 삭제

// user
export const USER_URI = `${SERVER_HOST}/user`;
export const USER_REGISTER_URI = `${API_SERVER_HOST}/user/register`; // 유저 회원가입
export const USER_LOGIN_URI = `${API_SERVER_HOST}/user/login`; // 유저 로그인
export const USER_LOGOUT_URI = `${API_SERVER_HOST}/user/logout`; // 유저 로그아웃
export const USER_LIST_URI = `${API_SERVER_HOST}/user/list`; // 유저 로그아웃
export const USER_REFRESH_URI = `${API_SERVER_HOST}/user/refresh`; // 리프레시 토큰 검증
export const USER_ADMIN_CREATE_URI = `${API_SERVER_HOST}/user/create`; // 초기 관리자 유저 INSERT
export const USER_INVITE_URI = `${API_SERVER_HOST}/user/invite`; // 회원 초대
export const USER_INVITE_VERIFY_URI = `${API_SERVER_HOST}/user/verify`; // 회원 초대 토큰 검증
export const USER_CHECK_DUPLICATE_ID_URI = `${API_SERVER_HOST}/user/checkduplicateId`; // 아이디 중복확인
export const USER_DETAILS_URI = `${API_SERVER_HOST}/user`; // 로그인 유저 전체 객체 정보
export const USER_CEO_URI = `${API_SERVER_HOST}/user/ceo`; // 로그인 유저 전체 객체 정보
export const USER_GET_ALL_URI = `${API_SERVER_HOST}/user/all`; // 유저 리스트 전부 불러오기
export const USER_SELECT_URI = `${API_SERVER_HOST}/user/select`; // 유저 리스트 부서별 조회
export const USER_UPDATEINFO_URI = `${API_SERVER_HOST}/user/info`; // 유저 정보 수정하기
export const USER_UPDATEPASS_URI = `${API_SERVER_HOST}/user/password`; // 유저 비밀번호 수정하기
export const USER_UPDATEIMG_URI = `${API_SERVER_HOST}/user/img`; // 유저 프로필이미지 수정하기
export const USER_FINDBYEMAIL_URI = `${API_SERVER_HOST}/user/findId`; // 유저 아이디 찾기
export const USER_SEARCHUSER_URI = `${API_SERVER_HOST}/user/search`; // 유저 검색해서 찾기
export const USER_UPDATEPOSITION_URI = `${API_SERVER_HOST}/user/position`; // 유저 직위 변경
export const USER_DELETEUSER_URI = `${API_SERVER_HOST}/user/delete`; // 유저 삭제하기
export const USER_FINDDELETE_URI = `${API_SERVER_HOST}/user/findDelete`; // 삭제 유저찾기
export const USER_VACATIONSELECT_URI = `${API_SERVER_HOST}/user/vacation`; // 삭제 유저찾기

// notification
export const NOTIFICATION_SEND_URI = `${API_SERVER_HOST}/notification/send`; // 초대전송
export const NOTIFICATION_MY_SELECT_URI = `${API_SERVER_HOST}/notification`; // 본인 알림 조회
export const NOTIFICATION_READ_URI = `${API_SERVER_HOST}/notification`; // 알림 읽음 처리
export const NOTIFICATION_SENDER_SELECT_URI = `${API_SERVER_HOST}/notification/sent`; // 보내는사람 알림조회

// popup
export const POPUP_URI = `${API_SERVER_HOST}/popups`;

// attendance
export const USER_CHECK_IN_URI = `${API_SERVER_HOST}/attendance/check-in`; // 출근 처리
export const USER_CHECK_OUT_URI = `${API_SERVER_HOST}/attendance/check-out`; // 퇴근 처리
export const USER_CHECK_STATUS_URI = `${API_SERVER_HOST}/attendance/status`; // 출퇴근 상태확인
export const USER_CHANGE_STATUS_URI = `${API_SERVER_HOST}/attendance/update-status`; // 상태업데이트 처리
export const ATTENDACNE_ADMIN_SELECT_URI = `${API_SERVER_HOST}/attendance/summary`; // 관리자 출���근 기록 조회

// email
export const USER_SEND_EMAIL_URI = `${API_SERVER_HOST}/email/send`; // 이메일 발송
export const USER_VERIFY_EMAIL_URI = `${API_SERVER_HOST}/email/verify`; // 인증 처리
export const USER_VERIFY_CHECK_EMAIL_URI = `${API_SERVER_HOST}/email/check-verification`; // 인증 요청
export const USER_INVITE_SEND_EMAIL_URI = `${API_SERVER_HOST}/email/invite`; // 이메일 발송

// access
export const ACCESS_SELECT_URI = `${API_SERVER_HOST}/logs/search`; // 로그 SELECT
export const ACCESS_USERLOG_URI = `${API_SERVER_HOST}/logs/user`; // 로그 SELECT

// company
export const COMPANY_INSERT_URI = `${API_SERVER_HOST}/company/insert`; // 회사 insert
export const COMPANY_SELECT_URI = `${API_SERVER_HOST}/company/select`; // 회사 select

// approval
export const APPROVAL_TRIP_CREATE = `${API_SERVER_HOST}/businesstrips`; // 출장 신청
export const APPROVAL_VACATION_CREATE = `${API_SERVER_HOST}/vacation/request`; // 휴가 신청
export const APPROVAL_ADMIN_SELECT = `${API_SERVER_HOST}/approval-requests/approver`; // 관리자 결제서류 조회
export const APPROVAL_ADMIN_UPDATE = `${API_SERVER_HOST}/approval-requests`; // 관리자 승인 및 반려처리
export const APPROVAL_MY_SELECT = `${API_SERVER_HOST}/approval-requests`; // 내 결제서류 조회
export const APPROVAL_DETAIL_SELECT = `${API_SERVER_HOST}/approval-requests/detail`; // 결제서류 상세조회

// project
export const PROJECT_ADD_URI = `${API_SERVER_HOST}/project/add`; // 프로젝트 추가
export const PROJECT_LIST_URI = `${API_SERVER_HOST}/project/list`; // 프로젝트 조회
export const PROJECT_DETAIL_URI = `${API_SERVER_HOST}/project/view`; // 프로젝트 상세
export const PROJECT_STATE_INSERT_URI = `${API_SERVER_HOST}/project/state/insert`; // 프로젝트 상태 추가
export const PROJECT_STATE_SELECT_URI = `${API_SERVER_HOST}/project/state/select`; // 프로젝트 상태 조회
export const PROJECT_TASK_INSERT_URI = `${API_SERVER_HOST}/project/task/insert`; // 프로젝트 작업 추가
export const PROJECT_TASK_SELECT_URI = `${API_SERVER_HOST}/project/task/select`; // 프로젝트 작업 조회
export const PROJECT_TASK_UPDATE_URI = `${API_SERVER_HOST}/project/task/update`; // 프로젝트 작업 추가
export const PROJECT_TASK_DELETE_URI = `${API_SERVER_HOST}/project/task/delete`; // 프로젝트 작업 삭제
export const PROJECT_TASK_UPDATE_POSITION_URI = `${API_SERVER_HOST}/project/task/updatePosition`; // 프로젝트 작업 드래그앤드랍 상태 업데이트
export const PROJECT_STATE_UPDATE_URI = `${API_SERVER_HOST}/project/state/update`; // 프로젝트 작업상태 수정
export const PROJECT_STATE_DELETE_URI = `${API_SERVER_HOST}/project/state/delete`; // 프로젝트 작업상태 삭제
export const PROJECT_UPDATE_URI = `${API_SERVER_HOST}/project/update`; // 프로젝트 수정
export const PROJECT_COLLABORATOR_INSERT_URI = `${API_SERVER_HOST}/project/collaborator/insert`; // 프로젝트 협업자 추가
export const PROJECT_COLLABORATOR_SELECT_URI = `${API_SERVER_HOST}/project/collaborator/select`; // 프로젝트 협업자 조회
export const PROJECT_COLLABORATOR_DELETE_URI = `${API_SERVER_HOST}/project/collaborator/delete`; // 프로젝트 협업자 삭제
export const PROJECT_DELETE_URI = `${API_SERVER_HOST}/project/delete`; // 프로젝트 삭제
export const PROJECT_STATUS_UPDATE_URI = `${API_SERVER_HOST}/project/update/status`; // 프로젝트 상태 수정(진행중/완료)
export const PROJECT_COUNT_USER_SELECT_URI = `${API_SERVER_HOST}/project/count`; // 한 사용자가 추가한 프로젝트 갯수 조회
export const PROJECT_COLLABORATOR_SELECT_COUNT_URI = `${API_SERVER_HOST}/project/collaborator/count`; // 해당 프로젝트의 협업자 조회
export const PROJECT_TASK_ATTRIBUTE_INSERT_URI = `${API_SERVER_HOST}/project/task/attribute/insert`; // 프로젝트 작업 속성 추가
export const PROJECT_TASK_ATTRIBUTE_SELECT_URI = `${API_SERVER_HOST}/project/task/attribute/select`; // 프로젝트 작업 속성 타입별 조회
export const PROJECT_TASK_ATTRIBUTE_UPDATE_URI = `${API_SERVER_HOST}/project/task/attribute/update`; // 프로젝트 작업 속성 수정
export const PROJECT_TASK_ATTRIBUTE_DELETE_URI = `${API_SERVER_HOST}/project/task/attribute/delete`; // 프로젝트 작업 속성 삭제

// drive
export const DRIVE_FOLDER_INSERT_URI = `${API_SERVER_HOST}/drive/folder/insert`; // 드라이브 폴더 넣기
export const DRIVE_FILES_INSERT_URI = `${API_SERVER_HOST}/drive/files/insert`; // 드라이브 파일 넣기
export const DRIVE_FOLDER_FILE_INSERT_URI = `${API_SERVER_HOST}/drive/folder/files/insert`; // 드라이브 파일 넣기(폴더에에)
export const MY_DRIVE_URI = `${API_SERVER_HOST}/drive/folder/myDriveView`; // 마이드라이브 전체보기
export const MY_TRASH_URI = `${API_SERVER_HOST}/drive/folder/myTrashView`; // 휴지통 전체보기
export const MY_DRIVE_SELECT_URI = `${API_SERVER_HOST}/drive/folder/myDriveSelectView`; //마이드라이브 선택보기
export const MY_TRASH_SELECT_URI = `${API_SERVER_HOST}/drive/folder/myTrashSelectView`; //휴지통 선택보기
export const MY_DRIVE_FILE_DOWNLOAD = `${API_SERVER_HOST}/drive/files/MyDriveFileDownload`;
export const DRIVE_FOLDER_NAME = `${API_SERVER_HOST}/drive/folder/name`; //delete1로 변경
export const ONE_DRIVE_FOLDER_TRASH = `${API_SERVER_HOST}/drive/folder/toOneTrash`; //delete1로변경(단일)
export const TRASH_FOLDER_DRIVE = `${API_SERVER_HOST}/drive/folder/toDrive`; //delete1으로변경
export const DRIVE_FOLDER_TRASH = `${API_SERVER_HOST}/drive/folder/toTrash`; //delete0으로변경
export const DRIVE_COLLABORATOR_SELECT = `${API_SERVER_HOST}/drive/collaborator/select`; //현재등록된협업자조회회
export const DRIVE_COLLABORATOR_INSERT = `${API_SERVER_HOST}/drive/collaborator/insert`; // 드라이브 협업자 추가
export const DRIVE_COLLABORATOR_DELETE = `${API_SERVER_HOST}/drive/collaborator/delete`; // 드라이브 협업자 삭제
export const SHARE_DRIVE_URI = `${API_SERVER_HOST}/drive/collaborator/ShareDriveView`; // 마이드라이브 전체보기
export const SHARE_DRIVE_SELECT_URI = `${API_SERVER_HOST}/drive/collaborator/ShareDriveSelectView`; // 마이드라이브 전체보기
export const DRIVE_ALL_SIZE = `${API_SERVER_HOST}/drive/files/totalSize`; // 마이드라이브 전체보기
export const DRIVE_IS_STARED = `${API_SERVER_HOST}/drive/isStared`; // 즐겨찾기
export const DRIVE_MOVE_TO_FOLDER = `${API_SERVER_HOST}/drive/move`; // 즐겨찾기

// page
export const PAGE_FETCH_URI = `${API_SERVER_HOST}/page`; // 페이지 조회
export const PAGE_SAVE_URI = `${API_SERVER_HOST}/page/save`; // 페이지 저장
export const PAGE_IMAGE_UPLOAD_URI = `${API_SERVER_HOST}/page/upload`; // 이미지 업로드
export const PAGE_DELETE_URI = `${API_SERVER_HOST}/page`; // 페이지 삭제
export const PAGE_CREATE_URI = `${API_SERVER_HOST}/page/create`; // 페이지 저장

// 추가할 페이지 관련 URI
export const PAGE_LIST_UID_URI = `${API_SERVER_HOST}/page/list/uid`; // 개인 페이지 목록
export const PAGE_LIST_MODIFIED_URI = `${API_SERVER_HOST}/page/list/modified`; // 최근 수정된 페이지 목록
export const PAGE_LIST_TEMPLATE_URI = `${API_SERVER_HOST}/page/template/list`; // 템플릿 페이지 목록
export const PAGE_LIST_DELETED_URI = `${API_SERVER_HOST}/page/list/deleted`; // 삭제된 페이지 목록
export const PAGE_RESTORE_URI = `${API_SERVER_HOST}/page/:id/restore`; // 페이지 복구
export const PAGE_SOFT_DELETE_URI = `${API_SERVER_HOST}/page/:id/soft`; // 소프트 삭제
export const PAGE_HARD_DELETE_URI = `${API_SERVER_HOST}/page/:id/hard`; // 하드 삭제

// chatting
// 채널 관련 URI
export const CHANNEL_URI = `${API_SERVER_HOST}/chatting/channel`; // 채널 관련 URI
export const CHANNEL_CREATE_URI = `${API_SERVER_HOST}/chatting/channel`; // 채널 생성/추가
export const CHANNEL_LIST_URI = `${API_SERVER_HOST}/chatting/channel`; // 채널 생성/추가

export const CHANNEL_FILE_URI = `${API_SERVER_HOST}/chatting/channel`; // 채널에 파일업로드

export const CHANNEL_GET_URI = (channelId) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}`; // 채널 조회

export const CHANNEL_GET_MESSAGES_URI = (channelId) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/messages`; // 채널 메시지 조회

export const CHANNEL_SEND_MESSAGE_URI = (channelId) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/messages`; // 채널 메시지 보내기

export const CHANNEL_LEAVE_URI = (channelId, userId) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/leave?userId=${userId}`; // 채널 나가기

export const CHANNEL_ADD_MEMBER_URI = (channelId) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/member`; // 채널 멤버 추가

export const CHANNEL_GET_MEMBER_URI = (channelId) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/members`; // 채널 멤버 조회

export const CHANNEL_CHANGE_TITLE_URI = (channelId) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/title`;

export const CHANNEL_ROOM_SEARCH_URI = `${API_SERVER_HOST}/chatting/channel/search`; // 채팅방 통합 검색
export const CHANNEL_GET_UNREAD_COUNT_URI = ({ channelId, messageId }) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/messages/${messageId}/unreadCount`;

export const CHANNEL_VISIT_URI = ({ channelId, memberId }) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/members/${memberId}/visit`;

export const CHANNEL_GET_C_UNREAD_COUNT_URI = ({ channelId, userId }) =>
  `${API_SERVER_HOST}/chatting/channel/${channelId}/unreadCount?userId=${userId}`;

// 채팅 설정 금칙어 관리
export const FORBIDDEN_WORDS_URI = `${API_SERVER_HOST}/chatting/forbidden-words`; // 금칙어 목록 조회
export const ADD_FORBIDDEN_WORD_URI = `${API_SERVER_HOST}/chatting/forbidden-words`; // 금칙어 추가
export const DELETE_FORBIDDEN_WORD_URI = (id) =>
  `${API_SERVER_HOST}/chatting/forbidden-words/${id}`; // 금칙어 삭제

// 디엠 관련 URI
export const DM_CREATE_URI = `${API_SERVER_HOST}/chatting/dm`; // 디엠방 생성
export const DM_LIST_URI = `${API_SERVER_HOST}/chatting/dm`; // 디엠방 목록 조회
export const DM_GET_URI = (dmId) => `${API_SERVER_HOST}/chatting/dm/${dmId}`; // 디엠방 조회

export const DM_SEND_MESSAGE_URI = (dmId) =>
  `${API_SERVER_HOST}/chatting/dm/${dmId}/messages`; // 디엠 메시지 보내기
export const DM_GET_MESSAGES_URI = (dmId) =>
  `${API_SERVER_HOST}/chatting/dm/${dmId}/messages`; // 디엠 메시지 조회
export const DM_DELETE_MESSAGE_URI = (messageId) =>
  `${API_SERVER_HOST}/chatting/dm/messages/${messageId}`; // 디엠 메시지 삭제 URI

export const DM_GET_MEMBER_URI = (dmId) =>
  `${API_SERVER_HOST}/chatting/dm/${dmId}/members`; // 디엠 멤버 조회

// calendar
export const CALENDAR_INSERT_URI = `${API_SERVER_HOST}/calendar/insert`; // 새 캘린더 추가하기
export const CALENDAR_SELECT_URI = `${API_SERVER_HOST}/calendar/select`; // 캘린더 조회하기
export const CALENDAR_SELECTMODAL_URI = `${API_SERVER_HOST}/calendar/select/modal`; // 캘린더 모달 조회하기
export const CALENDAR_SELECTSHARE_URI = `${API_SERVER_HOST}/calendar/select/share`; // 캘린더 모달 공유인원 조회하기
export const CALENDAR_DELETESHARE_URI = `${API_SERVER_HOST}/calendar/delete/share`; // 캘린더 모달 공유인원 조회하기
export const CALENDAR_UPDATE_URI = `${API_SERVER_HOST}/calendar/update`; // 캘린��� 수정하기
export const CALENDAR_DELETE_URI = `${API_SERVER_HOST}/calendar/delete`; // 캘린더 삭제하기
export const CALENDAR_SHARE_URI = `${API_SERVER_HOST}/calendar/share`; // 부서원 공유캘린더 초대
export const SCHEDULE_INSERT_URI = `${API_SERVER_HOST}/schedule/insert`; // 새 일정 추가하기
export const SCHEDULE_SELECT_URI = `${API_SERVER_HOST}/schedule/select`; // 일정 조회하기
export const SCHEDULE_DETAIL_URI = `${API_SERVER_HOST}/schedule/select/detail`; // 일정 상세조회하기
export const SCHEDULE_UPDATE_URI = `${API_SERVER_HOST}/schedule/update`; // 일정 수정하기
export const SCHEDULE_UPDATEDETAIL_URI = `${API_SERVER_HOST}/schedule/update/detail`; // 일정 수정하기
export const SCHEDULE_DELETE_URI = `${API_SERVER_HOST}/schedule/delete`; // 일정 삭제하기
export const SCHEDULE_SELECTDEPART_URI = `${API_SERVER_HOST}/schedule/selectDepart`; // 부서원 리스트 조회
export const CALENDAR_CALENDARLANGUAGE_URI = `${API_SERVER_HOST}/calendar/language`; // 부서원 리스트 조회

// version
export const VERSION_SELECT_URI = `${API_SERVER_HOST}/version/select`; // 버전 조회

// board
export const BOARD_WRITE_URI = `${API_SERVER_HOST}/board/write`; // 게시판 글쓰기
export const BOARD_LIST_URI = `${API_SERVER_HOST}/board/list`; // 게시판 리스트 (글목록)
export const BOARD_VIEW_URI = `${API_SERVER_HOST}/board/view`; // 게시판 뷰 (글보기)
export const BOARD_UPDATE_URI = `${API_SERVER_HOST}/board/update`; // 게시판 글 수정
export const BOARD_DELETE_URI = `${API_SERVER_HOST}/board/delete`; // 게시판 글 삭제

export const BOARD_COMMENT_URI = `${API_SERVER_HOST}/board/comment`; // 게시판 댓글 작성
export const BOARD_SEARCH_URI = `${API_SERVER_HOST}/board/list/search`; // 게시판 글 검색


export const BOARD_MAIN_URI = `${API_SERVER_HOST}/board`; // 게시판 메인

// board category URI 추가
export const BOARD_CATEGORY_INSERT_URI = `${API_SERVER_HOST}/board/category/insert`; // 카테고리 추가
export const BOARD_CATEGORY_ALL_URI = `${API_SERVER_HOST}/board/category/all`; // 전체 카테고리 조회
export const BOARD_CATEGORY_GET_URI = `${API_SERVER_HOST}/board/category`; // 특정 카테고리 조회
export const BOARD_CATEGORY_UPDATE_URI = `${API_SERVER_HOST}/board/category/update`; // 카테고리 수정
export const BOARD_CATEGORY_DELETE_URI = `${API_SERVER_HOST}/board/category/delete`; // 카테고리 삭제

// landing
export const LANDING_QNA_URI = `${API_SERVER_HOST}/qna/save`; // 랜딩 문의하기
export const LANDING_QNA_SEARCH_URI = `${API_SERVER_HOST}/qna/search`; // 랜딩 문의하기
export const LANDING_ANSWER_URI = `${API_SERVER_HOST}/qna/answer`;
export const LANDING_QNA_MODIFY_URI = `${API_SERVER_HOST}/qna/modify`;

export const WS_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_WS_URL
    : import.meta.env.VITE_WS_URL;
