import { type JSX, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const LoginPage = (): JSX.Element => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsSubmitting(true);
      const res = await apiClient.post("/auth/login", { ...inputs });
      const { token } = res.data;
      login(token);
    } catch (error) {
      // TODO: something
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold leading-tight">Welcome back.</h1>
        <p className="mt-2 text-muted">Pick up where the last session left off.</p>
      </div>
      <form className="flex flex-col gap-8" onSubmit={submitHandler}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-muted text-xs uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full rounded-xl bg-surface px-4 py-3 text-white border-2 border-transparent focus:border-positive focus:outline-none"
            value={inputs.email}
            onChange={changeHandler}
            placeholder="name@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-muted text-xs uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full rounded-xl bg-surface px-4 py-3 text-white border-2 border-transparent focus:border-positive focus:outline-none"
            value={inputs.password}
            onChange={changeHandler}
            placeholder="••••••••"
          />
        </div>
        <Button
          text="Sign in"
          disabled={!inputs.email || !inputs.password}
          isSubmitting={isSubmitting}
        />
      </form>
      <Link to="/signup" className="flex text-muted text-xs uppercase items-center justify-center">
        Don't have an account? Sign up
      </Link>
    </div>
  );
};

export default LoginPage;
