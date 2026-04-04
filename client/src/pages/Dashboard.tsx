import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = (): JSX.Element => {
  const { logout } = useAuth();
  return (
    <div>
      <div>
        <div>Athlete Dashboard</div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
