import { StatusCodes } from "http-status-codes";
import connection from "../db.js";

const isLikedFieldSQL = `
  IF(
    EXISTS (
      SELECT *
      FROM book_user_likes 
      WHERE 
        books.id = book_user_likes.book_id AND
        book_user_likes.user_id = ?
    ), TRUE, FALSE
  ) AS is_liked,
`;

export const books = async (req, res) => {
  const { userId } = req;
  const { categoryId, latest, page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;

  const SQL = `
    SELECT
      SQL_CALC_FOUND_ROWS
      books.*,
      (SELECT count(*) FROM book_user_likes WHERE books.id = book_user_likes.book_id) AS like_count,
      ${userId ? isLikedFieldSQL : ""}
      book_categories.name as category_name
    FROM books
    LEFT JOIN book_categories ON books.category_id = book_categories.id
    WHERE TRUE
    ${categoryId ? `AND category_id = ?` : ""}
    ${
      latest
        ? `AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`
        : ""
    }
    LIMIT ? OFFSET ?
  `;

  const queryValues = [];
  if (userId) {
    queryValues.push(userId);
  }
  if (categoryId) {
    queryValues.push(categoryId);
  }
  queryValues.push(size, offset);

  const [books] = await connection.query(SQL, queryValues);

  const [foundRowsResult] = await connection.query("SELECT FOUND_ROWS()");
  const totalElements = foundRowsResult[0]["FOUND_ROWS()"];

  const apiResult = {
    data: books,
    pagination: {
      page: parseInt(page),
      size: parseInt(size),
      totalElements,
      totalPages: Math.ceil(totalElements / size),
    },
  };

  return res.status(StatusCodes.OK).json(apiResult);
};

export const bookDetail = async (req, res) => {
  const { userId } = req;
  let { id } = req.params;
  id = parseInt(id);

  const SQL = `
    SELECT 
      books.*,
      (SELECT count(*) FROM book_user_likes WHERE books.id = book_user_likes.book_id) AS like_count,
      ${userId ? isLikedFieldSQL : ""}
      book_categories.name as category_name
    FROM books
    LEFT JOIN book_categories ON books.category_id = book_categories.id
    WHERE books.id = ?
  `;

  const queryValues = [];
  if (userId) {
    queryValues.push(userId);
  }
  queryValues.push(id);

  const [book] = await connection.query(SQL, queryValues);

  if (book.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "책이 존재하지 않습니다." });
  }

  return res.status(StatusCodes.OK).json(book[0]);
};

export const allBookCategories = async (req, res) => {
  const SQL = "SELECT * FROM `book_categories`";
  const [bookCategories] = await connection.query(SQL);

  return res.status(StatusCodes.OK).json(bookCategories);
};

export const toggleBookLike = async (req, res) => {
  try {
    const { userId } = req;
    const { id: bookId } = req.params;

    const SELECT_BOOK_SQL = "SELECT * FROM books WHERE id = ?";
    const [book] = await connection.query(SELECT_BOOK_SQL, [bookId]);

    if (book.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 책입니다." });
    }

    const SELECT_BOOK_USER_LIKE_SQL =
      "SELECT * FROM book_user_likes WHERE user_id = ? and book_id = ?";
    const [bookUserLike] = await connection.query(SELECT_BOOK_USER_LIKE_SQL, [
      userId,
      bookId,
    ]);

    if (bookUserLike.length < 1) {
      const INSERT_BOOK_SQL =
        "INSERT INTO book_user_likes (user_id, book_id) VALUES (?, ?)";
      await connection.query(INSERT_BOOK_SQL, [userId, bookId]);
      return res.status(StatusCodes.OK).json({ isLiked: true });
    }

    const DELETE_BOOK_SQL =
      "DELETE FROM book_user_likes WHERE user_id = ? and book_id = ?";
    await connection.query(DELETE_BOOK_SQL, [userId, bookId]);
    return res.status(StatusCodes.OK).json({ isLiked: false });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};
