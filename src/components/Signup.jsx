import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../auth/auth";
import { Container, Row, Form, Button, Alert } from "react-bootstrap";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setErrMsg("Passwords do not match");
    } else {
      const form = e.currentTarget;
      const isValid = form.checkValidity();
      setValidated(true);

      if (!isValid) return;

      setErrMsg("");
      const res = await signUp(email, password);
      if (res.error) setErrMsg(res.error);
      else navigate("/login");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Container className="login-container border rounded px-4">
        <Row>
          <h1>Sign up</h1>
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="formGroupPassword2">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Confirm password"
              value={password2}
              onChange={(ev) => {
                setPassword2(ev.target.value);
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button className="mb-3 mt-3" variant="primary" type="submit">
              Sign up
            </Button>
          </div>
          <div className="below-button">
            <small>
              Already registered? <Link to={"/login"}>Login now</Link>
            </small>
          </div>
        </Form>
      </Container>
    </Container>
  );
};

export default Signup;
