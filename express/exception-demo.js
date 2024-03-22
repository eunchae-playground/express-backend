const express = require("express");
const app = express();
app.use(express.json());
app.listen(1234);

const fruits = [
  { id: 1, name: "apple" },
  { id: 2, name: "orange" },
  { id: 3, name: "strawberry" },
  { id: 4, name: "blueberry" },
];

app.get("/fruits", (req, res) => {
  res.json(fruits);
});

app.get("/fruits/:id", (req, res) => {
  let id = req.params.id;
  const findFruit = fruits.find((f) => f.id == id);

  if (findFruit) {
    res.json(findFruit);
  } else {
    res.status(404).json({ message: "id에 저장된 과일이 없습니다" });
  }
});
