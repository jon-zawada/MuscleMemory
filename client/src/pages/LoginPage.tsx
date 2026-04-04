import { type JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const LoginPage = (): JSX.Element => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(user.role === "athlete" ? "/dashboard" : "/coach/dashboard");
    }
  }, [user, navigate]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const submitHandler = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/auth/login", { ...inputs });
      const { token } = res.data;
      login(token);
    } catch (error) {
      // TODO: something
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="email"
          name="email"
          value={inputs.email}
          onChange={changeHandler}
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          value={inputs.password}
          onChange={changeHandler}
          placeholder="*****"
        />
        <button>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
