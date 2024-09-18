require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./config/db");
const session = require("express-session");
const nocache = require("nocache");
const cors = require("cors");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

connectDB();

const indexRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const shoppingCart = require("./routes/shoppingCartRoute");
const ordersRouter = require("./routes/ordersRouter");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

// No-cache configuration
app.use(nocache());

// Session configuration
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Set up Handlebars view engine with layout and partials directories
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    defaultLayout: "user", // Default layout if not overridden
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
      eq: function (a, b, options) {
        a = JSON.stringify(a);
        b = JSON.stringify(b);
        return a == b;
      },
      lookup: function (items, id) {
        return items.some(
          (item) => item.productId.toString() === id.toString()
        );
      },
      formatDate: function (date) {
        return new Date(date).toLocaleDateString();
      },
      or: function (a, b) {
        return a || b;
      },
      range: function (start, end) {
        let arr = [];
        for (let i = start; i <= end; i++) {
          arr.push(i);
        }
        return arr;
      },
      ifEquals:function(arg1, arg2, options) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    }
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware to dynamically set the layout based on the route
app.use((req, res, next) => {
  if (
    req.path.startsWith("/admin/auth") ||
    req.path === "/admin/login" ||
    req.path === "/admin/reset-password" ||
    req.path === "/admin/new-password" ||
    req.path === "/admin/forgot-password" ||
    req.path === "/admin/report"
  ) {
    res.locals.layout = "auth"; // Use auth layout for specific admin auth routes
  } else if (req.path.startsWith("/admin")) {
    res.locals.layout = "admin"; // Use admin layout for other admin routes
  } else if (req.path.startsWith("/auth")) {
    res.locals.layout = "auth"; // Use auth layout for user auth routes
  } else if (req.path.startsWith("/account")) {
    res.locals.layout = "accounts";
  } else {
    res.locals.layout = "user"; // Use user layout for other routes
  }
  next();
});

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Route handlers
app.use("/", indexRouter);
app.use("/", ordersRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRoute);
app.use("/cart", shoppingCart);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
