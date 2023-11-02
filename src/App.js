import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import AuthContext from "./auth/AuthContext";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";
import { logout } from "./auth/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getList } from "./books";
import BookList from "./components/BookList";
import { Button, Container, Nav, Navbar, Row, Spinner } from "react-bootstrap";
import FavoritesPage from "./components/FavoritesPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="toread"
              element={<BookList listType="toread_books" listName="To read" />}
            />
            <Route
              path="read"
              element={<BookList listType="read_books" listName="Read" />}
            />
            <Route
              path="reading"
              element={<BookList listType="reading_books" listName="Reading" />}
            />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function MainLayout() {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header>
        <Navbar
          sticky="top"
          variant="dark"
          bg="success"
          expand="lg"
          className="mb-3"
        >
          <Container>
            <Navbar.Brand>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                BookWorm
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar" />
            <Navbar.Collapse id="navbar">
              <Nav className="me-auto">
                <Nav.Link as={Link} to={"/"}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to={"/toread"}>
                  To read
                </Nav.Link>
                <Nav.Link as={Link} to={"/reading"}>
                  Reading
                </Nav.Link>
                <Nav.Link as={Link} to={"/read"}>
                  Read
                </Nav.Link>
                <Nav.Link as={Link} to={"/favorites"}>
                  Favorites
                </Nav.Link>
              </Nav>
              <Navbar.Text className="m-0 p-0">
                {user?.uid ? (
                  <>
                    <i className="bi bi-person-circle"></i>{" "}
                    <span>{user.email}</span>{" "}
                    <Link
                      className="text-decoration-none ms-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                )}
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}

const HomePage = (props) => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [readlist, setReadlist] = useState([]);
  const [toreadlist, setToreadlist] = useState([]);
  const [readinglist, setReadinglist] = useState([]);

  const navigate = useNavigate();

  async function fetchReadlist() {
    try {
      const list = await getList(user.uid, "read_books");
      setReadlist(list);
    } catch (err) {
      setReadlist([]);
    }
  }

  async function fetchReadinglist() {
    try {
      const list = await getList(user.uid, "reading_books");
      setReadinglist(list);
    } catch (err) {
      setReadinglist([]);
    }
  }

  async function fetchToreadlist() {
    try {
      const list = await getList(user.uid, "toread_books");
      setToreadlist(list);
    } catch (err) {
      setToreadlist([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (!user) {
      setReadlist([]);
      setReadinglist([]);
      setToreadlist([]);
    } else if (!user.uid) {
      navigate("/login");
    } else {
      fetchReadlist();
      fetchReadinglist();
      fetchToreadlist();
      // setTimeout(() => {
      setLoading(false);
      // }, 200);
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <>
      {user?.uid && (
        <>
          <h1>Welcome back!</h1>

          <h2>Reading now</h2>
          {loading ? (
            <Container className="d-flex my-5 justify-content-left">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Container>
          ) : (
            <>
              {readinglist.map((b, i) => (
                <Row key={i}>
                  <p>
                    <b>{b.title}</b>, by {b.author}
                  </p>
                </Row>
              ))}
              <Button as={Link} to={"/reading"} variant="success">
                Add
              </Button>
            </>
          )}

          <h2>To read</h2>
          {loading ? (
            <Container className="d-flex my-5 justify-content-left">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Container>
          ) : (
            <>
              {toreadlist.map((b, i) => (
                <Row key={i}>
                  <p>
                    <b>{b.title}</b>, by {b.author}
                  </p>
                </Row>
              ))}
              <Button as={Link} to={"/toread"} variant="success">
                Add
              </Button>
            </>
          )}

          <h2>Read</h2>
          {loading ? (
            <Container className="d-flex my-5 justify-content-left">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Container>
          ) : (
            <>
              {readlist.map((b, i) => (
                <Row key={i}>
                  <p>
                    <b>{b.title}</b>, by {b.author}
                  </p>
                </Row>
              ))}
              <Button as={Link} to={"/read"} variant="success">
                Add
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default App;
