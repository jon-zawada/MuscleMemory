import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { PageLayout } from "./components/common/PageLayout";
import CoachDashboard from "./pages/CoachDashboard";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = (): JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
