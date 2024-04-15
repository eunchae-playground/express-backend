import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const { "access-token": accessToken } = req.cookies;

  if (!accessToken) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "토큰이 존재하지 않습니다." });
  }

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const decodedJwt = jwt.verify(accessToken, JWT_PRIVATE_KEY);
    req.userId = decodedJwt.id;
    next();
  } catch (error) {
    // TODO: 기간 만기, 토큰 오류 등 에러에 맞춰서 코드, 메세지 반환하기
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "토큰이 유효하지 않습니다." });
  }
};

export default authenticate;
