import LandingHeader from "./../components/landing/Landingheader";
import LandingFooter from "./../components/landing/Landingfooter";
import { CompletePageProvider } from "./../hooks/Lending/completePageReducer";

{
  /*
    날짜 : 2024/11/27(수)
    생성자 : 최준혁
    내용 : LandingLayout 추가
  */
}
const LandingLayout = ({ children }) => {
  return (
    <div id="wrap">
      <LandingHeader />
      {children}
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
