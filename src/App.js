import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import AuthContext from "./auth/AuthContext";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";
import { logout } from "./auth/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getList, updateList } from "./books";

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

  const [readlist, setReadlist] = useState([]);
  const [toreadlist, setToreadlist] = useState([]);
  const [readinglist, setReadinglist] = useState([]);

  async function fetchReadlist() {
    if (user) {
      try {
        const list = await getList(user.uid, "read_books");
        setReadlist(list);
      } catch(err) {
        setReadlist([]);
      }
    } else {
      setReadlist([]);
    }
  }

  async function fetchReadinglist() {
    if (user) {
      try {
        const list = await getList(user.uid, "reading_books");
        setReadinglist(list);
      } catch(err) {
        setReadinglist([]);
      }
    } else {
      setReadinglist([]);
    }
  }

  async function fetchToreadlist() {
    if (user) {
      try {
        const list = await getList(user.uid, "toread_books");
        setToreadlist(list);
      } catch(err) {
        setToreadlist([]);
      }
    } else {
      setToreadlist([]);
    }
  }

  useEffect(() => {
    fetchReadlist();
    fetchReadinglist();
    fetchToreadlist();
    // eslint-disable-next-line
  },[user]);

  const handleLogout = async () => {
    await logout();
  };

  /* TEMP: just to test updateList */
  const handleAdd = async (list) => {
    const book = { title: "newbook", author: "newauthor" };
    let newList = [];
    switch (list) {
      case "reading_books":
        newList = [...readinglist, book];
        break;
      case "toread_books":
        newList = [...toreadlist, book];
        break;
      case "read_books":
        newList = [...readlist, book];
        break;
      default:
        break;
    }
    await updateList(user.uid, list, newList);
  }

  return (
    <>
    {user && 
      <>
        <h1>Authenticated</h1>
        <h2>Reading now</h2>
        {readinglist.map(b => <p>title: {b.title}, author: {b.author} </p>)}
        <button onClick={()=>handleAdd("reading_books")}>Add book reading</button>
        <h2>To read</h2>
        {toreadlist.map(b => <p>title: {b.title}, author: {b.author} </p>)}
        <button onClick={()=>handleAdd("toread_books")}>Add book to read</button>
        <h2>Read books</h2>
        {readlist.map(b => <p>title: {b.title}, author: {b.author} </p>)}
        <button onClick={()=>handleAdd("read_books")}>Add read book</button>

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
