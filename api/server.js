const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

// Routers
const authRouter = require("../auth/auth-router.js");
const userRouter = require("../user/user-router.js");
const compassionRouter = require("../compassion/compassion-router.js");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/compassions", compassionRouter);

app.get("/", (req, res) => {
    res.json({ message: "Compassion server is up and running"});
});

module.exports = app;