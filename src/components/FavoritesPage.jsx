import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Alert, Col } from "react-bootstrap";
import BookRow from "./BookRow";
import { getFavorites, getList, updateList } from "../books";

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

      {user && (
        <>
          <h2>Favorites</h2>
          {books.length > 0 ?
          <Col xs={6}>
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
          :
          <span>You don't have any favorite book yet.</span>}
        </>
      )}
    </>
  );
}

export default FavoritesPage;
