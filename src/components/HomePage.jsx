import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getList } from "../books";
import { Button, Container, Spinner } from "react-bootstrap";
import BookCard from "./BookCard";
import AuthContext from "../auth/AuthContext";

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
              <div className="book-cards-row">
                {readinglist.map((b, i) => (
                  <BookCard key={i} book={b} />
                ))}
                <Button as={Link} to={"/reading"} variant="success">
                  +
                </Button>
              </div>
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
              <div className="book-cards-row">
                {toreadlist.map((b, i) => (
                  <BookCard key={i} book={b} />
                ))}
                <Button as={Link} to={"/toread"} variant="success">
                  +
                </Button>
              </div>
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
              <div className="book-cards-row">
                {readlist.map((b, i) => (
                  <BookCard key={i} book={b} />
                ))}
                <Button as={Link} to={"/read"} variant="success">
                  +
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
