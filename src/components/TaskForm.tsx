import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";
import type { Task } from "../types/task";

type TaskPriority = Task["priority"];

interface FormData {
  title: string;
  description: string;
  priority: TaskPriority;
}

const INITIAL_FORM_DATA: FormData = {
  title: "",
  description: "",
  priority: "medium",
};

export const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除錯誤訊息
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("請輸入任務標題");
      return false;
    }
    if (formData.title.length > 100) {
      setError("標題不能超過 100 個字元");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    addTask({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: "todo",
    });

    // 重置表單
    setFormData(INITIAL_FORM_DATA);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-3">新增任務</h2>

      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="title" className="block mb-1 font-medium">
          標題 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="輸入任務標題"
          maxLength={100}
          className="w-full p-2 border rounded"
        />
        <span className="text-sm text-gray-500">
          {formData.title.length}/100
        </span>
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="block mb-1 font-medium">
          描述
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="輸入任務描述（選填）"
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="priority" className="block mb-1 font-medium">
          優先級
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        新增任務
      </button>
    </form>
  );
};
