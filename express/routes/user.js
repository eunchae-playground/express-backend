import express from "express";
import jwt from "jsonwebtoken";
import connection from "../db.js";
import { getJoinChains, getLoginChains } from "../validator/chains/user.js";
import validationErrorChecker from "../validator/middlewares/validationErrorChecker.js";

const router = express.Router();
router.use(express.json());

router
  .route("/users/:id")
  .get(async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const sql = "SELECT * FROM `users` WHERE `id` = ?";
    const [results, _] = await connection.query(sql, [id]);

    if (results.length > 0) {
      const { id, name, email, contact } = results[0];
      return res.status(200).json({ id, name, email, contact });
    } else {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }
  })
  .delete(async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    try {
      const sql = "DELETE FROM `users` WHERE `id` = ?";
      await connection.query(sql, [id]);
      return res.status(200).json({ message: `회원 탈퇴 되었습니다.` });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.sqlMessage });
    }
  });

router.post(
  "/join",
  [...getJoinChains(), validationErrorChecker],
  async (req, res) => {
    try {
      const sql =
        "INSERT INTO `users` (`email`, `name`, `password`, `contact`) VALUES (?, ?, ?, ?)";
      const { email, name, password, contact } = req.body;
      await connection.query(sql, [email, name, password, contact]);

      return res.status(201).json({ message: "회원가입 되었습니다." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.sqlMessage });
    }
  }
);

router.post(
  "/login",
  [...getLoginChains(), validationErrorChecker],
  async (req, res) => {
    const sql = "SELECT * FROM `users` WHERE `email` = ?";
    const [results, _] = await connection.query(sql, [req.body.email]);

    if (results < 1 || results[0].password !== req.body.password) {
      return res.status(401).json({ message: "유저 정보가 잘못되었습니다." });
    }
    const user = results[0];
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const accessToken = jwt.sign({ id: user.id }, JWT_PRIVATE_KEY);

    return res.status(200).json({ accessToken });
  }
);

export default router;
