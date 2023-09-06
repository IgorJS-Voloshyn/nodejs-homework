require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const { DB_URI, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
