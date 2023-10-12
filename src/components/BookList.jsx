import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { getList, updateList } from "../books";
import { Alert, Button, Col, Container, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";


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
    
    <h2>{props.listName}</h2>
    <Container className="col-md-8 justify-content-left">
      {books.map((b, i) => <BookRow key={i} id={i} book={b} handleDelete={handleDelete}/>)}
      <Container className="book-add-form my-3 py-3 px-5 border rounded">
        <AddBookForm handleAdd={handleAdd}/>
      </Container>
    </Container>

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
      {/* <div className="d-grid gap-2"> */}
        <Row>
          <Col xs={4}></Col>
          <Button as={Col} xs={4} className="mb-3 mt-3" variant="success" type="submit">
            Add
          </Button>
        </Row>
      {/* </div> */}
    </Form>}
  </>;
}

const BookRow = (props) => {
  const tooltip = (sentence) => {
    return (
    <Tooltip id="tooltip">
      {sentence}
    </Tooltip>
    );
  };

  return <>
    <Row className="book-row my-3 py-3 ps-5 pe-5 border rounded">
      <Col xs={4}>{props.book.title}</Col>
      <Col xs={4}>{props.book.author}</Col>
      <Col xs={1} className="book-row-btn pl-1">
        <OverlayTrigger placement="top" overlay={tooltip("Mark as read")}>
          <Button aria-label="Mark as read" variant="success" onClick={() => {}}>
            <i className="bi bi-check-lg"></i>
          </Button>
        </OverlayTrigger>
      </Col>
      <Col xs={1} className="book-row-btn pl-1">
        <OverlayTrigger placement="top" overlay={tooltip("Edit book")}>
          <Button aria-label="Edit book" onClick={() => {}}>
            <i className="bi bi-pencil-fill"></i>
          </Button>
        </OverlayTrigger>
      </Col>
      <Col xs={1} aria-label="Remove from list" className="book-row-btn pl-1">
        <OverlayTrigger placement="top" overlay={tooltip("Remove from list")}>
          <Button variant="danger" onClick={() => props.handleDelete(props.id)}>
            <i className="bi bi-trash3"></i>
          </Button>
        </OverlayTrigger>
      </Col>
      <Col className="book-row-btn">
        <Button variant="outline">
          <i className="bi bi-three-dots-vertical"></i>
        </Button>
      </Col>
    </Row>
  </>;
}

export default BookList;