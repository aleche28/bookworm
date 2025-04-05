import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { AuthContext } from "../auth/AuthContext";
import { listTypes, getList } from "../books";
import { ListTypeKey } from "./BookList";
import { BookCard } from "./BookCard";
import { Book } from "../interfaces/Book";
import { Carousel } from "primereact/carousel";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [readlist, setReadlist] = useState<Book[]>([]);
  const [toreadlist, setToreadlist] = useState<Book[]>([]);
  const [readinglist, setReadinglist] = useState<Book[]>([]);

  const navigate = useNavigate();

  async function fetchList(
    listType: ListTypeKey,
    setList: (list: Book[]) => void
  ) {
    if (!user || !user.uid) return;

    try {
      const list = await getList(user.uid, listType);
      setList(list);
    } catch (err: unknown) {
      console.error(err);
      setList([]);
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
      fetchList("read_books", setReadlist);
      fetchList("reading_books", setReadinglist);
      fetchList("toread_books", setToreadlist);
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [user]);

  const chooseListFromType = (type: ListTypeKey) => {
    if (type === "read_books") return readlist;
    if (type === "toread_books") return toreadlist;
    return readinglist;
  };

  const bookTemplate = (b: Book) => {
    return <BookCard book={b} />;
  };

  const responsiveOptions = [
    {
      breakpoint: "1800px",
      numVisible: 6,
      numScroll: 6,
    },
    {
      breakpoint: "1600px",
      numVisible: 5,
      numScroll: 5,
    },
    {
      breakpoint: "1400px",
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: "1050px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "850px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "600px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  return (
    <>
      {user?.uid && (
        <div className="p-mt-4">
          <h1>Welcome back!</h1>
          {Object.entries(listTypes).map(([listType, listName], i) => (
            <div key={i} className="p-mb-4">
              <div className="p-text-bold p-mb-2">
                <h2>{listName as string}</h2>
                <Button
                  label="See all"
                  text
                  onClick={() =>
                    navigate(`/${listType.slice(0, -"_books".length)}`)
                  }
                />
              </div>
              {loading ? (
                <div className="p-d-flex p-jc-center p-my-5">
                  <ProgressSpinner />
                </div>
              ) : (
                <div className="p-grid p-align-center p-mb-3">
                  <Carousel
                    value={chooseListFromType(listType as ListTypeKey).slice(0, 10)}
                    numVisible={7}
                    numScroll={7}
                    responsiveOptions={responsiveOptions}
                    className="book-carousel"
                    // circular
                    itemTemplate={bookTemplate}
                    showIndicators={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export { HomePage };
