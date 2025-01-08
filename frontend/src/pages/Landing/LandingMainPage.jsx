import { Link } from "react-router-dom";
import LandingLayout from "./../../layouts/LandingLayout";

{
  /*
    날짜 : 2024/11/26(화)
    생성자 : 김민희
    내용 : LandingMainPage.jsx - footer 레이아웃 구현

    수정 내역 : 
    예시) 2024/12/01 - 강은경 : ~~~ 를 위해 ~~~ 추가
    
  */
}

export default function LandingMainPage() {
  return (
    <LandingLayout>
      {/* 메인 컨텐츠 영역 ---------------------------------------------------------------------------------------*/}
      <div id="mainSlider">
        <div className="slider">
          <img
            src="/images/Landing/main_img(1920x815).jpg"
            alt="메인페이지 1"
          />
        </div>

        <ul>
          <li className="s1">
            <Link to="#"></Link>
          </li>
          <li className="s2">
            <Link to="#"></Link>
          </li>
          <li className="s3">
            <Link to="#"></Link>
          </li>
        </ul>
        <div className="text z-8">
          <p className="tit z-8">일개미가 되다.</p>

          <p className="des line-clamp-4">
            안녕하세요! 저희 회사는 효율적인 업무 환경과 원활한 협업을 위한
            최첨단 그룹웨어 솔루
            <br />
            션을 제공하는 기업입니다. 최고의 기술력과 노하우를 바탕으로, 조직의
            커뮤니케이션 활<br />
            성화, 문서 관리 간소화, 프로젝트 관리 강화를 목표로 하고 있습니다.
            <br />
            앞으로도 고객과 함께 성장하며, 혁신적인 IT 기술로 더 나은 내일을
            만들어 가겠습니다.
          </p>

          <p className="more">
            <Link to="/pay">
              무료로 이용하기
              <i></i>
              <span></span>
            </Link>
          </p>
        </div>

        <div className="btn">
          <Link to="#" className="btnL"></Link>
          <Link to="#" className="btnR"></Link>
        </div>
      </div>

      {/* 랜딩페이지 추가 요소를 위해 남겨둠 */}
      <main id="container">
        <section className="cont1">
          <div className="inner">
            <h3>{/* cont1 */}</h3>
          </div>
        </section>
        <section className="cont2">
          <div className="inner"></div>
        </section>
      </main>
    </LandingLayout>
  );
}
