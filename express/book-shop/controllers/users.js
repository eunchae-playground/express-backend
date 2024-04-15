import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import connection from "../db.js";

export const join = async (req, res) => {
  try {
    const { email, password } = req.body;

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
    console.log(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.sqlMessage });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM `users` WHERE `email` = ?";
  const [results, _] = await connection.query(sql, [email]);
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

export const resetPasswordRequest = async (req, res) => {
  res.status(StatusCodes.OK).end();
};

export const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "비밀번호가 일치하지 않습니다." });
  }

  try {
    const salt = crypto.randomBytes(32).toString("base64");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("base64");

    const sql = "UPDATE `users` SET `password` = ?, `salt` = ? WHERE `id` = ?";
    await connection.query(sql, [hashedPassword, salt, req.userId]);
    return res.status(StatusCodes.OK).end();
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.sqlMessage });
  }
};
