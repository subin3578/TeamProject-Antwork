import { Link } from "react-router-dom";

{
  /*
    날짜 : 2024/11/27(수)
    생성자 : 최준혁
    내용 : Landingheader 추가

  */
}
export default function LandingHeader() {
  return (
    <header id="header">
      <div className="headerIn">
        <h1 className="logo">
          <Link to="/">
            <img
              className="mt-[5px]"
              src="/images/Landing/antwork_logo.png"
              alt=""
            />
          </Link>
        </h1>

        {/* 메뉴 */}
        <nav className="gnb">
          <ul className="">
            <li>
              <Link to="/function" className="cursor-pointer">
                서비스 소개
                <img
                  src="/images/ico/arrow_drop_down.svg"
                  alt="arrow_drop_down 🔽"
                />
              </Link>
            </li>
            <li>
              <Link to="/pay" className="cursor-pointer">
                가격 및 혜택
                <img
                  src="/images/ico/arrow_drop_down.svg"
                  alt="arrow_drop_down 🔽"
                />
              </Link>
            </li>
            <li>
              <Link to="/support" className="cursor-pointer">
                체험 및 도입
                <img
                  src="/images/ico/arrow_drop_down.svg"
                  alt="arrow_drop_down 🔽"
                />
              </Link>
            </li>
          </ul>

          {/* util */}
          <div className="headerBtn">
            <Link to="/login" className="login cursor-pointer">
              로그인
            </Link>
            <Link to="/antwork" className="register cursor-pointer">
              AntWork
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
