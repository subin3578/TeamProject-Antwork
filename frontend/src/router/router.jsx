import { createBrowserRouter } from "react-router-dom";

import LandingMainPage from "../pages/Landing/LandingMainPage";

import MainPage from "./../pages/Main/MainPage";

import LoginPage from "../pages/Member/LoginPage";
import RegisterPage from "../pages/Member/RegisterPage";

import ChattingPage from "./../pages/Main/chatting/chattingPage";
import DrivePage from "../pages/Main/drive/drivePage";
import CalendarPage from "../pages/Main/calendar/CalendarPage";
import PagingPage from "./../pages/Main/Paging/pagingPage";
import PagingWritePage from "../pages/Main/Paging/pagingWritePage";
import BoardPage from "../pages/Main/board/boardPage";
import BoardViewPage from "../pages/Main/board/boardViewPage";
import BoardWritePage from "../pages/Main/board/boardWritePage";
import BoardListPage from "../pages/Main/board/boardListPage";
import BoardDataRoomPage from "../pages/Main/board/boardDataRoomPage";
import BoardDataViewPage from "../pages/Main/board/boardDataViewPage";
import AdminPage from "../pages/Main/Admin/adminPage";
import AdminMemberPage from "../pages/Main/Admin/adminMemberPage";
import AdminLoginPage from "../pages/Main/Admin/LoginPage";
import SettingMainPage from "../pages/Main/setting/settingMainPage";
import SettingMyinfoPage from "../pages/Main/setting/settingMyinfoPage";
import DriveSharePage from "./../pages/Main/drive/driveSharePage";
import ProjectMainPage from "../pages/Main/project/projectMainPage";
import ProjectViewPage from "../pages/Main/project/projectViewPage";

{
  /*
  작업 이력
  - 2024/11/26(화) 황수빈 - adminPage 추가, settingPage 추가
  - 2024/11/27(수) 김민희 - board -> List, Write, ViewPage 추가
  */
}

import LandingSupportPage from "../pages/Landing/LandingSupportPage";
import LandingFunctionPage from "../pages/Landing/LandingFunctionPage";

import DriveRecylcePage from "../pages/Main/drive/driveRecyclePage";
import LandingPayPage from "./../pages/Landing/LandingPayPage";
import CompletePage from "./../pages/Landing/CompletePage";
import EmailVerificationPage from "./../pages/Landing/EmailVerificationPage";
import SchedulePage from "../pages/Main/calendar/SchedulePage";
import AdminDepartmentPage from "../pages/Main/Admin/adminDepartmentPage";
import BoardUpdatePage from "../pages/Main/board/boardUpdatePage";
import AdminPopPage from "../pages/Main/Admin/adminPopupPage";
import ChannelPage from "../pages/Main/chatting/ChannelPage";

import AdminNotificationPage from "./../pages/Main/Admin/adminNotificationPage";
import AdminAttendancePage from "@/pages/Main/Admin/adminAttendancePage";
import DmChattingPage from "@/pages/Main/chatting/DmPage";
import ApprovalMainPage from "@/pages/Main/approval/approvalMainPage";

import BoardCommentPage from "@/pages/Main/board/boardCommentPage";

import TemplatePage from "@/pages/Main/Paging/TemplatePage";

import AdminApprovalPage from "@/pages/Main/Admin/adminApprovalPage";
import ApprovalVacationPage from "@/pages/Main/approval/approvalVacationPage";
import ApprovalTripPage from "@/pages/Main/approval/approvalTripPage";
import TemplateCreatePage from "@/pages/Main/Paging/TemplateCreatePage";
import SettingCalendarPage from "@/pages/Main/setting/settingCalendarPage";
import AdminAccessPage from "@/pages/Main/Admin/adminAccessPage";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import IntermediatePage from "@/pages/Landing/TossPaymentPage";
import TossPaymentPage from "@/pages/Landing/TossPaymentPage";

