import { Link } from "react-router-dom";

export default function AdminLoginPage() {
  return (
    <body className="member_body">
      <div className="wrapper">
        <div className="content">
          <img
            src="images/Antwork/member/login.png"
            alt="login_img"
            className="login_img"
          />
          <div className="login-box">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-black-500 ext-transparent bg-clip-text tracking-wide shadow-sm">
              Ant Work <span className="text-gray-600">|</span> Admin
            </h1>

            <h2 className="welcome">관리자 로그인</h2>
            <form className="login_form">
              <label className="email_lbl">Email</label>
              <input
                type="email"
                className="email"
                placeholder="Enter your email"
              />
              <label className="pass_lbl">Password</label>
              <input
                type="password"
                className="password"
                placeholder="Enter your password"
              />
              <button type="submit" className="btn">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </body>
  );
}
