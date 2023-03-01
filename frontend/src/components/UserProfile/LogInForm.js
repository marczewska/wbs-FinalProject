import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Card, Container }from "react-bootstrap";
import { useRef, useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import AuthContext from "../../context/AuthProvider";
// import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./registerform.css"

const LOGIN_URL = "/auth/login";

export default function LogInForm() {
  const { setAuth, setUser } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, name, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUser(response.data);
      setName(JSON.stringify(response?.data));
      console.log(name);
      console.log(JSON.stringify(response?.data));

      console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      setAuth({ email, name, password, accessToken });
      // setOperator("");
      // setEmail("");
      // setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setError("No Server Response");
      } else if (err.response?.status === 400) {
        setError("Missing Username/Email or Password");
      } else if (err.response?.status === 401) {
        setError("Unauthorized! check your email or password");
      } else if (err.response.status === 404) {
        setError("No account associated with the username/email address");
      } else {
        setError("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="w-100" style={{ maxWidth: "400px"}}>
      <Card className="text-center card">
        <Card.Body>
          <p
            ref={errRef}
            className={error ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {error}
          </p>
          <Card.Title className="my-4">
            <h2>Login in to your account</h2>
          </Card.Title>
          <Form className="form" onSubmit={handleSubmit}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="email"
                ref={emailRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <label htmlFor="email">Email:</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                type="password"
                id="pwd"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <label htmlFor="pwd">Password:</label>
            </Form.Floating>

            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    className="text-start"
                  />
                </Form.Group> */}

            <Card.Text className="mt-3 text-end">
              <Form.Text className="text-muted">
                <a href="#" style={{ color: "inherit" }}>
                  Forgot password?
                </a>
              </Form.Text>
            </Card.Text>

            <Button className="w-100 my-3" variant="outline-secondary" type="submit">
              Login
            </Button>

            <Card.Text className="mt-1">
              <Form.Text className="text-muted">
                No account yet? Register <Link to="/register">here</Link>
              </Form.Text>
            </Card.Text>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </Container>
  );
}
