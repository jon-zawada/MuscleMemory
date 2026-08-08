import { type JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const SignupPage = (): JSX.Element => {
  const [inputs, setInputs] = useState({ email: "", username: "", password: "", role: "athlete" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      await apiClient.post("/auth/signup", { ...inputs });
      navigate("/login");
    } catch (error) {
      // TODO: something
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl font-bold leading-tight font-display">How do you train?</h1>
      <form className="flex flex-col gap-8" onSubmit={submitHandler}>
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-transparent bg-surface p-4 has-checked:border-positive has-checked:bg-positive has-checked:text-black">
            <input
              type="radio"
              name="role"
              value="athlete"
              checked={inputs.role === "athlete"}
              onChange={changeHandler}
              className="sr-only"
            />
            <span className="font-bold font-display">I'm an athlete</span>
            <span className="text-sm font-sans">
              Log sets, chase PRs, follow a program from your coach.
            </span>
          </label>
          <label className="flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-transparent bg-surface p-4 has-checked:border-positive has-checked:bg-positive has-checked:text-black">
            <input
              type="radio"
              name="role"
              value="coach"
              checked={inputs.role === "coach"}
              onChange={changeHandler}
              className="sr-only"
            />
            <span className="font-bold font-display">I'm a coach</span>
            <span className="text-sm font-sans">
              Manage a roster, assign sessions, review every logged set.
            </span>
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-mono text-muted text-xs uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={inputs.email}
            className="w-full rounded-xl bg-surface px-4 py-3 text-white border-2 border-transparent focus:border-positive focus:outline-none"
            onChange={changeHandler}
            placeholder="name@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="font-mono text-muted text-xs uppercase tracking-wide"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={inputs.username}
            className="w-full rounded-xl bg-surface px-4 py-3 text-white border-2 border-transparent focus:border-positive focus:outline-none"
            onChange={changeHandler}
            placeholder="jonsmith123"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="font-mono text-muted text-xs uppercase tracking-wide"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={inputs.password}
            className="w-full rounded-xl bg-surface px-4 py-3 text-white border-2 border-transparent focus:border-positive focus:outline-none"
            onChange={changeHandler}
            placeholder="••••••••"
          />
        </div>
        <Button
          text="Sign up"
          disabled={!inputs.email || !inputs.password || !inputs.username}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};

export default SignupPage;
