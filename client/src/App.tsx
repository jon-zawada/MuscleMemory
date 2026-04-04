import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const App = (): JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<div>dashboard</div>} />
      <Route path="/coach/dashboard" element={<div>Coach dashboard</div>} />
    </Routes>
  </BrowserRouter>
);

export default App;
