import isEmptyArray from "../utils/isEmptyArray.js";

const bookRepository = {
  isLikedFieldSQL: `
    IF(
      EXISTS (
        SELECT *
        FROM book_user_likes 
        WHERE 
          books.id = book_user_likes.book_id AND
          book_user_likes.user_id = ?
      ), TRUE, FALSE
    ) AS is_liked,
  `,
  async findBook({ connection, bookId }) {
    const SQL = "SELECT * FROM books WHERE id = ?";

    const [data] = await connection.query(SQL, [bookId]);

    return isEmptyArray(data) ? null : data[0];
  },
  async findAllBooksWithLikesAndCategory({
    connection,
    userId,
    categoryId,
    latest,
    page,
    size,
  }) {
    const offset = (page - 1) * size;

    const SQL = `
      SELECT
        SQL_CALC_FOUND_ROWS
        books.*,
        (SELECT count(*) FROM book_user_likes WHERE books.id = book_user_likes.book_id) AS like_count,
        ${userId ? this.isLikedFieldSQL : ""}
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

    const [data] = await connection.query(SQL, queryValues);

    const [foundRowsResult] = await connection.query("SELECT FOUND_ROWS()");
    const totalElements = foundRowsResult[0]["FOUND_ROWS()"];

    return {
      data,
      totalElements,
    };
  },
  async findBookWithLikesAndCategory({ connection, bookId, userId }) {
    const SQL = `
      SELECT 
        books.*,
        (SELECT count(*) FROM book_user_likes WHERE books.id = book_user_likes.book_id) AS like_count,
        ${userId ? this.isLikedFieldSQL : ""}
        book_categories.name as category_name
      FROM books
      LEFT JOIN book_categories ON books.category_id = book_categories.id
      WHERE books.id = ?
    `;

    const queryValues = [];
    if (userId) {
      queryValues.push(userId);
    }
    queryValues.push(bookId);

    const [data] = await connection.query(SQL, queryValues);

    return isEmptyArray(data) ? null : data[0];
  },
  async findAllBookCategories({ connection }) {
    const SQL = "SELECT * FROM `book_categories`";
    const [data] = await connection.query(SQL);

    return data;
  },
  async findBookUserLike({ connection, bookId, userId }) {
    const SQL =
      "SELECT * FROM book_user_likes WHERE user_id = ? and book_id = ?";
    const [data] = await connection.query(SQL, [userId, bookId]);

    return isEmptyArray(data) ? null : data[0];
  },
  async createBookUserLike({ connection, bookId, userId }) {
    const SQL = "INSERT INTO book_user_likes (user_id, book_id) VALUES (?, ?)";
    await connection.query(SQL, [userId, bookId]);
  },
  async deleteBookUserLike({ connection, bookId, userId }) {
    const SQL = "DELETE FROM book_user_likes WHERE user_id = ? and book_id = ?";
    await connection.query(SQL, [userId, bookId]);
  },
};

export default bookRepository;
