import { param } from "express-validator";

const getBookIdParameterChain = () => {
  return param("id").isNumeric().withMessage("잘못된 id값입니다.");
};

export const getBookDetailChains = () => {
  return [getBookIdParameterChain()];
};
