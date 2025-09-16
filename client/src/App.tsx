import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthForm from "./components/AuthForm";
import DashboardSidebar from "./components/DashboardSidebar";
import TaskDashboard from "./components/TaskDashboard";
import ThemeToggle from "./components/ThemeToggle";
import { authService, type User } from "./lib/auth";
import { apiService, type Task, type TaskFormData } from "./lib/api";
import { useToast } from "@/hooks/use-toast";

// Application state management

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await authService.login(data);
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await authService.signup(data);
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast({
      title: "Google OAuth",
      description: "Google authentication coming soon!",
    });
  };

  return (
    <AuthForm
      onLogin={handleLogin}
      onSignup={handleSignup}
      onGoogleAuth={handleGoogleAuth}
      isLoading={isLoading}
    />
  );
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check if user is authenticated
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          window.location.href = "/";
          return;
        }
        
        setUser(currentUser);

        // Load tasks
        const userTasks = await apiService.getTasks();
        setTasks(userTasks);
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [toast]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      const newTask = await apiService.createTask(data);
      setTasks([newTask, ...tasks]);
      toast({
        title: "Task created",
        description: "Your task has been added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, updates);
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = async () => {
    try {
      await apiService.activatePremium();
      if (user) {
        setUser({ ...user, isPremium: true });
      }
      toast({
        title: "Premium activated!",
        description: "You now have access to unlimited AI features",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate premium",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const getTaskCounts = () => {
    const incomplete = tasks.filter(t => t.status === "Incomplete").length;
    const complete = tasks.filter(t => t.status === "Complete").length;
    const overdue = tasks.filter(t => 
      t.deadline && new Date() > t.deadline && t.status === "Incomplete"
    ).length;

    return {
      all: tasks.length,
      incomplete,
      complete,
      overdue
    };
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        user={user}
        onCreateTask={() => setActiveFilter("all")} // Reset filter when creating
        onUpgrade={handleUpgrade}
        onLogout={handleLogout}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        taskCounts={getTaskCounts()}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Welcome back, {user.name}</h2>
          </div>
          <ThemeToggle />
        </header>
        
        <TaskDashboard
          user={user}
          tasks={tasks}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onUpgrade={handleUpgrade}
          filter={activeFilter}
          isLoading={false}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;