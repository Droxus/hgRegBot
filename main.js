require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const ClientMiniAppBot = require("./clientMiniAppBot");
const MiniAppDB = require("./miniAppDB");
const NewClientDetecter = require("./newClientDetecter");

// Initialize the app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Trust the first proxy (e.g., Heroku)
app.set("trust proxy", 1);

// app.use(cors({ origin: "*" }));

// CORS Configuration
const allowedOrigins = [
  "https://karta-pobytu-rejestracja.web.app",
  "https://hadgroup-admin.web.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the origin
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  console.log(origin);

  if (allowedOrigins.includes(origin) || allowedOrigins.includes(referer)) {
    next(); // Allow the request
  } else {
    res.status(403).send("Not allowed by server-side policy");
  }
});

// Secure HTTP headers using Helmet
app.use(helmet());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

const clientMiniAppBot = new ClientMiniAppBot();
const newClientDetecter = new NewClientDetecter();
const miniAppDB = new MiniAppDB(app, newClientDetecter);

const PORT = process.env.PORT || 3156;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
