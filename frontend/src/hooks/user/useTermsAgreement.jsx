import { useState } from "react";

export const useTermsAgreement = () => {
  const [checkedItems, setCheckedItems] = useState({
    agreeAll: false,
    agree1: false,
    agree2: false,
    agree3: false,
  });

  const handleAllCheck = () => {
    const allChecked = !checkedItems.agreeAll;
    setCheckedItems({
      agreeAll: allChecked,
      agree1: allChecked,
      agree2: allChecked,
      agree3: allChecked,
    });
  };

  const handleItemCheck = (key) => {
    setCheckedItems((prev) => {
      const updatedState = { ...prev, [key]: !prev[key] };
      updatedState.agreeAll =
        updatedState.agree1 && updatedState.agree2 && updatedState.agree3;
      return updatedState;
    });
  };

  // 약관 동의 처리
  const handleAgree = (type) => {
    setCheckedItems((prev) => {
      const updatedState = { ...prev, [type]: true };
      updatedState.agreeAll =
        updatedState.agree1 && updatedState.agree2 && updatedState.agree3;
      return updatedState;
    });
  };

  return { checkedItems, handleAllCheck, handleAgree, handleItemCheck };
};
