import { StatusCodes } from "http-status-codes";
import { ACCESS_TOKEN_KEY } from "../constants.js";
import connection from "../db.js";
import convertHashedPassword from "../helpers/convertHashedPassword.js";
import generateSalt from "../helpers/generateSalt.js";
import userService from "../services/userService.js";
import errorHandler from "./helpers/errorHandler.js";

export const authenticate = errorHandler(async (req, res) => {
  const accessToken = req.cookies[ACCESS_TOKEN_KEY];

  const isLogin = await userService.verifyLoginStatus({ accessToken });

  return res.status(StatusCodes.OK).json({ isLogin });
});

export const join = errorHandler(async (req, res) => {
  const { connection } = req;
  const { email, password } = req.body;

  const user = await userService.getUser({ connection, email });
  if (user) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "이미 존재하는 계정입니다." });
  }

  await userService.join({ connection, email, password });

  return res
    .status(StatusCodes.CREATED)
    .json({ message: "회원가입 되었습니다." });
});

export const login = errorHandler(async (req, res) => {
  const { connection } = req;
  const { email, password } = req.body;

  const isValidUser = await userService.validateUser({
    connection,
    email,
    password,
  });
  if (!isValidUser) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "유저 정보가 잘못되었습니다." });
  }

  const accessToken = await userService.issueAccessToken({ connection, email });
  res.cookie(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
  });

  return res.status(StatusCodes.OK).end();
});

export const logout = errorHandler(async (req, res) => {
  res.clearCookie(ACCESS_TOKEN_KEY);
  return res.status(StatusCodes.OK).end();
});

export const resetPasswordAuthenticate = errorHandler(async (req, res) => {
  const { connection } = req;
  const { email } = req.body;

  const user = await userService.getUser({ connection, email });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "존재하지 않는 유저입니다." });
  }

  // 이메일 보내서 확인받는 로직 생략

  return res.status(StatusCodes.OK).end();
});

// TODO: 이메일 인증 토큰 받아야 초기화하는 로직으로 변경 & Service 분리
export const resetPassword = errorHandler(async (req, res) => {
  const { email, password } = req.body;

  const salt = generateSalt();
  const hashedPassword = convertHashedPassword(password, salt);

  const SQL = "UPDATE `users` SET `password` = ?, `salt` = ? WHERE `email` = ?";
  await connection.query(SQL, [hashedPassword, salt, email]);
  return res.status(StatusCodes.OK).end();
});
