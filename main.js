require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const ClientMiniAppBot = require("./clientMiniAppBot");
const MiniAppDB = require("./miniAppDB");

// Initialize the app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "https://hadgroup.web.app/",
  "https://hadgroup-admin.web.app/",
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
  })
);

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   const referer = req.headers.referer;
//   console.log(origin);

//   if (allowedOrigins.includes(origin) || allowedOrigins.includes(referer)) {
//     next(); // Allow the request
//   } else {
//     res.status(403).send("Not allowed by server-side policy");
//   }
// });

// Secure HTTP headers using Helmet
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const clientMiniAppBot = new ClientMiniAppBot();
const miniAppDB = new MiniAppDB(app);

const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
