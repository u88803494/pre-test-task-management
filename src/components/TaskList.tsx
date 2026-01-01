import React, { useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { Task } from "../types/task";

export const TaskList: React.FC = () => {
  const { tasks, deleteTask, updateTask } = useTasks();
  const [filter, setFilter] = useState<{
    status?: Task["status"];
    priority?: Task["priority"];
  }>({});

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        (!filter.status || task.status === filter.status) &&
        (!filter.priority || task.priority === filter.priority)
    );
  }, [tasks, filter]);

  const renderTaskActions = (task: Task) => {
    const handleDelete = () => {
      // Potential UX anti-pattern
      const confirmDelete = window.confirm(`Delete task "${task.title}"?`);
      if (confirmDelete) {
        deleteTask(task.id);
      }
    };

    const handleStatusChange = () => {
      const statusMap: Record<Task["status"], Task["status"]> = {
        todo: "in-progress",
        "in-progress": "done",
        done: "todo",
      };
      updateTask(task.id, { status: statusMap[task.status] });
    };

    return (
      <>
        <button
          className="border border-black rounded-md p-1"
          onClick={handleStatusChange}
        >
          Change Status
        </button>
        <button
          className="border border-black rounded-md p-1"
          onClick={handleDelete}
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <div>
      {/* 操作欄位 */}
      <h1 className="text-xl font-bold my-3">Control Panel</h1>
      <div className="flex">
        <select
          value={filter.status || ""}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              status: e.target.value as Task["status"],
            }))
          }
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filter.priority || ""}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              priority: e.target.value as Task["priority"],
            }))
          }
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      {/* task 列表 */}
      <h1 className="text-xl font-bold my-3">Task list</h1>
      <div className="flex flex-col">
        {filteredTasks.map((task) => (
          <div className="flex gap-1" key={task.id}>
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            {renderTaskActions(task)}
          </div>
        ))}
      </div>
    </div>
  );
};
