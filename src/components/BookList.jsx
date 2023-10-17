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
  const [editBook, setEditBook] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

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

  const handleUpdate = async (id, book) => {
    // temp implementation: old book is deleted and new book is added
    const newlist = [];
    books.map((b, i) => {
      if (id !== i)
        newlist.push(b);
      else
        newlist.push(book);
      return null;
    });
    setEditBook(false);
    setEditIndex(-1);
    await updateList(user.uid, props.listType, newlist);
    fetchBooks();
    setInfoMsg("Book updated!");
  }

  return <>
    {errMsg && <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}
    {infoMsg && <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}
    
    {user &&
    <>
      <h2>{props.listName}</h2>
      <Col xs={6}>
        {books.map((b, i) => {
          if (editBook && editIndex === i)
            return <Container key={i} className="book-add-form my-3 py-3 px-5 border rounded">
              <AddEditForm edit={true} handleAdd={handleAdd} handleUpdate={(book) => handleUpdate(i, book)} cancelEditBook={() => { setEditBook(false); setEditIndex(-1); }} book={b} />
            </Container>
          else
            return <BookRow key={i} id={i} book={b} handleDelete={handleDelete} list={props.listName} toggleEditBook={() => { setEditIndex(i); setAddBook(false); setEditBook(true); } } />})}

        {addBook ?
          <Container className="book-add-form my-3 py-3 px-5 border rounded">
            <AddEditForm handleAdd={handleAdd} setAddBook={setAddBook} />
          </Container>
          :
          <Button variant="success" onClick={() => { setEditBook(false); setAddBook(true); }}><i className="bi bi-plus"></i></Button>}
      </Col>
    </>}
  </>;
};

export default BookList;