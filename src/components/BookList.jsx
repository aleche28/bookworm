import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { getList, updateList } from "../books";
import { Alert, Button, Form } from "react-bootstrap";


const BookList = (props) => {
  const { user } = useContext(AuthContext);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [books, setBooks] = useState([]);

  async function fetchBooks() {
    if (user) {
      try {
        const list = await getList(user.uid, props.listType);
        setErrMsg("");
        setBooks(list);
      } catch(err) {
        setErrMsg(err.message);
      }
    }
  }

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [user]);

  const handleAdd = async (title, author) => {
    const book = { title: title, author: author };
    await updateList(user.uid, props.listType, [...books, book]);

    fetchBooks();
  }

  return <>
    {errMsg && <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}
    {infoMsg && <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}
    
    <h2>{props.listName}</h2>
    {books.map(b => <p>title: {b.title}, author: {b.author} </p>)}
    
    <AddBookForm handleAdd={handleAdd}/>

  </>;
};

const AddBookForm = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  
  const handleAdd = (event) => {
    event.preventDefault();
    props.handleAdd(title, author);
  }

  return <>
    {<Form onSubmit={handleAdd}>
      <Form.Group className="mb-3 mt-3" controlId="formGroupTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Title"
          value={title}
          onChange={(ev) => {
            setTitle(ev.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3 mt-3" controlId="formGroupAuthor">
        <Form.Label>Author</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Author"
          value={author}
          onChange={(ev) => {
            setAuthor(ev.target.value);
          }}
        />
      </Form.Group>
      <div className="d-grid gap-2">
        <Button className="mb-3 mt-3" variant="primary" type="submit">
          Add
        </Button>
      </div>
    </Form>}
  </>;
}

export default BookList;