import { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { getList, listTypes, updateList } from "../books";
import {
  Button,
  Col,
  Dropdown,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

const BookRow = (props) => {
  const { user } = useContext(AuthContext);

  const tooltip = (sentence) => {
    return <Tooltip id="tooltip">{sentence}</Tooltip>;
  };

  const moveToList = async (destList) => {
    const list = await getList(user.uid, destList);
    await updateList(user.uid, destList, [...list, props.book]);

    props.handleDelete(props.id);
  };

  const updateFavorite = async (book) => {
    props.handleUpdate(book);
  };

  return (
    <>
      <Row className="book-row border rounded">
        <Col className="book-row-thumbnail">
          <img
            src={props.book.imageLinks.thumbnail}
            alt={props.book.title}
          ></img>
        </Col>
        <Col
          className={
            props.list === "read_books"
              ? "book-row-title-author col-md-6"
              : "book-row-title-author col-md-5"
          }
        >
          <Row className="book-row-title">{props.book.title}</Row>
          <Row className="book-row-author">{props.book.author}</Row>
        </Col>

        {props.favoritesPage && (
          <Col className="book-row-list">{listTypes[props.book.list]}</Col>
        )}

        <Col
          xs={1}
          aria-label={
            props.book.favorite ? "Remove from favorites" : "Add to favorites"
          }
          className="book-row-btn btn-collapse pl-1"
        >
          <OverlayTrigger
            placement="top"
            overlay={tooltip(
              props.book.favorite ? "Remove from favorites" : "Add to favorites"
            )}
          >
            {props.book.favorite ? (
              <svg
                className="favorite-heart-fill"
                onClick={() =>
                  updateFavorite({ ...props.book, favorite: false })
                }
                xmlns="http://www.w3.org/2000/svg"
                fill="green"
                height="32"
                width="32"
                viewBox="0 -960 960 960"
              >
                <path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" />
              </svg>
            ) : (
              <svg
                className="favorite-heart-empty"
                onClick={() =>
                  updateFavorite({ ...props.book, favorite: true })
                }
                xmlns="http://www.w3.org/2000/svg"
                fill="grey"
                height="32"
                width="32"
                viewBox="0 -960 960 960"
              >
                <path d="m480-121-41-37q-105.768-97.121-174.884-167.561Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.155 60.5-150.577Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.423Q880-733.155 880-643q0 46-16.5 91T806-451.5Q765-396 695.884-325.561 626.768-255.121 521-158l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712-426 750.5-476t54-89.135q15.5-39.136 15.5-77.72Q820-709 778-751.5T670.225-794q-51.524 0-95.375 31.5Q531-731 504-674h-49q-26-56-69.85-88-43.851-32-95.375-32Q224-794 182-751.5t-42 108.816Q140-604 155.5-564.5t54 90Q248-424 314-358t166 158Zm0-297Z" />
              </svg>
            )}
          </OverlayTrigger>
        </Col>

        {!props.favoritesPage && props.list !== "read_books" && (
          <Col xs={1} className="book-row-btn btn-collapse pl-1">
            <OverlayTrigger placement="top" overlay={tooltip("Mark as read")}>
              <Button
                aria-label="Mark as read"
                variant="success"
                onClick={() => {
                  moveToList("read_books");
                }}
              >
                <i className="bi bi-check-lg"></i>
              </Button>
            </OverlayTrigger>
          </Col>
        )}

        {!props.favoritesPage && (
          <>
            <Col
              xs={1}
              aria-label="Remove from list"
              className="book-row-btn btn-collapse pl-1"
            >
              <OverlayTrigger
                placement="top"
                overlay={tooltip("Remove from list")}
              >
                <Button
                  variant="danger"
                  onClick={() => props.handleDelete(props.id)}
                >
                  <i className="bi bi-trash3"></i>
                </Button>
              </OverlayTrigger>
            </Col>
            <Col xs={1} className="book-row-btn">
              <Dropdown>
                <Dropdown.Toggle /* variant="outline" */ id="dropdown-more-btn">
                  <i className="bi bi-three-dots-vertical"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {props.list !== "reading_books" && (
                    <Dropdown.Item
                      onClick={() => {
                        moveToList("reading_books");
                      }}
                    >
                      Mark as reading
                    </Dropdown.Item>
                  )}
                  {props.list !== "toread_books" && (
                    <Dropdown.Item
                      onClick={() => {
                        moveToList("toread_books");
                      }}
                    >
                      Mark as to read
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={props.toggleEditBook}>
                    Edit book
                  </Dropdown.Item>
                  {props.list !== "read_books" && (
                    <Dropdown.Item
                      id="toggle-entry"
                      onClick={() => {
                        moveToList("read_books");
                      }}
                    >
                      Mark as read
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    id="toggle-entry"
                    onClick={() =>
                      updateFavorite({
                        ...props.book,
                        favorite: !props.book.favorite,
                      })
                    }
                  >
                    {props.book.favorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="toggle-entry"
                    onClick={() => props.handleDelete(props.id)}
                  >
                    Remove book from list
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default BookRow;
