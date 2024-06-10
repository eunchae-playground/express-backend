import { StatusCodes } from "http-status-codes";
import cartService from "../services/cartService.js";
import orderService from "../services/orderService.js";
import errorHandler from "./helpers/errorHandler.js";

export const myOrders = errorHandler(async (req, res) => {
  const { connection, userId } = req;

  const data = await orderService.getAllUserOrders({ connection, userId });

  return res.status(StatusCodes.OK).json(data);
});

export const createOrders = errorHandler(
  async (req, res) => {
    const { connection, userId } = req;
    const { deliveryInfo, orderBooks } = req.body;
    const { address, detailAddress, receiver, contact } = deliveryInfo;

    await connection.beginTransaction();

    const deliveryInfoId = await orderService.addDeliveryInfo({
      connection,
      address,
      detailAddress,
      receiver,
      contact,
    });

    const orderId = await orderService.addOrder({
      connection,
      userId,
      deliveryInfoId,
    });

    for (const orderBook of orderBooks) {
      const { bookId, bookAmount } = orderBook;

      const cart = await cartService.getCart({ connection, userId, bookId });
      if (!cart) {
        await connection.rollback();
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "잘못된 장바구니 정보입니다." });
      }

      await orderService.addOrderBook({
        connection,
        orderId,
        bookId,
        bookAmount,
      });
    }

    // TODO: 주문 완료한 장바구니 제거하는 SQL 추가

    await connection.commit();

    return res.status(StatusCodes.CREATED).end();
  },
  { transaction: true }
);
