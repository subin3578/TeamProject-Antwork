import { useState } from "react";
import { completeSetup } from "./../../../hooks/Lending/completeSetup";
/* eslint-disable react/prop-types */
const Step3 = ({ state, dispatch, handleNextStep }) => {
  console.log(useState(state));

  // const isButtonDisabled =
  //   !state.companyName?.trim() ||
  //   !state.logoPreview ||
  //   !state.foundationDate ||
  //   !state.adminName?.trim() ||
  //   !state.adminEmail?.trim();

  const handleComplete = async () => {
    console.log("State before setup:", state);
    // console.log("Is Button Disabled:", isButtonDisabled);
    await completeSetup(state, dispatch);
  };

  return (
    <div className="step-container flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        회사 및 대표 설정
      </h1>
      <div className="w-full max-w-sm flex flex-col space-y-4">
        <label className="text-gray-700 font-medium">회사 이름</label>
        <input
          type="text"
          value={state.companyName}
          onChange={(e) => {
            console.log("Setting company name:", e.target.value); // 디버깅
            dispatch({ type: "SET_COMPANY_NAME", payload: e.target.value });
          }}
          className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
        <label className="text-gray-700 font-medium">대표 이름</label>
        <input
          type="text"
          value={state.adminName}
          onChange={(e) => {
            console.log("Setting admin name:", e.target.value); // 디버깅
            dispatch({ type: "SET_ADMIN_NAME", payload: e.target.value });
          }}
          className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
        <label className="text-gray-700 font-medium">대표 이메일</label>
        <input
          type="email"
          value={state.adminEmail}
          onChange={(e) => {
            console.log("Setting admin email:", e.target.value); // 디버깅
            dispatch({ type: "SET_ADMIN_EMAIL", payload: e.target.value });
          }}
          className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
        <label className="text-gray-700 font-medium">회사 로고</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
              const previewUrl = URL.createObjectURL(file);
              dispatch({ type: "SET_LOGO", payload: file });
              dispatch({ type: "SET_LOGO_PREVIEW", payload: previewUrl });
              console.log("Logo preview set to:", previewUrl);
            }
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none"
        />
        <button
          onClick={handleComplete}
          className={`w-full px-6 py-3 text-white rounded-lg transition bg-green-500 hover:bg-green-600"
          }`}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};
export default Step3;
