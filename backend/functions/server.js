const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const bcrypt = require("bcrypt");
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

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/store", {
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

// Netlify Function Handler
exports.handler = async (event, context) => {
  return new Promise((resolve) => {
    try {
      console.log(`Handling ${event.httpMethod} ${event.rawPath || event.path}`);
      
      // Create request object
      const req = {
        method: event.httpMethod || 'GET',
        url: event.rawPath || event.path || '/',
        headers: event.headers || {},
        body: event.body,
        on: () => {},
        once: () => {},
        pause: () => {},
        resume: () => {},
        removeListener: () => {},
      };

      // Create response object
      let statusCode = 200;
      const responseHeaders = { 'Content-Type': 'application/json' };
      let body = '';

      const res = {
        statusCode,
        headers: responseHeaders,
        status(code) {
          statusCode = code;
          return this;
        },
        setHeader(name, value) {
          responseHeaders[name] = value;
          return this;
        },
        write(chunk) {
          body += typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
          return this;
        },
        end(chunk) {
          if (chunk) {
            body += typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
          }
          console.log(`Response: ${statusCode}`);
          resolve({
            statusCode,
            headers: responseHeaders,
            body: body || ''
          });
        },
        send(data) {
          body = typeof data === 'string' ? data : JSON.stringify(data);
          return this.end();
        },
        json(data) {
          responseHeaders['Content-Type'] = 'application/json';
          body = JSON.stringify(data);
          return this.end();
        }
      };

      // Call Express app
      app(req, res);
    } catch (error) {
      console.error('Handler error:', error);
      resolve({
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message })
      });
    }
  });
};
