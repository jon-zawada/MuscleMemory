import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = (): JSX.Element => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div>Athlete Dashboard</div>
        <button onClick={() => navigate("/workouts/new")}>Make a workout</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
