import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_KEY } from "../constants.js";
import connection from "../db.js";
import convertHashedPassword from "../helpers/convertHashedPassword.js";
import generateSalt from "../helpers/generateSalt.js";

export const authenticate = async (req, res) => {
  const accessToken = req.cookies[ACCESS_TOKEN_KEY];

  if (!accessToken) {
    return res.status(StatusCodes.OK).json({ isLogin: false });
  }

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    jwt.verify(accessToken, JWT_PRIVATE_KEY);
    return res.status(StatusCodes.OK).json({ isLogin: true });
  } catch (error) {
    return res.status(StatusCodes.OK).json({ isLogin: false });
  }
};

export const join = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 존재하는 유저인지 확인
    const SELECT_USER_SQL = "SELECT * FROM `users` WHERE `email` = ?";
    const [user] = await connection.query(SELECT_USER_SQL, [email]);
    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 존재하는 계정입니다." });
    }

    const salt = generateSalt();
    const hashedPassword = convertHashedPassword(password, salt);

    const INSERT_USER_SQL =
      "INSERT INTO `users` (`email`, `password`, `salt`) VALUES (?, ?, ?)";
    await connection.query(INSERT_USER_SQL, [email, hashedPassword, salt]);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "회원가입 되었습니다." });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const SELECT_USER_SQL = "SELECT * FROM `users` WHERE `email` = ?";
  const [user] = await connection.query(SELECT_USER_SQL, [email]);

  if (user.length === 0) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "유저 정보가 잘못되었습니다." });
  }

  const { password: hashedPassword, salt, id } = user[0];
  const requestHashedPassword = convertHashedPassword(password, salt);

  if (hashedPassword !== requestHashedPassword) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "유저 정보가 잘못되었습니다." });
  }

  const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
  const accessToken = jwt.sign({ id }, JWT_PRIVATE_KEY, {
    expiresIn: "30m",
    issuer: "eunchae",
  });

  res.cookie(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
  });
  return res.status(StatusCodes.OK).end();
};

export const logout = async (req, res) => {
  res.clearCookie(ACCESS_TOKEN_KEY);
  return res.status(StatusCodes.OK).end();
};

export const resetPasswordAuthenticate = async (req, res) => {
  const { email } = req.body;

  try {
    const SELECT_USER_SQL = "SELECT * FROM `users` WHERE `email` = ?";
    const [user] = await connection.query(SELECT_USER_SQL, [email]);
    if (user.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 유저입니다." });
    }

    // 이메일 보내서 확인받는 로직 생략

    return res.status(StatusCodes.OK).end();
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = generateSalt();
    const hashedPassword = convertHashedPassword(password, salt);

    const SQL =
      "UPDATE `users` SET `password` = ?, `salt` = ? WHERE `email` = ?";
    await connection.query(SQL, [hashedPassword, salt, email]);
    return res.status(StatusCodes.OK).end();
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};
