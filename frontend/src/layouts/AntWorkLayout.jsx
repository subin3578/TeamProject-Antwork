import { useState } from "react";

import Header from "../components/common/header";
import Navigator from "../components/common/navigator";
import Aside from "../components/common/aside/aside";
/* 
수정날짜 : 2024/11/28 - 하정훈 : 혹시 9번째줄에 setListMonth를 추가했는데 문제가 있으면 저에게 바로 말씀해주시면 됩니다.
*/
const AntWorkLayout = ({ children, setListMonth, isDm }) => {
  const [isAsideVisible, setIsAsideVisible] = useState(true);

  const toggleAside = () => {
    setIsAsideVisible((prev) => !prev);
  };

  return (
    <div id="main-container">
      <Header onToggleAside={toggleAside} />
      <main>
        <Navigator />
        <Aside
          asideVisible={isAsideVisible}
          setListMonth={setListMonth}
          isDm={isDm}
        />

        <section className="main-content">{children}</section>
      </main>
    </div>
  );
};

export default AntWorkLayout;
