import React, { createContext, useReducer, useContext } from "react";

// 초기 상태 정의
const initialState = {
  manualInput: false,
  adminId: "",
  adminPassword: "",
  step: 1,
  adminEmail: "",
  adminName: "",
  emailSent: false,
  emailVerified: false,
  companyName: "",
  companyDescription: "",
  foundationDate: "",
  startTime: "",
  endTime: "",
  address: "",
  businessNumber: "",
  logo: null,
  logoPreview: null,
  loading: false,
  error: null,
  generated: false,
};

// 리듀서 함수 정의
function reducer(state, action) {
  console.log("Action received:", action.type, action.payload);
  switch (action.type) {
    case "SET_MANUAL_INPUT":
      return { ...state, manualInput: action.payload };
    case "SET_ADMIN_ID":
      return { ...state, adminId: action.payload };
    case "SET_ADMIN_PASSWORD":
      return { ...state, adminPassword: action.payload };
    case "NEXT_STEP":
      if (state.step === 2 && !state.emailVerified) {
        return { ...state, error: "이메일 인증이 필요합니다." };
      }
      return { ...state, step: Math.min(state.step + 1, 3) };
    case "SET_EMAIL":
      return { ...state, adminEmail: action.payload };
    case "SET_EMAIL_SENT":
      return { ...state, emailSent: action.payload };
    case "SET_EMAIL_VERIFIED":
      return { ...state, emailVerified: action.payload };
    case "SET_COMPANY_NAME":
      return { ...state, companyName: action.payload };
    case "SET_ADMIN_NAME":
      return { ...state, adminName: action.payload };
    case "SET_COMPANY_DESCRIPTION":
      return { ...state, companyDescription: action.payload };
    case "SET_FOUNDATION_DATE":
      return { ...state, foundationDate: action.payload };
    case "SET_START_TIME":
      return { ...state, startTime: action.payload };
    case "SET_END_TIME":
      return { ...state, endTime: action.payload };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_BUSINESS_NUMBER":
      return { ...state, businessNumber: action.payload };
    case "SET_LOGO":
      return { ...state, logo: action.payload };
    case "SET_LOGO_PREVIEW":
      return { ...state, logoPreview: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return initialState;
    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
}

// Context 생성
export const CompletePageContext = createContext();

// Context Provider
export function CompletePageProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CompletePageContext.Provider value={{ state, dispatch }}>
      {children}
    </CompletePageContext.Provider>
  );
}

// 커스텀 훅
export function useCompletePage() {
  const context = useContext(CompletePageContext);
  if (!context) {
    throw new Error("useCompletePage must be used within CompletePageProvider");
  }
  return context;
}
