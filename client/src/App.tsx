import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";

const App = (): JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div>dashboard</div>} />
        <Route path="/coach/dashboard" element={<div>Coach dashboard</div>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
