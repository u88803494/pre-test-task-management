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
              status: (e.target.value || undefined) as Task["status"] | undefined,
            }))
          }
          className="p-2 border rounded mr-2"
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
              priority: (e.target.value || undefined) as Task["priority"] | undefined,
            }))
          }
          className="p-2 border rounded"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      {/* task 列表 */}
      <h1 className="text-xl font-bold my-3">Task list</h1>
      <div className="flex flex-col gap-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              className="p-3 border rounded-lg flex flex-col gap-2"
              key={task.id}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <div className="flex gap-2">
                  {renderTaskActions(task)}
                </div>
              </div>
              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}
              <div className="flex gap-4 text-sm">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  Status: {task.status}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  Priority: {task.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
