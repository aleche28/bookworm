import { useContext } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import AuthContext from "./auth/AuthContext";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { logout } from "./auth/auth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<Signup />} />
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
    {user && 
      <>
        <h1>Authenticated</h1>
        <button onClick={handleLogout}>Logout</button>
      </> }
      
    {!user && 
      <>
        <h1>Not Authenticated</h1>
        <Link to="/login">Login</Link>
      </>
    }

    </>
  );
}

export default App;
