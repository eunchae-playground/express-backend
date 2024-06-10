import bookRepository from "../repositories/bookRepository.js";

const bookService = {
  async getBook({ connection, bookId }) {
    const data = await bookRepository.findBook({ connection, bookId });

    return data;
  },
  async getAllBooksWithLikesAndCategory({
    connection,
    userId,
    categoryId,
    latest,
    page = 1,
    size = 10,
  }) {
    const { data, totalElements } =
      await bookRepository.findAllBooksWithLikesAndCategory({
        connection,
        userId,
        categoryId,
        latest,
        page,
        size,
      });

    return {
      data,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        totalElements,
        totalPages: Math.ceil(totalElements / size),
      },
    };
  },
  async getBookWithLikesAndCategory({ connection, bookId, userId }) {
    const data = await bookRepository.findBookWithLikesAndCategory({
      connection,
      bookId,
      userId,
    });

    return data;
  },
  async getAllBookCategories({ connection }) {
    const data = await bookRepository.findAllBookCategories({
      connection,
    });

    return data;
  },
  async getBookUserLikeStatus({ connection, bookId, userId }) {
    const data = await bookRepository.findBookUserLike({
      connection,
      bookId,
      userId,
    });

    return data ? true : false;
  },
  async toggleBookUserLike({ connection, bookId, userId }) {
    const isLiked = await bookService.getBookUserLikeStatus({
      connection,
      bookId,
      userId,
    });

    if (isLiked) {
      await bookRepository.deleteBookUserLike({
        connection,
        bookId,
        userId,
      });
    } else {
      await bookRepository.createBookUserLike({
        connection,
        bookId,
        userId,
      });
    }

    return { isLiked: !isLiked };
  },
};

export default bookService;
