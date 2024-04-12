import { StatusCodes } from "http-status-codes";
import connection from "../db.js";

export const allBooks = async (req, res) => {
  const { categoryId } = req.query;

  if (categoryId) {
    const sql = "SELECT * FROM `books` WHERE `category_id` = ?";
    const [books, _] = await connection.query(sql, [categoryId]);
    return res.status(200).json(books);
  }

  const sql = "SELECT * FROM `books`";
  const [books, _] = await connection.query(sql);
  return res.status(200).json(books);
};

export const bookDetail = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  const sql = "SELECT * FROM `books` WHERE `id` = ?";
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