import TemplateViewPage from "@/pages/Main/Paging/TemplateViewPage";
import LandingMyQnaPage from "@/pages/Landing/LandingMyQnaPage";

import SettingProjectPage from "@/pages/Main/setting/settingProjectPage";

import AdminServicePage from "@/pages/Main/Admin/adminServicePage";
import SettingChattingPage from "@/pages/Main/setting/settingChattingPage";
import DriveSetting from "@/components/main/setting/DriveSetting";
import SettingDrivePage from "@/pages/Main/setting/settingDrivePage";

// prettier-ignore
const router = createBrowserRouter([

  // 예외 경로 (랜딩, 유저 페이지)
  { path: "/", element: <LandingMainPage /> }, // 2024/11/25(월) 최준혁 - LendingMainPage 추가
  { path: "/pay", element: <LandingPayPage /> }, // 2024/11/27(수) 최준혁 - LendingPayPage 추가추가
  { path: "/support", element: <LandingSupportPage /> }, // 2024/11/29(금) 강은경 - LendingSupportPage 추가
  { path: "/support/my", element: <LandingMyQnaPage /> }, // 2024/12/19(목) 황수빈 - LendingSupportPage 추가
  { path: "/function", element: <LandingFunctionPage /> }, // 2024/11/29(금) 강은경 - LandingFunctionPage 추가
  { path: "/complete", element: <CompletePage /> }, // 2024/11/27(수) 최준혁 - LendingPayPage 추가
  { path: "/email-verification", element: <EmailVerificationPage /> }, // 2024/11/27(수) 최준혁 - LendingPayPage 추가
  { path: "/toss", element: <TossPaymentPage /> }, // 2024/11/27(수) 최준혁 - IntermediatePage 추가

  { path: "/login", element: <LoginPage /> }, // 로그인
  { path: "/register", element: <RegisterPage /> }, // 약관, 회원가입 통합

  // ProtectedRoute 적용된 antwork 경로
  {
    path: "/antwork",
    element: <ProtectedLayout />, // ProtectedRoute + Outlet 적용
    children: [
      { index: true, element: <MainPage /> }, // "/antwork" 기본 페이지 설정
      { path: "admin", element: <AdminPage /> }, // 2024/11/26(화) 황수빈 - AdminPage 추가
      { path: "admin/member", element: <AdminMemberPage /> }, // 2024/11/26(화) 황수빈 - AdminPage 추가
      { path: "admin/department", element: <AdminDepartmentPage /> }, // 2024/12/03(화) 최준혁 - AdminDepartmentPage 추가
      { path: "admin/popup", element: <AdminPopPage /> }, // 2024/12/06(화) 최준혁 - AdminPopupPage 추가
      { path: "admin/notification", element: <AdminNotificationPage /> }, // 2024/12/06(화) 최준혁 - AdminPopupPage 추가
      { path: "admin/attendance", element: <AdminAttendancePage /> }, // 2024/12/10(화) 최준혁 - AdminAttendancePage 추가
      { path: "admin/approval", element: <AdminApprovalPage /> }, // 2024/12/10(화) 최준혁 - AdminAttendancePage 추가
      { path: "admin/access", element: <AdminAccessPage /> }, // 2024/12/16(월) 최준혁 - AdminAccessPage 추가
      { path: "admin/service", element: <AdminServicePage /> }, // 2024/12/19(목) 하정훈 - AdminServicePage 추가


      { path: "page", element: <PagingPage /> }, // Antwork 페이지
      { path: "page/write", element: <PagingWritePage /> }, // 2024/11/25(월) 황수빈 - Page Writer 추가
      { path: "page/template", element: <TemplatePage /> },  // 2024/12/11(수) 황수빈 - TemplatePage 추가
      { path: "page/template/create", element: <TemplateCreatePage /> },  // 2024/12/11(수) 황수빈 - TemplateCreatePage 추가P
      { path: "/antwork/page/template/view/:id", element: <TemplateViewPage /> }, // 2024/12/11(수) 황수빈 - TemplateCreatePage 추가P

      { path: "chatting", element: <ChattingPage /> }, // Antwork 채팅 main
      { path: "chatting/dm/:id", element: <DmChattingPage /> }, // Antwork 채팅 channel
      { path: "chatting/channel/:id", element: <ChannelPage /> }, // Antwork 채팅 dm

      { path: "drive", element: <DrivePage /> }, // antwork 페이지
      { path: "drive/folder/:driveFolderId", element: <DrivePage /> }, // 조건을 통한 dirvePage
      { path: "drive/share", element: <DriveSharePage /> }, // antwork 페이지
      { path: "drive/share/folder/:driveFolderId", element: <DriveSharePage /> }, // antwork 페이지
      { path: "drive/recycle", element: <DriveRecylcePage /> }, // antwork 페이지
      { path: "setting/drive", element: <SettingDrivePage /> }, // antwork 페이지


      { path: "calendar", element: <CalendarPage /> }, // Antwork 캘린더 페이지 2024/11/26(화) 하정훈 - calendar 추가
      { path: "schedule", element: <SchedulePage /> }, // Antwork 캘린더 페이지 2024/11/26(화) 하정훈 - calendar 추가
      { path: "setting", element: <SettingMainPage /> }, // Antwork 설정
      { path: "setting/myinfo", element: <SettingMyinfoPage /> }, // Antwork 나의정보설정
      { path: "setting/calendar", element: <SettingCalendarPage /> }, // Antwork 캘린더설정
      { path: "setting/chatting", element: <SettingChattingPage /> }, // Antwork 채팅 설정


      { path: "board", element: <BoardPage /> },
      { path: "board/list", element: <BoardListPage /> }, // 2024/11/27(수) 김민희 - Board List 추가
      { path: "board/list/:categoryId", element: <BoardListPage /> }, // 2024/12/26(목) 김민희 - Board categoryId 경로 추가
      { path: "board/write", element: <BoardWritePage /> }, // 2024/11/27(수) 김민희 - Board Write 추가
      { path: "board/view/:id", element: <BoardViewPage /> }, // 2024/11/27(수) 김민희 - Board View 추가
      { path: "board/comment", element: <BoardCommentPage /> }, // 2024/11/27(수) 김민희 - Board View 추가
      { path: "board/update/:id", element: <BoardUpdatePage /> }, // 2024/12/05(목) 김민희 - Board Update 추가
      { path: "board/boardDataRoom", element: <BoardDataRoomPage /> }, // 2024/11/29(금) 김민희 - Board Data Room 추가
      { path: "board/boardDataView", element: <BoardDataViewPage /> }, // 2024/11/29(금) 김민희 - Board Data View 추가

      { path: "project/main", element: <ProjectMainPage /> }, // 2024/11/27(월) 강은경 - Project main 추가
      { path: "project/view", element: <ProjectViewPage /> }, // 2024/11/27(월) 강은경 - Project view 추가
      { path: "setting/project", element: <SettingProjectPage /> }, // 2024/12/19(목) 강은경 - 프로젝트 설정 추가

      { path: "approval", element: <ApprovalMainPage /> }, // 2024/12/11(수) 황수빈 - ApprovalMainPage 추가
      { path: "approval/my", element: <ApprovalMainPage /> }, // 2024/12/11(수) 황수빈 - ApprovalMainPage 추가
      { path: "approval/vacation", element: <ApprovalVacationPage /> }, // 2024/12/11(수) 황수빈 - ApprovalMainPage 추가
      { path: "approval/business", element: <ApprovalTripPage /> }, // 2024/12/11(수) 최준혁 - ApprovalTripPage 추가
    ],
  },
]);
// 라우터 내보내기
export default router;
