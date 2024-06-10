import { StatusCodes } from "http-status-codes";
import connection from "../db.js";
import errorHandler from "./helpers/errorHandler.js";

export const myOrders = errorHandler(async (req, res) => {
  const { userId } = req;

  const SQL = `
    SELECT 
        orders.id,
        orders.ordered_at,
        delivery_infoes.address,
        delivery_infoes.receiver,
        JSON_ARRAYAGG(  
            JSON_OBJECT(
                'title', books.title,
                'price', books.price,
                'amount', order_books.book_amount
            )
        ) AS order_books
    FROM 
        orders
    JOIN 
        delivery_infoes ON orders.delivery_info_id = delivery_infoes.id
    JOIN 
        order_books ON orders.id = order_books.order_id
    JOIN 
        books ON order_books.book_id = books.id
    WHERE user_id = ? 
    GROUP BY 
        orders.id, 
        orders.ordered_at, 
        delivery_infoes.address, 
        delivery_infoes.receiver
    ORDER BY ordered_at DESC
  `;

  const [myOrders] = await connection.query(SQL, [userId]);

  const parsedMyOrders = myOrders.map((myOrder) => ({
    ...myOrder,
    order_books: JSON.parse(myOrder.order_books),
  }));

  return res.status(StatusCodes.OK).json(parsedMyOrders);
});

export const createOrders = errorHandler(
  async (req, res) => {
    const { connectionPool } = req; // errorHandler에서 전달
    const { userId } = req;
    const { deliveryInfo, orderBooks } = req.body;
    const { address, detailAddress, receiver, contact } = deliveryInfo;

    await connectionPool.beginTransaction();

    // delivery_info 생성
    const CREATE_DELIVERY_INFO_SQL = `
      INSERT INTO delivery_infoes
        (address, detail_address, receiver, contact)
      VALUES 
        (?, ?, ?, ?)
    `;
    const [createDelieveryInfoResult] = await connectionPool.query(
      CREATE_DELIVERY_INFO_SQL,
      [address, detailAddress, receiver, contact]
    );
    const deliveryInfoId = createDelieveryInfoResult.insertId;

    // order 생성
    const CREATE_ORDER_SQL = `
      INSERT INTO orders
        (user_id, delivery_info_id)
      VALUES
        (?, ?)
    `;
    const [createOrderResult] = await connectionPool.query(CREATE_ORDER_SQL, [
      userId,
      deliveryInfoId,
    ]);
    const orderId = createOrderResult.insertId;

    // 장바구니에 존재하는 책이면 order_book 생성
    for (const orderBook of orderBooks) {
      const { bookId, bookAmount } = orderBook;

      const SELECT_CART_SQL =
        "SELECT id FROM carts WHERE user_id = ? AND book_id = ?";
      const [cart] = await connectionPool.query(SELECT_CART_SQL, [
        userId,
        bookId,
      ]);

      if (cart.length === 0) {
        await connectionPool.rollback();
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "장바구니에 존재하지 않는 책입니다." });
      }

      const CREATE_ORDER_BOOK_SQL = `
        INSERT INTO order_books
          (order_id, book_id, book_amount)
        VALUES
          (?, ?, ?)
      `;
      await connectionPool.query(CREATE_ORDER_BOOK_SQL, [
        orderId,
        bookId,
        bookAmount,
      ]);
    }

    // TODO: 주문 완료한 장바구니 제거하는 SQL 추가

    await connectionPool.commit();

    return res.status(StatusCodes.CREATED).end();
  },
  { transaction: true }
);
