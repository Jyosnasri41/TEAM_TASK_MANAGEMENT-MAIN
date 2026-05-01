const router = require("express").Router();
const Project = require("../models/Project");
const { auth } = require("../middleware/auth");

// ================= CREATE PROJECT (ADMIN ONLY) =================
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can create projects" });
    }

    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name required" });
    }

    const project = await Project.create({
      name,
      members
    });

    res.json(project);

  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
});

// ================= GET PROJECTS =================
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find().populate("members");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

module.exports = router;