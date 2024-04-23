import { StatusCodes } from "http-status-codes";
import connection from "../db.js";

export const allBooks = async (req, res) => {
  const { userId } = req;
  const { categoryId, latest, page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;

  const isLikedField = `
    IF(
      EXISTS (
        SELECT *
        FROM book_user_likes 
        WHERE 
          books.id = book_user_likes.book_id AND
          book_user_likes.user_id = ${userId}
      ), TRUE, FALSE
    ) AS is_liked,
  `;
  let sql = `
    SELECT
      SQL_CALC_FOUND_ROWS
      books.*,
      (SELECT count(*) FROM book_user_likes WHERE books.id = book_user_likes.book_id) AS like_count,
      ${userId ? isLikedField : ""}
      book_categories.name as category_name
    FROM books
    LEFT JOIN book_categories ON books.category_id = book_categories.id
    WHERE TRUE
  `;

  if (categoryId) {
    sql += ` AND category_id = ${categoryId}`;
  }

  if (latest) {
    sql += ` AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  }

  sql += ` LIMIT ${size} OFFSET ${offset}`;

  const [books] = await connection.query(sql);

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

  return res.status(200).json(apiResult);
};

export const bookDetail = async (req, res) => {
  const { userId } = req;
  let { id } = req.params;
  id = parseInt(id);

  const isLikedField = `
  IF(
    EXISTS (
      SELECT *
      FROM book_user_likes 
      WHERE 
        books.id = book_user_likes.book_id AND
        book_user_likes.user_id = ${userId}
    ), TRUE, FALSE
  ) AS is_liked,
`;
  const sql = `
    SELECT 
      books.*,
      (SELECT count(*) FROM book_user_likes WHERE books.id = book_user_likes.book_id) AS like_count,
      ${userId ? isLikedField : ""}
      book_categories.name as category_name
    FROM books
    LEFT JOIN book_categories ON books.category_id = book_categories.id
    WHERE books.id = ${id}
  `;
  const [results] = await connection.query(sql);

  if (results.length > 0) {
    return res.status(StatusCodes.OK).json(results[0]);
  } else {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "책이 존재하지 않습니다." });
  }
};

export const allBookCategories = async (req, res) => {
  const sql = "SELECT * FROM `book_categories`";
  const [bookCategories] = await connection.query(sql);
  return res.status(StatusCodes.OK).json(bookCategories);
};

export const toggleBookLike = async (req, res) => {
  try {
    const { userId } = req;
    const { id: bookId } = req.params;

    const BOOK_SQL = `SELECT * FROM books WHERE id = ${bookId}`;
    const [book] = await connection.query(BOOK_SQL);

    if (book.length < 1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 책입니다." });
    }

    const LIKE_SQL = `SELECT * FROM book_user_likes WHERE user_id = "${userId}" and book_id = "${bookId}"`;
    const [bookUserLike] = await connection.query(LIKE_SQL);

    if (bookUserLike.length < 1) {
      const INSERT_SQL = `INSERT INTO book_user_likes (book_id, user_id) VALUES (${bookId}, ${userId})`;
      await connection.query(INSERT_SQL);
      return res.status(StatusCodes.OK).json({ isLike: true });
    }

    const DELETE_SQL = `DELETE FROM book_user_likes WHERE user_id = "${userId}" and book_id = "${bookId}"`;
    await connection.query(DELETE_SQL);
    return res.status(StatusCodes.OK).json({ isLike: false });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};
