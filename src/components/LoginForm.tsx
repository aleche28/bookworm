import { useState } from "react";
import { googleLogin, login } from "../auth/auth";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import * as React from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidated(true);
    setErrMsg("");

    if (!email || !password) {
      setErrMsg("Please enter both email and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate("/");
    } else {
      setErrMsg(res.error || "An error occurred during login.");
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await googleLogin();
    if (res.success) {
      navigate("/");
    } else {
      setErrMsg(res.error || "An error occurred during login.");
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center vh-100">
      <Card className="p-shadow-6 p-p-4" style={{ width: "400px" }}>
        <div className="p-text-center">
          <h2>Login</h2>
        </div>
        {errMsg && (
          <Message severity="error" text={errMsg} className="p-mt-3" />
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-field p-my-4">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={validated && !email ? "p-invalid" : ""}
            />
            {validated && !email && (
              <small className="p-error">Please enter an email.</small>
            )}
          </div>
          <div className="p-field p-my-4">
            <label htmlFor="password">Password</label>
            <span className="p-input-icon-right">
              <i
                className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              />
              <InputText
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={validated && !password ? "p-invalid" : ""}
              />
            </span>
            {validated && !password && (
              <small className="p-error">Please enter a password.</small>
            )}
          </div>

          <Button
            type="submit"
            label="Login"
            className="p-button-primary p-mb-3"
            style={{ width: "100%" }}
          />

          <div className="p-text-center p-mb-3">
            <small>
              Not registered yet? <Link to="/signup">Sign up now</Link>
            </small>
          </div>

          <Divider align="center">
            <span>OR</span>
          </Divider>

          <div className="p-mt-3">
            <GoogleLoginButton handleGoogleLogin={handleGoogleLogin} />
          </div>
        </form>
      </Card>
    </div>
  );
};

export { LoginForm };
