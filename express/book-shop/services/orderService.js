import orderRepository from "../repositories/orderRepository.js";

const orderService = {
  async getAllUserOrders({ connection, userId }) {
    const data = await orderRepository.findAllUserOrders({
      connection,
      userId,
    });

    return data;
  },
  async addOrder({ connection, userId, deliveryInfoId }) {
    const id = await orderRepository.createOrder({
      connection,
      userId,
      deliveryInfoId,
    });

    return id;
  },
  async addOrderBook({ connection, orderId, bookId, bookAmount }) {
    await orderRepository.createOrderBook({
      connection,
      orderId,
      bookId,
      bookAmount,
    });
  },
  async addDeliveryInfo({
    connection,
    address,
    detailAddress,
    receiver,
    contact,
  }) {
    const id = await orderRepository.createDeliveryInfo({
      connection,
      address,
      detailAddress,
      receiver,
      contact,
    });

    return id;
  },
};

export default orderService;
