import { useContext, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import searchBook from "../utils/googleBooks";
import SearchResultRow from "./SearchResultRow";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { addToList } from "../books";
import AuthContext from "../auth/AuthContext";

const SearchBook = () => {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [results, setResults] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const listType =
    location.state?.listType || console.log("Error: listType not defined");

  const handleSave = async (selectedIndex) => {
    setIsLoading(true);

    let book = {
      id: uuidv4(),
      title: results[selectedIndex].title,
      author: results[selectedIndex].author,
      favorite: false,
      googleBooksId: results[selectedIndex].googleBooksId,
      imageLinks: results[selectedIndex].imageLinks || {},
      isbnCodes: results[selectedIndex].isbnCodes || {},
    };

    try {
      await addToList(user.uid, listType, book);
      const path = "/" + listType.split("_")[0];
      navigate(path, {
        state: { infoMsg: "Book successfully added to the list!" },
      });
    } catch (err) {
      setErrMsg("An error occurred while trying to add the book!");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoogleBooks = async () => {
    setIsLoading(true);
    const res = await searchBook(title, author, isbn);
    if (!res.error) {
      setResults(res);
    } else {
      console.log(res.error);
      setResults([]);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Form>
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
              disabled={!title && !author && !isbn}
              variant="outline-secondary"
              onClick={() => {
                fetchGoogleBooks();
              }}
            >
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
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
        <Form.Group className="mb-3 mt-3" controlId="formGroupIsbn">
          <Form.Label>ISBN</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(ev) => {
              setIsbn(ev.target.value);
            }}
          />
        </Form.Group>
      </Form>
      {errMsg && (
        <Alert variant="danger" dismissible onClose={() => setErrMsg("")}>
          {errMsg}
        </Alert>
      )}
      <Container>
        {isLoading && <Spinner variant="success" />}
        {!isLoading &&
          results.map((b, i) => (
            <SearchResultRow
              key={i}
              book={b}
              handleSelected={() => handleSave(i)}
            />
          ))}
      </Container>
    </>
  );
};

export default SearchBook;
