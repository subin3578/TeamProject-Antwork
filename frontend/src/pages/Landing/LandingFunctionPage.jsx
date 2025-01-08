import React, { useState } from "react";
import { Link } from "react-router-dom";
import LandingLayout from "../../layouts/LandingLayout";
import Navigator from "../../components/common/navigator";

{
  /*
    날짜 : 2024/11/27(수)
    생성자 : 강은경
    내용 : LandingSupportPage.jsx 레이아웃 구현

    수정 내역 : 
    예시) 2024/12/01 - 강은경 : ~~~ 를 위해 ~~~ 추가
    
  */
}

export default function LandingFunctionPage() {
  const [visibleSpan, setVisibleSpan] = useState("calendarFunction");

  const handleImageClick = (spanName) => {
    setVisibleSpan(visibleSpan === spanName ? null : spanName);
  };

  return (
    <LandingLayout>
      <article className="!w-[1200px] mx-[auto] relative">
        <div className="flex">
          <section className="w-[59px] border-r border-l border-black-500">
            <div className="nav-item">
              <img
                src="/images/ico/event_available_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                alt="calendar"
                onClick={() => handleImageClick("calendarFunction")}
              />
            </div>
            <div className="nav-item">
              <img
                src="/images/ico/nav_chat.svg"
                alt="message"
                onClick={() => handleImageClick("messageFunction")}
              />
            </div>
            <div className="nav-item">
              <img
                src="/images/ico/edit_document_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                alt="page"
                onClick={() => handleImageClick("pageFunction")}
              />
            </div>
            <div className="nav-item">
              <img
                src="/images/ico/group_add_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                alt="project"
                onClick={() => handleImageClick("projectFunction")}
              />
            </div>
            <div className="nav-item">
              <img
                src="/images/ico/content_paste_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                alt="board"
                onClick={() => handleImageClick("boardFunction")}
              />
            </div>
            <div className="nav-item">
              <img
                src="/images/ico/cloud_download_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                alt="drive"
                onClick={() => handleImageClick("driveFunction")}
              />
            </div>
          </section>
          <section className="fuctionleft w-2/5 h-[650px] p-8 ">
            <div className="textArea text-center mt-[80px]">
              <p className="tit z-8 mt-[150px] mb-[50px] text-[60px] font-extrabold tracking-[-0.75px]">
                AntWork
              </p>
              <p className="text-[20px] font-medium leading-[30px]">
                AntWork에서는 여러분들이 업무에
                <br />
                필요한 모든 기능을 제공합니다!
                <br />
                <br />
              </p>
              <p className="text-[18px] text-gray-500">
                궁금하신 기능들을 모두 확인해보세요!
              </p>
            </div>
          </section>
          <img
            className="mainImage !w-[425px] !h-[500px] z-10 absolute bottom-[0] right-[440px] "
            src="/images/Landing/functionBackground.png"
          ></img>
          <section className="functionright w-3/5 p-[40px] bg-customBlueOpacity">
            <div className="w-[480px] h-[570px] ml-[140px] bg-[url('/images/Landing/LandingFunctionBG.png')] bg-cover bg-center flex border border-[#ddd] rounded-[10px]">
              {visibleSpan === "calendarFunction" && (
                <span className="calendarFuntion text-[15px] leading-[30px] text-center mt-[126px] mx-[auto]">
                  <span className="text-[30px] font-extrabold mx-[auto]">
                    Calendar
                  </span>
                  <br />
                  <br />
                  캘린더 관련 기능 설명 써주세요
                  <br /> 어떤 기능이 있나요
                </span>
              )}
              {visibleSpan === "messageFunction" && (
                <span className="MessageFunction text-[15px] leading-[30px] text-center mt-[126px] mx-[auto]">
                  <span className="text-[30px] font-extrabold mx-[auto]">
                    Message
                  </span>
                  <br />
                  <br />
                  메시지 관련 기능 설명 써주세요
                  <br /> 어떤 기능이 있나요
                </span>
              )}
              {visibleSpan === "pageFunction" && (
                <span className="PageFunction text-[15px] leading-[30px] text-center mt-[126px] mx-[auto]">
                  <span className="text-[30px] font-extrabold mx-[auto]">
                    Page
                  </span>
                  <br />
                  <br />
                  페이지 관련 기능 설명 써주세요
                  <br /> 어떤 기능이 있나요
                </span>
              )}
              {visibleSpan === "projectFunction" && (
                <span className="ProjectFunction text-[15px] leading-[30px] text-center mt-[126px] mx-[auto]">
                  <span className="text-[30px] font-extrabold mx-[auto]">
                    Project
                  </span>
                  <br />
                  <br />
                  프로젝트 관련 기능 설명 써주세요
                  <br /> 어떤 기능이 있나요
                </span>
              )}
              {visibleSpan === "boardFunction" && (
                <span className="BoardFunction text-[15px] leading-[30px] text-center mt-[126px] mx-[auto]">
                  <span className="text-[30px] font-extrabold mx-[auto]">
                    Board
                  </span>
                  <br />
                  <br />
                  보드 관련 기능 설명 써주세요
                  <br /> 어떤 기능이 있나요
                </span>
              )}
              {visibleSpan === "driveFunction" && (
                <span className="DriveFunction text-[15px] leading-[30px] text-center mt-[126px] mx-[auto]">
                  <span className="text-[30px] font-extrabold mx-[auto]">
                    Drive
                  </span>
                  <br />
                  <br />
                  드라이브 관련 기능 설명 써주세요
                  <br /> 어떤 기능이 있나요
                </span>
              )}
              {visibleSpan === null && (
                <span className="DriveFunction text-[15px] leading-[30px] text-center mt-[126px] mx-[auto]">
                  <span className="text-[25px] font-extrabold mx-[auto]">
                    버튼을 눌러보세요
                  </span>
                  <br />
                  <br />
                  해당 기능에 대한 설명이 나옵니다.
                </span>
              )}
            </div>
          </section>
        </div>
      </article>
    </LandingLayout>
  );
}
