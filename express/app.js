const express = require("express");
const app = express();
app.use(express.json());
app.listen(1234);

const userRouter = require("./routes/user");
const channelRouter = require("./routes/channel");
app.use("/", userRouter);
app.use("/channels", channelRouter);
