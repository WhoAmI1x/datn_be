require("dotenv").config(); // Không thể thiếu khi deploy lên heroku
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error.");
  console.error(err);
  process.exit();
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connect successfully");
});
