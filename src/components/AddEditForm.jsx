import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const AddEditForm = (props) => {
  const [title, setTitle] = useState(props.book?.title || "");
  const [author, setAuthor] = useState(props.book?.author || "");
  
  const handleSave = (event) => {
    event.preventDefault();
    props.edit ? 
      props.handleUpdate({title, author}) :
      props.handleAdd(title, author);
  }

  return <>
    {<Form onSubmit={handleSave}>
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
            Save
          </Button>
          <Col xs={2}></Col>
          <Button className="col-3 mb-3 mt-3" variant="secondary" onClick={() => props.edit ? props.cancelEditBook() : props.setAddBook(false)}>
            Cancel
          </Button>
        </Row>
    </Form>}
  </>;
}

export default AddEditForm;