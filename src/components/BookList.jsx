import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { getList, updateList } from "../books";
import { Alert, Button, Col, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import AddEditForm from "./AddEditForm";
import BookRow from "./BookRow";

const BookList = (props) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [books, setBooks] = useState([]);

  const [addBook, setAddBook] = useState(false);

  async function fetchBooks() {
    if (user) {
      try {
        const list = await getList(user.uid, props.listType);
        setErrMsg("");
        setBooks(list);
      } catch(err) {
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
  }, [user, location]);

  const handleAdd = async (title, author) => {
    const book = { title: title, author: author };
    await updateList(user.uid, props.listType, [...books, book]);
    setAddBook(false);
    fetchBooks();
    setInfoMsg("Book added to the list");
  }

  const handleDelete = async (id) => {
    const newlist = [];
    books.map((b, i) => {
      if (id !== i)
        newlist.push(b);
      return null;
    });
    await updateList(user.uid, props.listType, newlist);
    fetchBooks();
    setInfoMsg("Book removed from the list");
  }

  return <>
    {errMsg && <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}
    {infoMsg && <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}
    
    {user &&
    <>
      <h2>{props.listName}</h2>
      <Col xs={6}>
        {books.map((b, i) => <BookRow key={i} id={i} book={b} handleDelete={handleDelete} list={props.listName}/>)}
        {addBook ?
          <Container className="book-add-form my-3 py-3 px-5 border rounded">
            <AddEditForm handleAdd={handleAdd} setAddBook={setAddBook}/>
          </Container>
          :
          <Button variant="success" onClick={() => setAddBook(true)}><i className="bi bi-plus"></i></Button>}
      </Col>
    </>}
  </>;
};

export default BookList;