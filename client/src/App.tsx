import { useState } from "react";
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
import { type Task } from "./components/TaskCard";
import { type TaskFormData } from "./components/TaskForm";

// Mock data for the prototype - todo: remove mock functionality
const mockUser = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  isPremium: false,
  avatar: undefined
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete quarterly presentation",
    description: "Prepare slides for Q4 review meeting with stakeholders and include key performance metrics",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: "High",
    status: "Incomplete",
    aiSuggestion: "Consider focusing on key metrics first, then add supporting data. Schedule 2 hours for this task tomorrow morning when you're most productive.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    title: "Review team feedback",
    description: "Go through all team member responses from last sprint retrospective",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: "Medium",
    status: "Incomplete",
    aiSuggestion: "This task pairs well with your 2pm meeting. Review feedback 30 minutes before the meeting to prepare talking points.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "3",
    title: "Buy groceries",
    priority: "Low",
    status: "Complete",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "4",
    title: "Update project documentation",
    description: "Add new API endpoints and update README with installation instructions",
    deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // Overdue
    priority: "Medium",
    status: "Incomplete",
    aiSuggestion: "This is overdue! Block 1 hour this afternoon to catch up. Start with the README updates as they're quickest.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: "5",
    title: "Schedule dentist appointment",
    priority: "Low",
    status: "Incomplete",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: "6",
    title: "Prepare for client meeting",
    description: "Review contract terms and prepare presentation materials",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: "High",
    status: "Incomplete",
    aiSuggestion: "High priority task with good lead time. Schedule this for tomorrow morning after the quarterly presentation work.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    // Redirect to dashboard after authentication
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <AuthForm
      onLogin={(data) => {
        console.log("Login:", data);
        setIsAuthenticated(true);
      }}
      onSignup={(data) => {
        console.log("Signup:", data);
        setIsAuthenticated(true);
      }}
      onGoogleAuth={() => {
        console.log("Google auth");
        setIsAuthenticated(true);
      }}
      isLoading={false}
    />
  );
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [user, setUser] = useState(mockUser);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      priority: data.priority,
      status: "Incomplete",
      createdAt: new Date(),
      // Add AI suggestion for new tasks if user has remaining suggestions
      aiSuggestion: !user.isPremium && tasks.filter(t => t.aiSuggestion).length >= 5 
        ? undefined 
        : "AI will analyze this task and provide optimization suggestions shortly."
    };
    setTasks([newTask, ...tasks]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleUpgrade = () => {
    setUser({ ...user, isPremium: true });
  };

  const handleLogout = () => {
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