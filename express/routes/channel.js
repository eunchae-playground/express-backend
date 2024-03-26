const express = require("express");
const router = express.Router();
router.use(express.json());

let db = new Map();
let id = 1;
db.set(id++, { userId: 1, title: "titleA" });
db.set(id++, { userId: 2, title: "titleB" });
db.set(id++, { userId: 1, title: "titleC" });

router
  .route("/")
  .get((req, res) => {
    const { userId } = req.body;
    const channels = Array.from(db.values());
    if (userId) {
      res
        .status(200)
        .json(channels.filter((channel) => channel.userId === userId));
    } else {
      res.status(200).json(channels);
    }
  })
  .post((req, res) => {
    if (req.body.title) {
      db.set(id++, req.body);
      res
        .status(201)
        .json({ message: `${req.body.title} 채널이 추가되었습니다.` });
    } else {
      res.status(400).json({ message: "요청값이 잘못되었습니다." });
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const channel = db.get(id);
    if (channel) {
      res.status(200).json(channel);
    } else {
      res.status(404).json({ message: "채널을 찾을 수 없습니다." });
    }
  })
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const { title } = req.body;

    const channel = db.get(id);
    if (channel) {
      db.set(id, { ...channel, title });
      res.status(200).json({
        message: `${channel.title}에서 ${title}로 채널명이 수정되었습니다.`,
      });
    } else {
      res.status(404).json({ message: "채널을 찾을 수 없습니다." });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const channel = db.get(id);
    if (channel) {
      db.delete(id);
      res
        .status(200)
        .json({ message: `${channel.title}채널이 삭제되었습니다.` });
    } else {
      res.status(404).json({ message: "채널을 찾을 수 없습니다." });
    }
  });

module.exports = router;
