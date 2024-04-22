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
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "토큰이 만기되었습니다." });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "유효하지 않은 토큰입니다." });
    }
    if (error instanceof jwt.NotBeforeError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "토큰이 비활성화 상태입니다." });
    }
  }
};

export default authenticate;
