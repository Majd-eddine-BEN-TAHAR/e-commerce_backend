const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectToDB = require("./config/connectToDB");
const errorMiddleware = require("./middlewares/errorMiddleware");
const notFound = require("./middlewares/404");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const customerServicesRoutes = require("./routes/customerServicesRoutes");

const app = express();
/*eslint-env node*/

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/products", productRoutes);

app.use("/users", userRoutes);

app.use("/orders", orderRoutes);

app.use("/customer-services", customerServicesRoutes);

app.use(notFound);

app.use(errorMiddleware);

connectToDB(app);
