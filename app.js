const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ADDED CORS

const app = express();
app.use(express.json());
app.use(cors()); // ENABLE CORS

// MongoDB connection - ADDED DATABASE NAME
const mongoURL = "mongodb+srv://khsobi0:NJWZj292Cr2t9rjV@cluster0.vuzjgij.mongodb.net/userDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURL)
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Database connection error:", err));

// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String
});

const User = mongoose.model("UserInfo", userSchema);

// Routes
app.get("/", (req, res) => {
  res.send({ status: "Server running" });
});

app.post("/request", async (req, res) => {
  const { name, password, email, mobile } = req.body;
  
  try {
    const oldUser = await User.findOne({ email });
    
    if (oldUser) {
      return res.status(409).send({ status: "error", data: "User already exists" }); // 409 Conflict
    }
    
    await User.create({ name, password, email, mobile });
    res.send({ status: "ok", data: "User created" });
    
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle duplicate key error separately
    if (error.code === 11000) {
      return res.status(409).send({ status: "error", data: "Email already exists" });
    }
    
    res.status(500).send({ status: "error", data: error.message });
  }
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});