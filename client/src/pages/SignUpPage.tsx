import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const SignupPage = (): JSX.Element => {
  const [inputs, setInputs] = useState({ email: "", username: "", password: "", role: "athlete" });
  const navigate = useNavigate();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const submitHandler = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/signup", { ...inputs });
      navigate("/login");
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
          type="text"
          name="username"
          value={inputs.username}
          onChange={changeHandler}
          placeholder="username"
        />
        <input
          type="password"
          name="password"
          value={inputs.password}
          onChange={changeHandler}
          placeholder="password"
        />
        <div>
          <h3>Select an option:</h3>

          <label>
            <input
              type="radio"
              name="role"
              value="athlete"
              checked={inputs.role === "athlete"}
              onChange={changeHandler}
            />
            Athlete
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="coach"
              checked={inputs.role === "coach"}
              onChange={changeHandler}
            />
            Coach
          </label>
        </div>
        <button>Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
