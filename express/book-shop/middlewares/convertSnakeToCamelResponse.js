import camelcaseKeys from "camelcase-keys";
import unless from "express-unless";

export const convertSnakeToCamelResponse = () => {
  const snakeCaseResHandler = (_req, res, next) => {
    const send = res.send;
    res.send = function (body) {
      if (body != null) {
        body = camelcaseKeys(JSON.parse(body.toString()));
      }
      send.call(this, Buffer.from(JSON.stringify(body)));
      return res;
    };
    next();
  };

  snakeCaseResHandler.unless = unless;
  return [snakeCaseResHandler];
};

export default convertSnakeToCamelResponse;
