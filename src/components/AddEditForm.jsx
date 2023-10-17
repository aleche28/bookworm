import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const AddEditForm = (props) => {
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
        <Row>
          <Col xs={2}></Col>
          <Button className="col-3 mb-3 mt-3" variant="success" type="submit">
            Add
          </Button>
          <Col xs={2}></Col>
          <Button className="col-3 mb-3 mt-3" variant="secondary" onClick={() => props.setAddBook(false)}>
            Cancel
          </Button>
        </Row>
    </Form>}
  </>;
}

export default AddEditForm;