import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Alert, Col } from "react-bootstrap";
import BookRow from "./BookRow";
import { getFavorites } from "../books";

function FavoritesPage(props) {
  const { user } = useContext(AuthContext);

  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [books, setBooks] = useState([]);

  async function fetchBooks() {
    if (user) {
      try {
        const list = await getFavorites(user.uid);
        setErrMsg("");
        setBooks(list);
      } catch (err) {
        setErrMsg(err.message);
      }
    } else {
      setBooks([]);
      setErrMsg("Please login to see this page.");
    }
  }

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [user]);

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

      {user && (
        <>
          <h2>Favorites</h2>
          <Col xs={6}>
            {books.map((b, i) => (
              <BookRow
                key={i}
                id={i}
                book={b}
                favoritesPage={true}
                setErrMsg={setErrMsg}
              />
            ))}
          </Col>
        </>
      )}
    </>
  );
}

export default FavoritesPage;
