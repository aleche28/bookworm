import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext.jsx";
import { Alert, Col, Container, Spinner } from "react-bootstrap";
import BookRow from "./BookRow.jsx";
import { getFavorites, getList, updateList } from "../books";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [books, setBooks] = useState([]);

  const navigate = useNavigate();

  async function fetchBooks() {
    setLoading(true);
    if (!user) {
      setBooks([]);
    } else if (!user.uid) {
      navigate("/login");
    } else {
      try {
        const list = await getFavorites(user.uid);
        setErrMsg("");
        setBooks(list);
      } catch (err) {
        setErrMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [user]);

  async function handleUpdate(book) {
    const list = await getList(user.uid, book.list); // list from where the book is located (to read, read, reading)
    const newlist = [];
    list.map((b) => {
      if (b.id !== book.id) newlist.push(b);
      else newlist.push(book);
      return null;
    });
    await updateList(user.uid, book.list, newlist);
    fetchBooks();
  }

  return (
    <>
      {errMsg && (
        <Alert
          key={"danger"}
          variant="danger"
          onClose={() => setErrMsg("")}
          dismissible
        >
          {errMsg}
        </Alert>
      )}
      {infoMsg && (
        <Alert
          key={"success"}
          variant="success"
          onClose={() => setInfoMsg("")}
          dismissible
        >
          {infoMsg}
        </Alert>
      )}

      {user?.uid && (
        <>
          <h2>Favorites</h2>
          {loading ? (
            <Container className="d-flex my-5 justify-content-left">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Container>
          ) : (
            <>
              {books.length > 0 ? (
                <Col lg={8} className="book-rows-container">
                  {books.map((b, i) => (
                    <BookRow
                      key={i}
                      id={i}
                      book={b}
                      favoritesPage={true}
                      setErrMsg={setErrMsg}
                      handleUpdate={handleUpdate}
                    />
                  ))}
                </Col>
              ) : (
                <span>You don't have any favorite book yet.</span>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default FavoritesPage;
