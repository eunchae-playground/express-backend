import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import connection from "../db.js";

export const authenticate = async (req, res) => {
  // 인증에 실패한 경우는 미들웨어에서 처리된다.
  return res.status(StatusCodes.OK).end();
};

export const join = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 존재하는 유저인지 확인
    const getUserSql = "SELECT * FROM `users` WHERE `email` = ?";
    const [userResult] = await connection.query(getUserSql, [email]);
    if (userResult.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 존재하는 계정입니다." });
    }

    const salt = crypto.randomBytes(32).toString("base64");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("base64");

    const sql =
      "INSERT INTO `users` (`email`, `password`, `salt`) VALUES (?, ?, ?)";
    await connection.query(sql, [email, hashedPassword, salt]);

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

  const sql = "SELECT * FROM `users` WHERE `email` = ?";
  const [results] = await connection.query(sql, [email]);
  const { password: hashedPassword, salt, id } = results[0] || {};
  const hashedInputPassword =
    results[0] &&
    crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

  if (results < 1 || hashedPassword !== hashedInputPassword) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "유저 정보가 잘못되었습니다." });
  }

  const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
  const accessToken = jwt.sign({ id }, JWT_PRIVATE_KEY, {
    expiresIn: "30m",
    issuer: "eunchae",
  });

  res.cookie("access-token", accessToken, {
    httpOnly: true,
  });
  return res.status(StatusCodes.OK).end();
};

export const logout = async (req, res) => {
  res.clearCookie("access-token");
  return res.status(StatusCodes.OK).end();
};

export const resetPasswordAuthenticate = async (req, res) => {
  const { email } = req.body;

  try {
    const sql = "SELECT * FROM `users` WHERE `email` = ?";
    const [results] = await connection.query(sql, [email]);
    if (results.length < 1) {
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
    const salt = crypto.randomBytes(32).toString("base64");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("base64");

    const sql =
      "UPDATE `users` SET `password` = ?, `salt` = ? WHERE `email` = ?";
    await connection.query(sql, [hashedPassword, salt, email]);
    return res.status(StatusCodes.OK).end();
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};
