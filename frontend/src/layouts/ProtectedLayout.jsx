import ProtectedRoute from "@/router/ProtectedRoute";
import React from "react";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet /> {/* 자식 라우트를 렌더링 */}
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
