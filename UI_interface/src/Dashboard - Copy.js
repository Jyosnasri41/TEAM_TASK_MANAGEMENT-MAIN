import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import "./dashboard.css";

const API = "http://localhost:5000";

export default function Dashboard({ token, logout }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // Fetch user
  const fetchUser = useCallback(async () => {
    const res = await axios.get(`${API}/api/auth/me`, { headers });
    setUserInfo(res.data);
  }, [token]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    const res = await axios.get(`${API}/api/auth/users`, { headers });
    setUsers(res.data);
  }, [token]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    const res = await axios.get(`${API}/api/tasks`, { headers });
    setTasks(res.data);
  }, [token]);

  useEffect(() => {
    fetchUser();
    fetchUsers();
    fetchTasks();
  }, [fetchUser, fetchUsers, fetchTasks]);

  // Add task
  const addTask = async () => {
    if (!title || !assignedTo) return alert("Fill all fields");

    await axios.post(
      `${API}/api/tasks`,
      { title, assignedTo },
      { headers }
    );

    setTitle("");
    setAssignedTo("");
    fetchTasks();
  };

  // Update status
  const updateStatus = async (id, status) => {
    await axios.put(
      `${API}/api/tasks/${id}`,
      { status },
      { headers }
    );
    fetchTasks();
  };

  // Role-based tasks
  const visibleTasks =
    userInfo?.role === "admin"
      ? tasks
      : tasks.filter(t => t.assignedTo?._id === userInfo?._id);

  const pending = visibleTasks.filter(t => t.status === "pending").length;
  const completed = visibleTasks.filter(t => t.status === "done").length;

  return (
    <div className="dashboard">
      <h2>🚀 Team Task Management System</h2>

      <p>
        Logged in as: <b>{userInfo?.name}</b> ({userInfo?.role})
      </p>

      <p>Pending: {pending} | Completed: {completed}</p>

      {/* ADMIN */}
      {userInfo?.role === "admin" && (
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />

          <select onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Assign User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button onClick={addTask}>Add Task</button>
        </div>
      )}

      {/* TASK LIST */}
      {visibleTasks.map((t) => (
        <div key={t._id}>
          <h4>{t.title}</h4>
          <p>Assigned: {t.assignedTo?.name}</p>
          <p>Status: {t.status}</p>

          {t.status !== "done" && (
            <button onClick={() => updateStatus(t._id, "done")}>
              Mark Done
            </button>
          )}
        </div>
      ))}

      <button onClick={logout}>Logout</button>
    </div>
  );
}