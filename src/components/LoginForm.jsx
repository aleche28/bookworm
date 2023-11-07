import { useState } from "react";
import { login } from "../auth/auth";
import { Alert, Button, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const isValid = form.checkValidity();
    setValidated(true);

    if (!isValid) return;

    setErrMsg("");
    const res = await login(email, password);
    if (res.error) setErrMsg(res.error);
    else navigate("/");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Container className="login-container col-8 col-md-6 col-lg-4 border rounded px-4">
        <Row>
          <h1>Login</h1>
        </Row>
        {errMsg && (
          <Alert key={"danger"} variant={"danger"}>
            {errMsg}
          </Alert>
        )}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3 mt-3" controlId="formGroupUsername">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value);
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please enter an email.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
              }}
            />
            <i
              id="toggle-password"
              className={
                showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
              }
              onClick={() => setShowPassword(!showPassword)}
            ></i>
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button className="mb-3 mt-3" variant="primary" type="submit">
              Login
            </Button>
          </div>
          <div className="below-button">
            <small>
              Not registered yet? <Link to={"/signup"}>Sign up now</Link>
            </small>
          </div>
        </Form>
      </Container>
    </Container>
  );
};

export default LoginForm;
