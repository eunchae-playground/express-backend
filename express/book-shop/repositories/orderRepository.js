const orderRepository = {
  async findAllUserOrders({ connection, userId }) {
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

    const [data] = await connection.query(SQL, [userId]);

    return data.map((order) => ({
      ...order,
      order_books: JSON.parse(order.order_books),
    }));
  },
  async createOrder({ connection, userId, deliveryInfoId }) {
    const SQL = `
      INSERT INTO orders
        (user_id, delivery_info_id)
      VALUES
        (?, ?)
    `;

    const [queryResult] = await connection.query(SQL, [userId, deliveryInfoId]);
    const id = queryResult.insertId;

    return id;
  },
  async createOrderBook({ connection, orderId, bookId, bookAmount }) {
    const SQL = `
      INSERT INTO order_books
        (order_id, book_id, book_amount)
      VALUES
        (?, ?, ?)
    `;
    await connection.query(SQL, [orderId, bookId, bookAmount]);
  },
  async createDeliveryInfo({
    connection,
    address,
    detailAddress,
    receiver,
    contact,
  }) {
    const SQL = `
      INSERT INTO delivery_infoes
        (address, detail_address, receiver, contact)
      VALUES 
        (?, ?, ?, ?)
    `;

    const [queryResult] = await connection.query(SQL, [
      address,
      detailAddress,
      receiver,
      contact,
    ]);
    const id = queryResult.insertId;

    return id;
  },
};

export default orderRepository;
