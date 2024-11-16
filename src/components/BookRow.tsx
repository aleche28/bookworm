import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getList, listTypes, updateList } from "../books";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Menu } from "primereact/menu";
import * as React from "react";
import { ListTypeKey } from "./BookList";
import { Book } from "../interfaces/Book";

interface BookRowProps {
  book: Book;
  id: number;
  list?: ListTypeKey;
  favoritesPage: boolean;
  handleDelete?: (id: number) => void;
  handleUpdate: (book: Book) => void;
  toggleEditBook?: () => void;
}

const BookRow = (props: BookRowProps) => {
  const { user } = useContext(AuthContext);
  const menu = React.useRef<any>(null);

  const moveToList = async (destList: ListTypeKey) => {
    if (!user || !user.uid) return;

    const list = await getList(user.uid, destList);
    await updateList(user.uid, destList, [...list, props.book]);

    if (props.handleDelete) {
      props.handleDelete(props.id);
    }
  };

  const updateFavorite = (favorite: boolean) => {
    props.handleUpdate({ ...props.book, favorite });
  };

  const menuItems = [
    {
      label: props.book.favorite ? "Remove from favorites" : "Add to favorites",
      icon: props.book.favorite ? "pi pi-heart-fill" : "pi pi-heart",
      command: () => updateFavorite(!props.book.favorite),
    },
    {
      label: "Edit book",
      icon: "pi pi-pencil",
      command: () => props.toggleEditBook && props.toggleEditBook(),
    },
    {
      label: "Remove book from list",
      icon: "pi pi-trash",
      command: () => props.handleDelete && props.handleDelete(props.id),
    },
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

  return (
    <div className="p-grid p-align-center book-row border-round p-shadow-1">
      <div className="p-col-fixed p-mr-2">
        <img
          src={props.book.imageLinks?.thumbnail || "sapiens-cover.jpeg"}
          alt={props.book.title}
          className="book-thumbnail"
        />
      </div>
      <div
        className={`p-col ${props.list === "read_books" ? "p-md-6" : "p-md-5"}`}
      >
        <div className="book-row-title">{props.book.title}</div>
        <div className="book-row-author">{props.book.author}</div>
      </div>

      {props.favoritesPage && (
        <div className="p-col p-text-right">{listTypes[props.book.list]}</div>
      )}

      <div className="p-col-fixed p-mx-1" id={`favorite-${props.id}`}>
        <Tooltip
          target={`#favorite-${props.id}`}
          content={
            props.book.favorite ? "Remove from favorites" : "Add to favorites"
          }
        />
        <Button
          icon={props.book.favorite ? "pi pi-heart-fill" : "pi pi-heart"}
          className={`p-button-rounded ${
            props.book.favorite ? "p-button-success" : "p-button-secondary"
          }`}
          onClick={() => updateFavorite(!props.book.favorite)}
        />
      </div>

      {!props.favoritesPage && props.list !== "read_books" && (
        <div className="p-col-fixed p-mx-1" id={`mark-read-${props.id}`}>
          <Tooltip target={`#mark-read-${props.id}`} content="Mark as read" />
          <Button
            icon="pi pi-check"
            className="p-button-rounded p-button-success"
            onClick={() => moveToList("read_books")}
          />
        </div>
      )}

      {!props.favoritesPage && (
        <>
          <div className="p-col-fixed p-mx-1" id={`remove-${props.id}`}>
            <Tooltip
              target={`#remove-${props.id}`}
              content="Remove from list"
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger"
              onClick={() => props.handleDelete && props.handleDelete(props.id)}
            />
          </div>

          <div className="p-col-fixed p-mx-1">
            <Button
              icon="pi pi-ellipsis-v"
              className="p-button-rounded p-button-secondary"
              onClick={(event) => menu.current.toggle(event)}
              aria-controls="book-menu"
              aria-haspopup
            />
            <Menu model={menuItems} popup ref={menu} id="book-menu" />
          </div>
        </>
      )}
    </div>
  );
};

export { BookRow };
