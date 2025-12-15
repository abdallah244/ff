const express = require("express");
const serverless = require("serverless-http");

const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const authRoutes = require("../routes/auth");
const adminRoutes = require("../routes/admin");
const feedbackRoutes = require("../routes/feedback");
const contactRoutes = require("../routes/contact");
const cartRoutes = require("../routes/cart");
const orderRoutes = require("../routes/orders");
const brandSettingsRoutes = require("../routes/brandSettings");
const User = require("../models/User");
const MasterCode = require("../models/MasterCode");
const isAdmin = require("../middleware/isAdmin");

const app = express();

// Middleware for performance
app.use(compression());
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve uploaded images
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    next();
  },
  express.static(path.join(__dirname, "../uploads"))
);

// MongoDB Connection (skip if no URI to avoid lambda timeouts)
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    })
    .then(async () => {
      console.log("✓ MongoDB connected");
      try {
        const hashedPassword = await bcrypt.hash("andallah2008", 10);
        await User.findOneAndUpdate(
          { email: "dada@gmail.com" },
          {
            $setOnInsert: {
              name: "Admin",
              email: "dada@gmail.com",
              phone: "01000000000",
              password: hashedPassword,
            },
            $set: {
              role: "admin",
              banned: false,
            },
          },
          { upsert: true, new: true }
        );
        console.log("✓ Default admin ensured");
      } catch (error) {
        console.error("✗ Error ensuring default admin:", error.message);
      }
    })
    .catch((err) => console.error("✗ MongoDB connection error:", err.message));
} else {
  console.warn("⚠️ MONGO_URI not set; skipping Mongo connection in function");
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", isAdmin, adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/brand", brandSettingsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Diagnostics
app.get("/api/diagnostics", async (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    mongo:
      ["disconnected", "connected", "connecting", "disconnecting"][state] ||
      state,
    dbName: mongoose.connection?.name,
    host: mongoose.connection?.host,
    port: mongoose.connection?.port,
    uptimeSec: process.uptime(),
    now: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Netlify Function Handler with error guard
const handler = serverless(app, { basePath: "/.netlify/functions/server" });

exports.handler = async (event, context) => {
  try {
    // Early health shortcut to isolate runtime issues
    if (
      (event.path && event.path.endsWith("/api/health")) ||
      (event.rawPath && event.rawPath.endsWith("/api/health"))
    ) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "ok",
          runtime: "netlify",
          ts: new Date().toISOString(),
        }),
      };
    }

    // Temporary diagnostic: bypass Express to verify function wiring
    if (event.path === "/diagnostic" || event.rawPath === "/diagnostic") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true, note: "Function wiring OK" }),
      };
    }

    return await handler(event, context);
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};
