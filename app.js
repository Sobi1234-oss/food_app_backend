const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { User } = require("./UserDetails"); // Make sure this file exists and exports `User`

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
const mongoURL = "mongodb+srv://khsobi0:NJWZj292Cr2t9rjV@cluster0.vuzjgij.mongodb.net/userDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURL)
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Database connection error:", err));

// Test Route
app.get("/test", (req, res) => {
  res.json({ status: "working", message: "Server is responding" });
});

// User Registration
app.post("/register", async (req, res) => {
  const { name, password, email, mobile } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send({ status: "error", message: "User already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
      mobile
    });

    res.status(201).send({
      status: "success",
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
});

// User Login
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    res.json({
      status: "success",
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
