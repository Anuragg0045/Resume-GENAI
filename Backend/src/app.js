const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://resume-genai-ten.vercel.app",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Res-GENAI Backend is running 🚀");
});

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;