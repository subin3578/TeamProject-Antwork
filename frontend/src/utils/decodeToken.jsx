import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token); // JWT 페이로드 디코딩
    return decoded;
  } catch (error) {
    console.error("JWT 디코딩 실패:", error);
    return null;
  }
};
