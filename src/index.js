require('dotenv').config();
require("./db/mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const camelcase = require("./middlewares/camelcase");
const removeEmptyProperties = require("./middlewares/removeEmptyProperties");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");

const app = express();
const port = process.env.PORT || 4398;

const UsersRouter = require("./routers/user.router");
const CategoryRouter = require("./routers/category.router");
const TikiRouter = require("./routers/tiki.router");
const ShopeeRouter = require("./routers/shopee.router");

app.use(express.static(path.join(__dirname, "./assets")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(camelcase());
app.use(removeEmptyProperties());
app.get("/", (req, res) => res.send("Welcome to my hunting sale and coupon!"));
app.use("/users", UsersRouter);
app.use("/category", CategoryRouter);
app.use("/tiki", TikiRouter);
app.use("/shopee", ShopeeRouter);
app.use(errorHandler());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})