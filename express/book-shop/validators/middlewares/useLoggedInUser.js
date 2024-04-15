import jwt from "jsonwebtoken";

const useLoggedInUser = (req, res, next) => {
  const { "access-token": accessToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const decodedJwt = jwt.verify(accessToken, JWT_PRIVATE_KEY);
    req.userId = decodedJwt.id;
    return next();
  } catch (error) {
    return next();
  }
};

export default useLoggedInUser;
