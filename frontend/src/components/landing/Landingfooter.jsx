import { selectVersion } from "@/api/versionAPI";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
{
  /*
    날짜 : 2024/11/27(수)
    생성자 : 최준혁
    내용 : Landingfooter 추가

  */
}
export default function LandingFooter() {
  return (
    <footer
      id="footer"
      className="flex w-full h-300 bg-white border-t border-slate-200"
    >
      <div className="footerIn flex justify-start h-200 bg-white p-20">
        <div className="flogo flex items-start gap-15 pt-30">
          <Link to="#" className="cursor-pointer">
            <img
              className="w-40 h-20 gap-8"
              src="/images/Landing/antwork_logo.png"
              alt="Antwork footer logo"
            />
            <span>App Version:</span> <br />
            <span>3조-v 1.0.0</span>
          </Link>
        </div>

        <div className="finfo flex items-start ml-20 mt-30 mb-20">
          <div className="left items-start !gap-60">
            <ul className="dep flex gap-20">
              {/* dep1-1 서비스 소개 start */}
              <li className="dep1-2 w-500 cursor-pointer">
                <a
                  href="#"
                  className="cursor-pointer !text-[15px] mb-2 block text-slate-700 font-semibold"
                >
                  서비스 소개
                </a>

                <ul className="dep2">
                  <li className="dep2-1">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      기능 소개서
                    </a>
                  </li>
                  <li className="dep2-2">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      서비스 소개
                    </a>
                  </li>
                  <li className="dep2-3">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      주요 기능
                    </a>
                  </li>
                </ul>
              </li>
              {/* dep1-1 서비스 소개 end */}

              {/* dep1-2 가격 및 혜택 start */}
              <li className="dep1-2 w-500 cursor-pointer">
                <a
                  href="#"
                  className="cursor-pointer !text-[15px] font-semibold text-slate-700 mb-2 block"
                >
                  가격 및 혜택
                </a>

                <ul className="dep2">
                  <li className="dep2-1">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      가격 안내
                    </a>
                  </li>
                  <li className="dep2-2">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      혜택 소개
                    </a>
                  </li>
                  <li className="dep2-3">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      무료 체험
                    </a>
                  </li>
                  <li className="dep2-4">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      10인 이하
                    </a>
                  </li>
                  <li className="dep2-5">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      도입 문의
                    </a>
                  </li>
                  <li className="dep2-6">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      견적서 요청
                    </a>
                  </li>
                </ul>
              </li>
              {/* dep1-2 가격 및 혜택 end */}

              {/* dep1-3 체험 및 도입 start */}
              <li className="dep1-2 w-500 cursor-pointer ">
                <a
                  href="#"
                  className="cursor-pointer !text-[14.5px] mb-2 block font-semibold text-slate-700"
                >
                  체험 및 도입
                </a>

                <ul className="dep2">
                  <li className="dep2-1">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      고객센터
                    </a>
                  </li>
                  <li className="dep2-2">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      매뉴얼
                    </a>
                  </li>
                  <li className="dep2-3">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      상세 가이드
                    </a>
                  </li>
                  <li className="dep2-4">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      다운로드
                    </a>
                  </li>
                  <li className="dep2-5">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      공지사항
                    </a>
                  </li>
                  <li className="dep2-6">
                    <a
                      href="#"
                      className="cursor-pointer !text-[13.5px] leading-8 text-slate-500"
                    >
                      도입상담
                    </a>
                  </li>
                </ul>
              </li>
              {/* dep1-1 서비스 소개 end */}
            </ul>
          </div>
        </div>

        <div className="right flex row-auto items-start  !w-300 !h-auto">
          <div className="sns">
            <img
              className="!w-145 !h-auto"
              src="/images/Landing/sns.png"
              alt="sns - 트위터, 인스타그램, 유튜브, LinkedIn"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
