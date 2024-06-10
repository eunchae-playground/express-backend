import cartRepository from "../repositories/cartRepository.js";

const cartService = {
  async getAllUserCarts({ connection, userId }) {
    const data = await cartRepository.findAllUserCarts({ connection, userId });

    return data;
  },
  async getCart({ connection, cartId, userId, bookId }) {
    const data = await cartRepository.findCart({
      connection,
      cartId,
      userId,
      bookId,
    });

    return data;
  },
  async addCart({ connection, userId, bookId, amount }) {
    await cartRepository.createCart({ connection, userId, bookId, amount });
  },
  async removeCart({ connection, cartId }) {
    await cartRepository.deleteCart({ connection, cartId });
  },
  async removeMultipleCarts({ connection, ids }) {
    await cartRepository.deleteCartsByIds({ connection, ids });
  },
};

export default cartService;
