const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

/**
 * @Listen
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access_Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

/**
 * @Routes
 */
const userRoutes = require("./api/routes/user");
const materiRoutes = require("./api/routes/materi");
const messageRoutes = require("./api/routes/message");
const questionRoutes = require("./api/routes/question");
const quizRoutes = require("./api/routes/quiz");
const groupRoutes = require("./api/routes/group");
const fileRoutes = require("./api/routes/file");
const contactRoutes = require("./api/routes/contact");

/**
 * @API
 */
app.use(morgan("dev"));
app.use("/api/user", userRoutes);
app.use("/api/materi", materiRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/contact", contactRoutes);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.use(express.static(__dirname + "/public"));

app.get("*", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
