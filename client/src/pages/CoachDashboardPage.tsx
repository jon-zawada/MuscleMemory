import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

const CoachDashboard = (): JSX.Element => {
  const { logout } = useAuth();
  return (
    <div>
      <div>Coach dashboard</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default CoachDashboard;
