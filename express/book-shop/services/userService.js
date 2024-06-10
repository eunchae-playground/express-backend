import jwt from "jsonwebtoken";
import convertHashedPassword from "../helpers/convertHashedPassword.js";
import generateSalt from "../helpers/generateSalt.js";
import userRepository from "../repositories/userRepository.js";

const userService = {
  async getUser({ connection, email }) {
    const data = await userRepository.findUser({ connection, email });

    return data;
  },
  async verifyLoginStatus({ accessToken }) {
    if (!accessToken) {
      return false;
    }

    try {
      const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
      jwt.verify(accessToken, JWT_PRIVATE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },
  async join({ connection, email, password }) {
    const salt = generateSalt();
    const hashedPassword = convertHashedPassword(password, salt);

    await userRepository.createUser({
      connection,
      email,
      hashedPassword,
      salt,
    });
  },
  async validateUser({ connection, email, password }) {
    const dbUserData = await userRepository.findUser({ connection, email });

    if (!dbUserData) {
      return false;
    }
    if (
      dbUserData.password !== convertHashedPassword(password, dbUserData.salt)
    ) {
      return false;
    }

    return true;
  },
  async issueAccessToken({ connection, email }) {
    const user = await userRepository.findUser({ connection, email });

    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const accessToken = jwt.sign({ id: user.id }, JWT_PRIVATE_KEY, {
      expiresIn: "30m",
      issuer: "eunchae",
    });

    return accessToken;
  },
};

export default userService;
