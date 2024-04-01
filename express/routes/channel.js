import express from "express";
import connection from "../db.js";

const router = express.Router();
router.use(express.json());

router
  .route("/")
  .get(async (req, res) => {
    const { userId } = req.query;

    if (userId) {
      const sql = "SELECT * FROM `channels` WHERE `user_id` = ?";
      const [channels, _] = await connection.query(sql, [userId]);
      return res.status(200).json(channels);
    }

    const sql = "SELECT * FROM `channels`";
    const [channels, _] = await connection.query(sql);
    return res.status(200).json(channels);
  })
  .post(async (req, res) => {
    try {
      const sql =
        "INSERT INTO `channels` (`name`, `sub_name`, `user_id`) VALUES (?, ?, ?)";
      const { name, subName, userId } = req.body;
      await connection.query(sql, [name, subName, userId]);

      return res.status(201).json({ message: "채널이 추가되었습니다." });
    } catch (error) {
      return res.status(400).json({ message: error.sqlMessage });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const sql = "SELECT * FROM `channels` WHERE `id` = ?";
    const [results, _] = await connection.query(sql, [id]);

    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: "채널이 존재하지 않습니다." });
    }
  })
  .put(async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const { name, subName } = req.body;

    try {
      const sql =
        "UPDATE `channels` SET `name` = ?, `sub_name` = ? WHERE `id` = ?";
      await connection.query(sql, [name, subName, id]);
      return res.status(200).json({
        message: "채널 정보가 수정되었습니다.",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.sqlMessage });
    }
  })
  .delete(async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    try {
      const sql = "DELETE FROM `channels` WHERE `id` = ?";
      await connection.query(sql, [id]);
      return res.status(200).json({ message: `채널이 삭제 되었습니다.` });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.sqlMessage });
    }
  });

export default router;
