import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = (): JSX.Element => {
  const [inputs, setInputs] = useState({ email: "", username: "", password: "", role: "athlete" });
  const navigate = useNavigate();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const signUp = async (): Promise<void> => {
    try {
      await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs }),
      });
      navigate("/login");
    } catch (error) {
      // TODO: something
    }
  };

  return (
    <div>
      <input
        type="text"
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

        <p>Selected: {inputs.role}</p>
      </div>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
};

export default SignUpPage;
