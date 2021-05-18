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
const DiscountCodeRouter = require("./routers/discountCode.router");
const ProductRouter = require("./routers/product.router");
const ScheduleRouter = require("./routers/schedule.router");
const TikiRouter = require("./routers/tiki.router");
const ShopeeRouter = require("./routers/shopee.router");
const StatisticRouter = require("./routers/statistic.router");

app.use(express.static(path.join(__dirname, "./assets")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(camelcase());
app.use(removeEmptyProperties());
app.get("/", (req, res) => res.send("Welcome to my hunting sale and coupon!"));
app.use("/user", UsersRouter);
app.use("/category", CategoryRouter);
app.use("/discount-code", DiscountCodeRouter);
app.use("/product", ProductRouter);
app.use("/schedule", ScheduleRouter);
app.use("/tiki", TikiRouter);
app.use("/shopee", ShopeeRouter);
app.use("/statistic", StatisticRouter);
app.use(errorHandler());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})