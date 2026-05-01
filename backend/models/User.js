const mongoose = require("mongoose"); // ✅ ADD THIS

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin","member"], default: "member" }
});

module.exports = mongoose.model("User", schema);