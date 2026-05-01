const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String, required: true },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "done"],
    default: "pending"
  },

  dueDate: Date,

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", schema);