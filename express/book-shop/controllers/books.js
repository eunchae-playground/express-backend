import { StatusCodes } from "http-status-codes";
import connection from "../db.js";

export const allBooks = async (req, res) => {
  const { categoryId, latest, page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;

  let sql = `
    SELECT books.*, book_categories.name as category_name
    FROM books
    LEFT JOIN book_categories ON books.category_id = book_categories.id
    WHERE TRUE
  `;
  const queryValues = [];

  if (categoryId) {
    sql += "AND `category_id` = ?";
    queryValues.push(categoryId);
  }

  if (latest) {
    sql += "AND `pub_date` BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += `LIMIT ${size} OFFSET ${offset}`;
  console.log(sql);

  const [books, _] = await connection.query(sql, queryValues);
  return res.status(200).json(books);
};

export const bookDetail = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  const sql = `
    SELECT books.*, book_categories.name as category_name
    FROM books
    LEFT JOIN book_categories ON books.category_id = book_categories.id
    WHERE books.id = ?
  `;
  const [results, _] = await connection.query(sql, [id]);

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
  const [bookCategories, _] = await connection.query(sql);
  return res.status(200).json(bookCategories);
};
