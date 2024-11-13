import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Spinner } from "react-bootstrap";
import { BookCard } from "./BookCard";
import { AuthContext } from "../auth/AuthContext";
import { listTypes, getList } from "../books";
import * as React from "react";
import { ListTypeKey } from "./BookList";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [readlist, setReadlist] = useState<Book[]>([]);
  const [toreadlist, setToreadlist] = useState<Book[]>([]);
  const [readinglist, setReadinglist] = useState<Book[]>([]);

  const navigate = useNavigate();

  async function fetchReadlist() {
    if (!user) {
      return;
    }
    try {
      const list = await getList(user.uid, "read_books");
      setReadlist(list);
    } catch (err) {
      setReadlist([]);
    }
  }

  async function fetchReadinglist() {
    if (!user) {
      return;
    }
    try {
      const list = await getList(user.uid, "reading_books");
      setReadinglist(list);
    } catch (err) {
      setReadinglist([]);
    }
  }

  async function fetchToreadlist() {
    if (!user) {
      return;
    }
    try {
      const list = await getList(user.uid, "toread_books");
      setToreadlist(list);
    } catch (err) {
      setToreadlist([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (!user) {
      setReadlist([]);
      setReadinglist([]);
      setToreadlist([]);
    } else if (!user.uid) {
      navigate("/login");
    } else {
      fetchReadlist();
      fetchReadinglist();
      fetchToreadlist();
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [user]);

  const chooseListFromType = (type: ListTypeKey) => {
    if (type === "read_books") return readlist;
    else if (type === "toread_books") return toreadlist;
    else if (type === "reading_books") return readinglist;
    else return [];
  };

  return (
    <>
      {user?.uid && (
        <>
          <h1>Welcome back!</h1>
          {Object.entries(listTypes).map(([listType, listName], i) => (
            <Container key={i} className="book-cards-container">
              <div className="book-cards-list-name">
                <h2>{listName}</h2>
              </div>
              {loading ? (
                <Container className="d-flex my-5 justify-content-left">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Container>
              ) : (
                <>
                  <div className="book-cards-row">
                    {chooseListFromType(listType as ListTypeKey).map((b, i) => (
                      <BookCard key={i} book={b} />
                    ))}
                    <Button
                      onClick={() => navigate(`/${listType.slice(0, -"_books".length)}`)}
                      variant="success"
                    >
                      +
                    </Button>
                  </div>
                </>
              )}
            </Container>
          ))}
        </>
      )}
    </>
  );
};

export { HomePage };
