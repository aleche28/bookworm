import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getList, listTypes, updateList } from "../books";
import { Alert, Button, Col, Container, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AddEditForm } from "./AddEditForm";
import { BookRow } from "./BookRow";
import * as React from "react";

type ListTypeKey = "toread_books" | "read_books" | "reading_books";

interface BookListProps {
  listType: ListTypeKey,
  listName: string
}

const BookList = (props: BookListProps) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState<string>(location.state?.infoMsg || "");
  const [books, setBooks] = useState<Book[]>([]);

  const [editBook, setEditBook] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  async function fetchBooks() {
    setLoading(true);
    if (!user) {
      setBooks([]);
    } else if (!user.uid) {
      navigate("/login");
    } else {
      try {
        const list = await getList(user.uid, props.listType);
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
  }, [user, location]);

  // TODO: Update this to delete based on book uuid and not based on book position
  const handleDelete = async (index: number) => {
    if (!user) {
      return;
    }
    const newlist: Book[] = [];
    books.map((b, i) => {
      if (index !== i) newlist.push(b);
      return null;
    });
    await updateList(user.uid, props.listType, newlist);
    fetchBooks();
    setInfoMsg("Book removed from the list");
  };

  const handleUpdate = async (id: number, book: Book, showMsg = true) => {
    if (!user) {
      return;
    }
    // temp implementation: old book is deleted and new book is added
    const newlist: Book[] = [];
    books.map((b, i) => {
      if (id !== i) newlist.push(b);
      else newlist.push(book);
      return null;
    });
    setEditBook(false);
    setEditIndex(-1);
    await updateList(user.uid, props.listType, newlist);
    fetchBooks();
    if (showMsg) setInfoMsg("Book updated!");
  };

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

      {loading && (
        <Col lg={10}>
          <Container className="d-flex my-5 justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        </Col>
      )}

      {user?.uid && !loading && (
        <>
          <h2 className="list-name">{listTypes[props.listType]}</h2>
          <Col lg={10} className="book-rows-container">
            {books.map((b, i) => {
              if (editBook && editIndex === i)
                return (
                  <Container
                    key={i}
                    className="book-add-form my-3 py-3 px-5 border rounded"
                  >
                    <AddEditForm
                      edit={true}
                      handleUpdate={(book) => handleUpdate(i, book)}
                      cancelEditBook={() => {
                        setEditBook(false);
                        setEditIndex(-1);
                      }}
                      book={b}
                    />
                  </Container>
                );
              else
                return (
                  <BookRow
                    key={i}
                    id={i}
                    book={b}
                    list={props.listType}
                    favoritesPage={false}
                    handleDelete={handleDelete}
                    handleUpdate={(book) => handleUpdate(i, book, false)}
                    toggleEditBook={() => {
                      setEditIndex(i);
                      setEditBook(true);
                    }}
                  />
                );
            })}

            <Button
              variant="success"
              onClick={() =>
                navigate("/search", {
                  state: { listType: props.listType },
                })
              }
            >
              <i className="bi bi-plus"></i>
            </Button>
          </Col>
        </>
      )}
    </>
  );
};

export { BookList, ListTypeKey };
