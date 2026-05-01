const router = require("express").Router();
const Task = require("../models/Task");
const { auth } = require("../middleware/auth");

// CREATE TASK (ADMIN ONLY)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can create tasks" });
    }

    const task = await Task.create(req.body);
    res.json(task);

  } catch (err) {
    res.status(500).json(err);
  }
});

// GET TASKS
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find().populate("assignedTo");
  res.json(tasks);
});

// UPDATE STATUS (ADMIN OR ASSIGNED USER)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    task.status = req.body.status || task.status;
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;