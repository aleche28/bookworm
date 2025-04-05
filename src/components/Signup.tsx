import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../auth/auth";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import * as React from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errMsg, setErrMsg] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      setErrMsg("Passwords do not match");
    } else {
      const form = e.currentTarget as HTMLFormElement;
      const isValid = form.checkValidity();
      setValidated(true);

      if (!isValid) return;

      setErrMsg("");
      const res = await signUp(email, password);
      if (res.success) {
        navigate("/");
      } else {
        setErrMsg(
          res.error ||
            "Some error occurred while performing the signup operation."
        );
      }
    }
  };

  return (
    <div className="p-d-flex p-ai-center p-jc-center p-mt-5">
      <Card className="p-shadow-5 p-p-4" style={{ width: "300px" }}>
        <h2>Sign Up</h2>
        <Divider />
        {errMsg && (
          <Message severity="error" text={errMsg} className="p-mb-3" />
        )}
        <form noValidate onSubmit={handleSubmit}>
          <div className="p-field p-my-3">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="p-field p-my-3">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              toggleMask
            />
          </div>
          <div className="p-field p-my-3">
            <label htmlFor="password2">Confirm Password</label>
            <Password
              id="password2"
              placeholder="Confirm password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              toggleMask
            />
          </div>
          <Button
            label="Sign Up"
            type="submit"
            className="p-button p-button-success p-my-3"
          />
        </form>
        <small className="p-d-block p-mt-2">
          Already registered? <Link to="/login">Login now</Link>
        </small>
      </Card>
    </div>
  );
};

export { Signup };
