import { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import searchBook from "../utils/googleBooks";

const AddEditForm = (props) => {
  const [title, setTitle] = useState(props.book?.title || "");
  const [author, setAuthor] = useState(props.book?.author || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [googleBooks, setGoogleBooks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSave = (event) => {
    event.preventDefault();
    let book = {
      ...props.book, // edited fields will be overwritten
      title,
      author,
      favorite: props.book?.favorite || false,
    };

    if (selectedIndex !== -1) {
      const { googleBooksId, imageLinks } = googleBooks[selectedIndex];
      book.googleBooksId = googleBooksId;
      imageLinks && (book.imageLinks = imageLinks); // if imageLinks is undefined, the field is not added to the object
    }

    props.edit ? props.handleUpdate(book) : props.handleAdd(book);
  };

  const fetchGoogleBooks = async () => {
    setSelectedIndex(-1);
    const res = await searchBook(title, author);
    if (!res.error) setGoogleBooks(res);
    else setGoogleBooks([]);
  };

  const handleSelectChange = (event) => {
    event.preventDefault();
    const selectedOption = event.target.value;
    setSelectedIndex(selectedOption);
    const selectedBook = googleBooks[selectedOption];
    setTitle(selectedBook.title);
    setAuthor(selectedBook.author);
  };

  return (
    <>
      {
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3 mt-3" controlId="formGroupTitle">
            <Form.Label>Title</Form.Label>
            <InputGroup>
              <Form.Control
                required
                type="text"
                placeholder="Title"
                value={title}
                onChange={(ev) => {
                  setTitle(ev.target.value);
                }}
              />
              <Button
                disabled={!title}
                variant="outline-secondary"
                onClick={() => {
                  fetchGoogleBooks();
                  setShowDropdown(true);
                }}
              >
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form.Group>
          {showDropdown && (
            <Form.Control
              as="select"
              aria-label="Select book from Google books"
              defaultValue={selectedIndex}
              onChange={handleSelectChange}
            >
              {/* <option value={"|"}>Select the corresponding book</option> */}
              {googleBooks.map((b, i) => (
                <option key={i} value={i}>
                  {b.title} - {b.author}
                </option>
              ))}
            </Form.Control>
          )}

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
            <Button
              disabled={!title || !author}
              className="col-3 mb-3 mt-3"
              variant="success"
              type="submit"
            >
              Save
            </Button>
            <Col xs={2}></Col>
            <Button
              className="col-3 mb-3 mt-3"
              variant="secondary"
              onClick={() =>
                props.edit ? props.cancelEditBook() : props.setAddBook(false)
              }
            >
              Cancel
            </Button>
          </Row>
        </Form>
      }
    </>
  );
};

export default AddEditForm;
