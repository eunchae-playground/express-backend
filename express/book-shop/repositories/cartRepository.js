import isEmptyArray from "../utils/isEmptyArray.js";

const cartRepository = {
  async findAllUserCarts({ connection, userId }) {
    const SQL = `
      SELECT
        carts.id, books.id as book_id, carts.amount, books.title, books.image, books.detail, books.price
      FROM carts
      LEFT JOIN books
      ON carts.book_id = books.id
      WHERE user_id = ?
    `;

    const [data] = await connection.query(SQL, [userId]);

    return data;
  },
  async findCart({ connection, cartId, userId, bookId }) {
    const SQL = `
      SELECT * 
      FROM carts
      WHERE TRUE
        ${cartId ? `AND id = ?` : ""}
        ${bookId ? `AND book_id = ?` : ""}
        ${userId ? `AND user_id = ?` : ""}
    `;

    const queryValues = [];
    if (cartId) {
      queryValues.push(cartId);
    }
    if (bookId) {
      queryValues.push(bookId);
    }
    if (userId) {
      queryValues.push(userId);
    }

    const [data] = await connection.query(SQL, queryValues);

    return isEmptyArray(data) ? null : data[0];
  },
  async createCart({ connection, userId, bookId, amount }) {
    const SQL = "INSERT INTO carts (book_id, user_id, amount) VALUES (?, ?, ?)";
    await connection.query(SQL, [bookId, userId, amount]);
  },
  async deleteCart({ connection, cartId }) {
    const SQL = "DELETE FROM carts WHERE id = ?";
    await connection.query(SQL, [cartId]);
  },
  async deleteCartsByIds({ connection, ids }) {
    const SQL = "DELETE FROM carts WHERE id in (?)";
    await connection.query(SQL, [ids]);
  },
};

export default cartRepository;
