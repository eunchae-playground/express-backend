import isEmptyArray from "../utils/isEmptyArray.js";

const userRepository = {
  async findUser({ connection, email }) {
    const SQL = "SELECT * FROM `users` WHERE `email` = ?";

    const [data] = await connection.query(SQL, [email]);

    return isEmptyArray(data) ? null : data[0];
  },
  async createUser({ connection, email, hashedPassword, salt }) {
    const SQL =
      "INSERT INTO `users` (`email`, `password`, `salt`) VALUES (?, ?, ?)";

    await connection.query(SQL, [email, hashedPassword, salt]);
  },
};

export default userRepository;
