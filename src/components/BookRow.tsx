import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getList, listTypes, updateList } from "../books";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Menu } from "primereact/menu";
import { ListTypeKey } from "./BookList";
import { Book } from "../interfaces/Book";
import { Card } from "primereact/card";

interface BookRowProps {
  book: Book;
  id: number;
  list?: ListTypeKey;
  showBookListTag: boolean;
  showFavoriteButton?: boolean;
  handleRemoveFromList?: (id: number) => void;
  handleUpdate: (book: Book) => void;
  toggleEditBook?: () => void;
}

const BookRow = (props: BookRowProps) => {
  const { user } = useContext(AuthContext);
  const menu = useRef<Menu>(null);

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 768px)")
      .addEventListener("change", (e) => setIsMobile(e.matches));
  }, []);

  const moveToList = async (destList: ListTypeKey) => {
    if (!user || !user.uid) return;

    const book = props.book;
    if (book.id === undefined) {
      delete book.id;
    }
    delete book.list;
    const list = await getList(user.uid, destList);
    await updateList(user.uid, destList, [...list, props.book]);

    if (props.handleRemoveFromList) {
      props.handleRemoveFromList(props.id);
    }
  };

  const updateFavorite = (favorite: boolean) => {
    props.handleUpdate({ ...props.book, favorite });
  };

  const menuItems = [
    ...(props.list !== "reading_books"
      ? [
          {
            label: "Mark as reading",
            icon: "pi pi-book",
            command: () => moveToList("reading_books"),
          },
        ]
      : []),
    ...(props.list !== "toread_books"
      ? [
          {
            label: "Mark as to read",
            icon: "pi pi-bookmark",
            command: () => moveToList("toread_books"),
          },
        ]
      : []),
    ...(props.list !== "read_books"
      ? [
          {
            label: "Mark as read",
            icon: "pi pi-check",
            command: () => moveToList("read_books"),
          },
        ]
      : []),
  ];

  if (props.handleRemoveFromList) {
    menuItems.push({
      label: "Remove book from list",
      icon: "pi pi-trash",
      command: () => {
        props.handleRemoveFromList?.(props.id);
        return Promise.resolve();
      },
    });
  }

  if (props.showFavoriteButton) {
    menuItems.push({
      label: props.book.favorite ? "Remove from favorites" : "Add to favorites",
      icon: props.book.favorite ? "pi pi-heart-fill" : "pi pi-heart",
      command: () => {
        updateFavorite(!props.book.favorite);
        return Promise.resolve();
      },
    });
  }

  return (
    <Card
      title={isMobile ? props.book.title : undefined}
      subTitle={isMobile ? props.book.author : undefined}
      className="p-0 m-1"
    >
      <div className="book-row">
        <img
          src={props.book.imageLinks?.thumbnail || "sapiens-cover.jpeg"}
          alt={props.book.title}
          className="book-row-thumbnail"
        />

        {!isMobile && (
          <div className="px-4">
            <div className="book-row-title">{props.book.title}</div>
            <div className="book-row-author">{props.book.author}</div>
          </div>
        )}

        {props.showBookListTag && props.book.list && (
          <Tag value={listTypes[props.book.list]} />
        )}

        {props.showFavoriteButton && (
          <div className="p-col-fixed p-mx-1" id={`favorite-${props.id}`}>
            <Button
              icon={props.book.favorite ? "pi pi-heart-fill" : "pi pi-heart"}
              rounded
              text
              severity={props.book.favorite ? "success" : "secondary"}
              onClick={() => updateFavorite(!props.book.favorite)}
            />
          </div>
        )}

        <div className="p-col-fixed p-mx-1">
          <Button
            icon="pi pi-ellipsis-v"
            rounded
            text
            severity="secondary"
            onClick={(event) => menu.current?.toggle(event)}
          />
          <Menu model={menuItems} popup ref={menu} id="book-menu" />
        </div>
      </div>
    </Card>
  );
};

export { BookRow };
