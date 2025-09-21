import { authService } from "@/lib/auth";
import { API_BASE } from "../config";  // 👈 add this

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  deadline: Date | null;
  priority: "High" | "Medium" | "Low";
  status: "Incomplete" | "Complete";
  aiSuggestion: string | null;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  deadline?: Date;
  priority: "High" | "Medium" | "Low";
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = authService.getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/api/tasks`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const data = await response.json();

    return data.tasks.map((task: any) => ({
      ...task,
      deadline: task.deadline ? new Date(task.deadline) : null,
      createdAt: new Date(task.createdAt),
    }));
  }

  async createTask(taskData: TaskFormData): Promise<Task> {
    const response = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const data = await response.json();

    return {
      ...data.task,
      deadline: data.task.deadline ? new Date(data.task.deadline) : null,
      createdAt: new Date(data.task.createdAt),
    };
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    const data = await response.json();

    return {
      ...data.task,
      deadline: data.task.deadline ? new Date(data.task.deadline) : null,
      createdAt: new Date(data.task.createdAt),
    };
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    const data = await response.json();
    return data.success;
  }

  // AI Schedule operations
  async generateAiSchedule(): Promise<any> {
    const response = await fetch(`${API_BASE}/api/schedule/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Failed to generate AI schedule",
      }));
      throw new Error(error.error || "Failed to generate AI schedule");
    }

    return response.json();
  }

  // AI Suggestion operations
  async generateAiSuggestion(taskId: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/api/tasks/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ taskId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Failed to generate AI suggestion",
      }));
      throw new Error(error.error || "Failed to generate AI suggestion");
    }

    const data = await response.json();

    return {
      ...data.task,
      deadline: data.task.deadline ? new Date(data.task.deadline) : null,
      createdAt: new Date(data.task.createdAt),
    };
  }

  // Premium operations
  async activatePremium(): Promise<void> {
    const response = await fetch(`${API_BASE}/api/premium/activate`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to activate premium");
    }
  }
}

export const apiService = new ApiService();
