import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext.jsx";
import { getList, listTypes, updateList } from "../books";
import { Alert, Button, Col, Container, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AddEditForm from "./AddEditForm.jsx";
import BookRow from "./BookRow.jsx";

const BookList = (props) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState(location.state?.infoMsg || "");
  const [books, setBooks] = useState([]);

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
  const handleDelete = async (index) => {
    const newlist = [];
    books.map((b, i) => {
      if (index !== i) newlist.push(b);
      return null;
    });
    await updateList(user.uid, props.listType, newlist);
    fetchBooks();
    setInfoMsg("Book removed from the list");
  };

  const handleUpdate = async (id, book, showMsg = true) => {
    // temp implementation: old book is deleted and new book is added
    const newlist = [];
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

export default BookList;
