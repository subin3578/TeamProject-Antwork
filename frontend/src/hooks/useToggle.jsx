import { useState } from "react";
{
  /*
    날짜 : 2024/11/26(화)
    생성자 : 최준혁
    내용 : 토글 상태관리 위한 훅 
  */
}
function useToggle(initialStates) {
  const [toggleStates, setToggleStates] = useState(initialStates);

  const toggleState = (key) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return [toggleStates, toggleState];
}

export default useToggle;
