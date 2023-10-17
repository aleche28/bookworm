import { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { getList, updateList } from "../books";
import { Button, Col, Dropdown, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

const BookRow = (props) => {
  const { user } = useContext(AuthContext);

  const tooltip = (sentence) => {
    return (
    <Tooltip id="tooltip">
      {sentence}
    </Tooltip>
    );
  };

  const moveToList = async (destList) => {
    const list = await getList(user.uid, destList);
    await updateList(user.uid, destList, [...list, props.book])
    
    props.handleDelete(props.id);
  }

  return <>
    <Row className="book-row my-3 py-3 ps-5 pe-5 border rounded">
      <Col xs={4}>{props.book.title}</Col>
      <Col xs={4}>{props.book.author}</Col>
      
      {props.list !== "Read" &&
        <Col xs={1} className="book-row-btn pl-1">
          <OverlayTrigger placement="top" overlay={tooltip("Mark as read")}>
            <Button aria-label="Mark as read" variant="success" onClick={() => { moveToList("read_books") }}>
              <i className="bi bi-check-lg"></i>
            </Button>
          </OverlayTrigger>
        </Col>}

      {/* at the moment the edit function has been moved into the dropdown */}
      {/* <Col xs={1} className="book-row-btn pl-1">
        <OverlayTrigger placement="top" overlay={tooltip("Edit book")}>
          <Button aria-label="Edit book" onClick={() => {}}>
            <i className="bi bi-pencil-fill"></i>
          </Button>
        </OverlayTrigger>
      </Col> */}

      <Col xs={1} aria-label="Remove from list" className="book-row-btn pl-1">
        <OverlayTrigger placement="top" overlay={tooltip("Remove from list")}>
          <Button variant="danger" onClick={() => props.handleDelete(props.id)}>
            <i className="bi bi-trash3"></i>
          </Button>
        </OverlayTrigger>
      </Col>
      <Col xs={1} className="book-row-btn">
        <Dropdown>
          <Dropdown.Toggle variant="outline" id="dropdown-more">
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {/* {props.list !== "Read" &&
              <Dropdown.Item onClick={() => {}}>Mark as read</Dropdown.Item>} */}
            {props.list !== "Reading" &&
            <Dropdown.Item onClick={() => { moveToList("reading_books") }}>Mark as reading</Dropdown.Item>}
            {props.list !== "To read" &&
            <Dropdown.Item onClick={() => { moveToList("toread_books") }}>Mark as to read</Dropdown.Item>}
            <Dropdown.Item onClick={props.toggleEditBook}>Edit book</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  </>;
}

export default BookRow;