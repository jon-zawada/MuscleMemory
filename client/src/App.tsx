import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { PageLayout } from "./components/common/PageLayout";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";
import CoachDashboardPage from "./pages/CoachDashboardPage";
import DashboardPage from "./pages/DashboardPage";
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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/coach/dashboard" element={<CoachDashboardPage />} />
        <Route path="/workouts/new" element={<ActiveWorkoutPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
