import { useContext } from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { AuthContext } from "./auth/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { Signup } from "./components/Signup";
import { logout } from "./auth/auth";
import { BookList } from "./components/BookList";
import { FavoritesPage } from "./components/FavoritesPage";
import { HomePage } from "./components/HomePage";
import { SearchBook } from "./components/SearchBook";
import { FaWorm } from "react-icons/fa6";

// PrimeReact imports
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import "primereact/resources/themes/lara-light-teal/theme.css"; // theme
// import "primereact/resources/themes/lara-dark-teal/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.css"; // flex

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
            <Route path="search" element={<SearchBook />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function MainLayout() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  // Define Menubar items for navigation links
  const menuItems = [
    { label: "Home", icon: "pi pi-home", command: () => navigate("/") },
    { label: "To Read", command: () => navigate("/toread") },
    { label: "Reading", command: () => navigate("/reading") },
    { label: "Read", command: () => navigate("/read") },
    { label: "Favorites", command: () => navigate("/favorites") },
  ];

  const startMenuItems = (
    <>
      <Button
        icon={FaWorm}
        label="Bookworm"
        onClick={() => navigate("/")}
        text
      />
    </>
  );

  const endMenuItems = (
    <>
      {user?.uid ? (
        <>
          <Button
            label={user.displayName as string}
            icon="pi pi-user"
            className="p-mr-3"
            text
          />
          <Button
            severity="danger"
            label="Logout"
            icon="pi pi-sign-out"
            onClick={handleLogout}
          />
        </>
      ) : (
        <Button
          label="Login"
          icon="pi pi-sign-in"
          onClick={() => navigate("/login")}
          className="p-mr-2"
        />
      )}
    </>
  );

  return (
    <>
      <header>
        <Menubar model={menuItems} start={startMenuItems} end={endMenuItems} />
      </header>
      <main>
        <Panel className="p-mt-3 p-p-3">
          <Outlet />
        </Panel>
      </main>
    </>
  );
}

export { App };
