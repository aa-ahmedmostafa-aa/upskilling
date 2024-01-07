const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();
const path = require("path");
const morgan = require("morgan");
const hpp = require("hpp");
const xss = require("xss-clean");
const helmet = require("helmet");

const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

// var cron = require("node-cron");
// const dailyEmail = require("./common/jobs/dailyEmail");
// const jobs = require("./common/jobs");
const config = require("./common/config/configuration");

const initApp = require("./common/init");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // limit each IP to 100 requests per windowMs
});

app.use(express.json());

// Used to enable CORS
app.use(cors());
// Protect against HTTP Parameter Pollution attacks
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Replace with your site's origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use(hpp());
// Sanitize data
app.use(mongoSanitize());
// Prevent XSS attack
app.use(xss());
// Rate limiter to all requests
app.use(limiter);

app.use(
  morgan(
    '>>> [:date][ :remote-addr :remote-user][":method :url HTTP/:http-version"][":referrer" ":user-agent"]',
    {
      immediate: true,
    }
  )
);
app.use(
  morgan(
    '<<< [:date][ :remote-addr :remote-user][":method :url HTTP/:http-version"][":referrer" ":user-agent"][":res[content-length] - :status - :response-time ms"]',
    {
      immediate: false,
    }
  )
);

// Set security headers
app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// jobs()

// Initialize app
initApp(app);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to booking API project" });
});

app.listen(config.port, () => {
  console.log(`backend is up & running on port ${config.port}`);
});
