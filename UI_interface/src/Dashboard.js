import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import "./dashboard.css";

const API = "http://localhost:5000";

export default function Dashboard({ token, logout }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const [projectName, setProjectName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [userInfo, setUserInfo] = useState(null);

  // ✅ FIXED: useMemo to avoid warnings
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`
  }), [token]);

  // ================= FETCH USER =================
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/auth/me`, { headers });
      setUserInfo(res.data);
    } catch (err) {
      console.error("User fetch error", err);
    }
  }, [headers]);

  // ================= FETCH USERS =================
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/auth/users`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error("Users fetch error", err);
    }
  }, [headers]);

  // ================= FETCH TASKS =================
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`, { headers });
      setTasks(res.data);
    } catch (err) {
      console.error("Tasks fetch error", err);
    }
  }, [headers]);

  // ================= FETCH PROJECTS =================
  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/projects`, { headers });
      setProjects(res.data);
    } catch (err) {
      console.error("Projects fetch error", err);
    }
  }, [headers]);

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchUser();
    fetchUsers();
    fetchTasks();
    fetchProjects();
  }, [fetchUser, fetchUsers, fetchTasks, fetchProjects]);

  // ================= CREATE PROJECT =================
  const createProject = async () => {
    if (!projectName) return alert("Enter project name");

    try {
      await axios.post(
        `${API}/api/projects`,
        {
          name: projectName,
          members: selectedMembers
        },
        { headers }
      );

      setProjectName("");
      setSelectedMembers([]);
      fetchProjects();

    } catch (err) {
      alert(err.response?.data?.msg || "Error creating project");
    }
  };

  // ================= ADD TASK =================
  const addTask = async () => {
    if (!title || !assignedTo) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        `${API}/api/tasks`,
        {
          title,
          assignedTo,
          project: selectedProject
        },
        { headers }
      );

      setTitle("");
      setAssignedTo("");
      setSelectedProject("");
      fetchTasks();

    } catch (err) {
      alert(err.response?.data?.msg || "Error adding task");
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/tasks/${id}`,
        { status },
        { headers }
      );
      fetchTasks();
    } catch (err) {
      console.error("Update error", err);
    }
  };

  // ================= FILTER TASKS =================
  const visibleTasks =
    userInfo?.role === "admin"
      ? tasks
      : tasks.filter(t => t.assignedTo?._id === userInfo?._id);

  const pending = visibleTasks.filter(t => t.status === "pending").length;
  const completed = visibleTasks.filter(t => t.status === "done").length;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <h2>🗂️ Team Task Management System</h2>

      <p>
        Logged in as: <b>{userInfo?.name}</b>
        <span className={`role ${userInfo?.role}`}>
          {userInfo?.role}
        </span>
      </p>

      {/* STATS */}
      <div className="stats">
        <div className="stat-box pending">Pending: {pending}</div>
        <div className="stat-box completed">Completed: {completed}</div>
      </div>

      {/* ================= PROJECT SECTION ================= */}
      {userInfo?.role === "admin" && (
        <div className="project-section">
          <h3>Create Project</h3>

          <input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <select
            multiple
            onChange={(e) =>
              setSelectedMembers(
                Array.from(e.target.selectedOptions, opt => opt.value)
              )
            }
          >
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button onClick={createProject}>Create Project</button>
        </div>
      )}

      {/* ================= TASK FORM ================= */}
      {userInfo?.role === "admin" && (
        <div className="task-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Assign User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <button onClick={addTask}>Add Task</button>
        </div>
      )}

      {/* MEMBER MESSAGE */}
      {userInfo?.role !== "admin" && (
        <p style={{ textAlign: "center", color: "gray" }}>
          You can only view and update your assigned tasks.
        </p>
      )}

      {/* ================= TASK LIST ================= */}
      <div className="task-list">
        {visibleTasks.map((t) => (
          <div key={t._id} className="task-card">
            <h4>{t.title}</h4>

            <p>Assigned: {t.assignedTo?.name || "Unassigned"}</p>
            <p>Project: {t.project?.name || "No Project"}</p>

            <p className={`status ${t.status}`}>
              Status: {t.status}
            </p>

            {t.status !== "done" && (
              <button onClick={() => updateStatus(t._id, "done")}>
                ✅ Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* LOGOUT */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </div>
  );
}