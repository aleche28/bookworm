import { useContext } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import AuthContext from "./auth/AuthContext";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";
import { logout } from "./auth/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import BookList from "./components/BookList";
import { Container, Nav, Navbar } from "react-bootstrap";
import FavoritesPage from "./components/FavoritesPage";
import HomePage from "./components/HomePage";

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
        <Container className="main-content">
          <Outlet />
        </Container>
      </main>
    </>
  );
}

export default App;
