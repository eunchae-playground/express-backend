import { body } from "express-validator";
import validationErrorChecker from "./middlewares/validationErrorChecker.js";

const createDeliveryInfoAddressChain = () => {
  return body("deliveryInfo.*.address")
    .notEmpty()
    .withMessage("주소를 입력해 주세요.");
};

const createDeliveryInfoDetailAddressChain = () => {
  return body("deliveryInfo.*.detailAddress")
    .notEmpty()
    .withMessage("상세 주소를 입력해 주세요.");
};

const createDeliveryInfoReceiverChain = () => {
  return body("deliveryInfo.*.receiver")
    .notEmpty()
    .withMessage("수령인을 입력해 주세요.");
};

const createDeliveryInfoContactChain = () => {
  return body("deliveryInfo.*.contact")
    .notEmpty()
    .withMessage("전화번호를 입력해 주세요.");
};

const createOrderBooksChain = () => {
  return body("orderBooks")
    .notEmpty()
    .withMessage("주문 상품이 존재하지 않습니다.");
};

export const getCreateOrderValidator = () => {
  return [
    createDeliveryInfoAddressChain(),
    createDeliveryInfoDetailAddressChain(),
    createDeliveryInfoReceiverChain(),
    createDeliveryInfoContactChain(),
    createOrderBooksChain(),
    validationErrorChecker,
  ];
};
