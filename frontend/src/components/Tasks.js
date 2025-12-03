import React, { useState, useEffect } from "react";

export default function Tasks({ token, apiUrl }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchTasks = async () => {
    const res = await fetch(`${apiUrl}/tasks?page=${page}&limit=${limit}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    setTasks(data.data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const create = async (e) => {
    e.preventDefault();
    const res = await fetch(apiUrl + "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setTitle("");
      fetchTasks();
    } else alert("Error creating");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    const res = await fetch(apiUrl + "/tasks/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) fetchTasks();
  };

  return (
    <div className="task-container">
      <form onSubmit={create}>
        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>Create</button>
      </form>

      <ul>
        {tasks.map((t) => (
          <li className="task-item" key={t._id}>
            <div className="task-text">
              <strong>{t.title}</strong> — {t.priority} — {t.status}
            </div>
            <button className="delete-btn" onClick={() => remove(t._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span> Page {page} </span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
