import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<div>dashboard</div>} />
      <Route path="/coach/dashboard" element={<div>Coach dashboard</div>} />
    </Routes>
  </BrowserRouter>
);

export default App;
