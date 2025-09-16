import { authService } from "@/lib/auth";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  deadline: Date | null;
  priority: "High" | "Medium" | "Low";
  status: "Incomplete" | "Complete";
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  deadline?: Date;
  priority: "High" | "Medium" | "Low";
}

class ApiService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    const response = await fetch('/api/tasks', {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return data.tasks.map((task: any) => ({
      ...task,
      deadline: task.deadline ? new Date(task.deadline) : null,
      createdAt: new Date(task.createdAt),
    }));
  }

  async createTask(taskData: TaskFormData): Promise<Task> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const data = await response.json();

    return {
      ...data.task,
      deadline: data.task.deadline ? new Date(data.task.deadline) : null,
      createdAt: new Date(data.task.createdAt),
    };
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const data = await response.json();

    return {
      ...data.task,
      deadline: data.task.deadline ? new Date(data.task.deadline) : null,
      createdAt: new Date(data.task.createdAt),
    };
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    const data = await response.json();
    return data.success;
  }

  // Premium operations
  async activatePremium(): Promise<void> {
    const response = await fetch('/api/premium/activate', {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to activate premium');
    }
  }
}

export const apiService = new ApiService();