import { body } from "express-validator";

const getDeliveryInfoAddressChain = () => {
  return body("deliveryInfo.*.address")
    .notEmpty()
    .withMessage("주소를 입력해 주세요.");
};

const getDeliveryInfoReceiverChain = () => {
  return body("deliveryInfo.*.receiver")
    .notEmpty()
    .withMessage("수령인을 입력해 주세요.");
};

const getDeliveryInfoContactChain = () => {
  return body("deliveryInfo.*.contact")
    .notEmpty()
    .withMessage("전화번호를 입력해 주세요.");
};

const getBookIdChain = () => {
  return body("bookId")
    .notEmpty()
    .withMessage("bookId값이 포함되어 있지 않습니다.")
    .bail()
    .isNumeric()
    .withMessage("bookId값은 숫자여야 합니다.");
};

const getBookAmountChain = () => {
  return body("bookAmount")
    .notEmpty()
    .withMessage("책의 수량을 입력해 주세요.")
    .bail()
    .isNumeric()
    .withMessage("수량은 숫자여야 합니다.");
};

export const getCreateOrderChains = () => {
  return [
    getDeliveryInfoAddressChain(),
    getDeliveryInfoReceiverChain(),
    getDeliveryInfoContactChain(),
    getBookIdChain(),
    getBookAmountChain(),
  ];
};
