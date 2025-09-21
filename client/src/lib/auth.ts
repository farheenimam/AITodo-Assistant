import { API_BASE } from "../config"; // 👈 add this

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("authToken");
  }

  async login(credentials: LoginData): Promise<User> {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Login failed");
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;
    this.user = data.user;
    localStorage.setItem("authToken", this.token);

    return data.user;
  }

  async signup(userData: SignupData): Promise<User> {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Signup failed");
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;
    this.user = data.user;
    localStorage.setItem("authToken", this.token);

    return data.user;
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      this.user = data.user;
      return data.user;
    } catch (error) {
      // Token is invalid, clear it
      this.logout();
      return null;
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem("authToken");
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();
