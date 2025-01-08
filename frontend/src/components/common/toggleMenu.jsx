/* eslint-disable react/prop-types */
import { useState } from "react";

{
  /*
      날짜 : 2024/11/25(월)
      생성자 : 김민희
      내용 : toggleMenu.jsx - 재사용 가능한 토글 메뉴 컴포넌트 분리
  
      수정 내역 : 
      예시) 2024/12/01 - 강은경 : ~~~ 를 위해 ~~~ 추가
    */
}

const ToggleMenu = ({ mainCategory, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <li className="lnb-item !mt-[15px] !h-[300px] border-b border-[#ddd]">
      <div className="lnb-header cursor-pointer" onClick={toggleMenu}>
        <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex">
          {mainCategory}
          <img
            src={
              isOpen
                ? "/images/ico/page_dropup_20_999999.svg" // 열렸을 때
                : "/images/ico/page_dropdown_20_999999.svg" // 닫혔을 때
            }
            alt="toggle"
          />
        </span>
      </div>
      {isOpen && (
        <ol>
          {items.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
};

export default ToggleMenu;
