import { useEffect, useState } from "react";
import useToggle from "../../hooks/useToggle";
import MyCalendar from "../main/Calendar/MyCalendar";
import { Link } from "react-router-dom";
import useAuthStore from "./../../store/AuthStore";
import AttendanceCard from "./main/AttendanceCard";
import PopupDisplay from "./main/PopupDisplay";

export default function MainSection() {
  const [toggles, toggleSection] = useToggle({});
  const [isMyOpen, setIsMyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [buttonText, setButtonText] = useState("업무");

  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  useEffect(() => {
    console.log("사용자 정보:", user);
  }, [user]);

  const handleToggle = () => {
    toggleSection("showMenu");
  };
  const handleMenuClick = (text) => {
    setButtonText(text); // 버튼 텍스트를 클릭한 항목으로 변경
    toggleSection("showMenu"); // 메뉴를 닫음
  };

  // 출,퇴근 상태 업데이트
  const handleStatusChange = (userId, newStatus) => {
    console.log(`${userId}의 상태가 ${newStatus}로 변경되었습니다.`);
    // API 호출하여 서버에 상태 업데이트
  };

  return (
    <>
      <main className="gap-[20px] min-w-[1820px] max-w-[2150px] h-auto mb-5 p-[20px] rounded-lg  bg-[#eaf0f9] flex !mt-[-15px] ">
        <div className="w-[258px] min-h-[1150px] ">
          {/* 팝업 컴포넌트 */}
          <PopupDisplay />

          <article className="w-[260px] h-[340px] bg-white p-8 border border-[#ddd] box-border rounded-[10px]">
            <div className="relative flex flex-col items-center mt-[20px]">
              <img
                src={user?.profile || "../images/pngegg.png"}
                alt="프로필 사진"
                className="w-[80px] h-[80px] bg-gray-100 rounded-full shadow-md"
              />
              <span className="absolute bottom-2 right-16 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-center mt-4">
              <h1 className="text-[18px] font-semibold text-gray-800 mb-3">
                {user?.name || "OOO"} 님, 환영합니다!
              </h1>
              <p className="text-[12.5px] text-gray-500 mt-1">
                {user?.companyName || "회사 정보 없음"} |{" "}
                {user?.position || "직위 정보 없음"}
              </p>
            </div>
            <ul className="mt-12 space-y-4">
              <li>
                <a className="flex justify-between items-center text-gray-700 hover:text-blue-500">
                  <span className="text-base font-medium">오늘의 일정</span>
                  <span className="text-sm text-gray-500">0</span>
                </a>
              </li>
              <li>
                <a className="flex justify-between items-center text-gray-700 hover:text-blue-500">
                  <span className="text-base font-medium">대기 중인 작업</span>
                  <span className="text-sm text-gray-500">0</span>
                </a>
              </li>
              <li>
                <a className="flex justify-between items-center text-gray-700 hover:text-blue-500">
                  <span className="text-base font-medium">완료된 작업</span>
                  <span className="text-sm text-gray-500">0</span>
                </a>
              </li>
            </ul>
          </article>

          <AttendanceCard
            userId={user?.id}
            userStatus={user?.status}
            onStatusChange={handleStatusChange}
          />
        </div>
        {/* main 게시판 시작 */}
        <article
          className=" max-w-[1450px] h-auto bg-[#eaf0f9] rounded-lg flex  "
          style={{ height: "fit-content" }}
        >
          <div className="flex mx-auto">
            <section className="">
              <div className="w-[700px] h-[800px] bg-white rounded-[10px] border border-[#ddd] box-border p-4 shadow-sm mx-auto overflow-y-auto mr-[20px]">
                <MyCalendar />
              </div>
            </section>
            <section className="w-[390px] h-[380px]">
              <article className="page-list mr-7 !min-h-[340px] h-[380px]">
                <div className="content-header">
                  <h1 className="!mb-3 ">🔥 인기 게시물</h1>
                  <p className="">많은 개발자들이 관심을 가진 게시글을 모았습니다.</p>
                </div>

                <div className="page-grid cursor-pointer h">
                  {/* 인기급상승 게시물  */}
                  <div className="page-card cursor-pointer">
                    <div className="card-content">
                      <div className="user-info">
                        {/* <img src="/api/placeholder/32/32" alt="profile" className="avatar bg-slate-500"/> */}
                        <div className="user-details w-[300px]">
                          <h3 className="!text-[15px] mb-2 truncate text-ellipsis whitespace-nowrap">
                            [공지] 2024 신입 개발자 멘토링 프로그램 참가자 모집
                          </h3>
                          <p className="!mt-3 !text-[12px] line-clamp-2">
                            안녕하세요, (주)AntWork 여러분
                            올해도 신입 개발자 멘토링 프로그램을 진행합니다.
                            시니어 개발자분들의 적극적인 참여 부탁드립니다.
                          </p>
                          <ul className="mt-4 flex gap-2">
                            <li className="article_create_date w-13 h-7 flex items-center gap-1.5 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/create_date.svg"
                                alt="create_at 작성일"
                              />
                              <span className="article_create_at w-13]">
                                {" "}
                                2024-12-20{" "}
                              </span>
                            </li>

                            <li className="article_view w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/eye.svg"
                                alt="eye views 조회수"
                              />
                              <span className="view_count"> 628 </span>
                            </li>

                            <li className="article_comment w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/comment.svg"
                                alt="comment 댓글수"
                              />
                              <span className="article_comment_count">
                                {" "}
                                23{" "}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* <button className="options-btn">⋮</button> */}
                    </div>
                  </div>
                  {/* 인기게시물 끝 */}

                  {/* 인기급상승 게시물  2*/}
                  <div className="page-card ">
                    <div className="card-content">
                      <div className="user-info">
                        {/* <img src="/api/placeholder/32/32" alt="profile" className="avatar bg-slate-500"/> */}
                        <div className="user-details w-[300px]">
                          <h3 className="!text-[15px] mb-2 truncate text-ellipsis whitespace-nowrap">
                            [기술공유] Spring Security 6.0 마이그레이션 가이드
                          </h3>
                          <p className="!mt-3 !text-[12px] line-clamp-2">
                          최근 진행한 Spring Security 6.0 마이그레이션 경험을 공유합니다.
                          주요 변경사항과 트러블슈팅 내용입니다.

                          1.WebSecurityConfigurerAdapter 대체 방안
                          2.SecurityFilterChain 구성 변경점
                          3.CORS 설정 변경 사항
                          4.OAuth2 인증 플로우 수정
                          5.테스트 코드 마이그레이션
                          자세한 내용은 첨부된 기술문서를 참고해주세요.
                          </p>
                          <ul className="mt-4 flex gap-2">
                            <li className="article_create_date w-13 h-7 flex items-center gap-1.5 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/create_date.svg"
                                alt="create_at 작성일"
                              />
                              <span className="article_create_at w-13]">
                                {" "}
                                2024-12-27{" "}
                              </span>
                            </li>

                            <li className="article_view w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/eye.svg"
                                alt="eye views 조회수"
                              />
                              <span className="view_count"> 196 </span>
                            </li>

                            <li className="article_comment w-13 h-7 flex items-center gap-2 ">
                              <img
                                className="w-6 h-6"
                                src="/images/ico/comment.svg"
                                alt="comment 댓글수"
                              />
                              <span className="article_comment_count">
                                {" "}
                                7{" "}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* <button className="options-btn">⋮</button> */}
                    </div>
                  </div>
                  {/* 인기게시물 끝 2*/}
                </div>
              </article>

              {/* 2. 자료실  */}
              <article className="page-list mr-7 !min-h-[340px] h-[402px]">
                <div className="content-header grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                  <h1 className="">📄 나의 페이지</h1>
                  <p> 마이 페이지입니다. </p>
                  <div className="page-card !h-[19rem]"></div>
                </div>
              </article>

              {/* 자료실 끝 */}
            </section>

            <section className="w-[390px] ">
              <article className="page-list mr-7 !min-h-[340px] h-[380px]">
                <div className="content-header">
                  <h1 className="!mb-3 ">👥 나의 프로젝트</h1>
                  <p className="">인기급상승 게시물입니당</p>
                </div>

                <div className="page-grid cursor-pointer h"></div>
              </article>

              {/* 2. 자료실  */}
              <article className="page-list mr-7  !min-h-[350px] h-[402px]">
                <div className="content-header grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                  <h1 className=""> ☁️ 나의 드라이브</h1>
                  <p> 마이 페이지입니다. </p>
                  <div className="page-card !h-[19rem]"></div>
                </div>
              </article>

              {/* 자료실 끝 */}
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
