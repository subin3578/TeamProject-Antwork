import { RouterProvider } from "react-router-dom";
import "./App.css";
import "./styles/Landing.scss";
import "./styles/Main.scss";
import router from "./router/router";
import { CompletePageProvider } from "./hooks/Lending/completePageReducer";

function App() {
  return (
    <CompletePageProvider>
      <RouterProvider router={router} />
    </CompletePageProvider>
    // ProtectedRoute 추후에 추가 필요
  );
}

export default App;
