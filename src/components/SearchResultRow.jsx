import { Button, Col, Row } from "react-bootstrap";

const SearchResultRow = ({ book, handleSelected }) => {
  return (
    <>
      <Row className="book-row border rounded">
        <Col className="book-row-thumbnail">
          <img src={book.imageLinks?.thumbnail || ""} alt={book.title}></img>
        </Col>
        <Col className="book-row-title-author col-md-6">
          <Row className="book-row-title">{book.title}</Row>
          <Row className="book-row-author">{book.author}</Row>
        </Col>
        <Col>
          <Button variant="success" onClick={handleSelected}>
            <i className="bi bi-check-lg"></i>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default SearchResultRow;
