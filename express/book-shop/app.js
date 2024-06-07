/*
김은채
*/

import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import convertSnakeToCamelResponse from "./middlewares/convertSnakeToCamelResponse.js";
import booksRouter from "./routes/books.js";
import cartsRouter from "./routes/carts.js";
import ordersRouter from "./routes/orders.js";
import usersRouter from "./routes/users.js";

const app = express();
app.use(express.json());
app.use(convertSnakeToCamelResponse());
app.use(cookieParser());
app.listen(1234);

app.use("/", usersRouter);
app.use("/books", booksRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
