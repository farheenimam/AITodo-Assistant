import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskCard, { type Task } from "./TaskCard";
import TaskForm, { type TaskFormData } from "./TaskForm";
import PremiumUpgrade from "./PremiumUpgrade";
import { 
  Search, 
  Filter, 
  SortAsc, 
  Plus, 
  Sparkles, 
  Crown,
  TrendingUp,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  avatar?: string;
}

interface TaskDashboardProps {
  user: User;
  tasks: Task[];
  onCreateTask: (data: TaskFormData) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpgrade: () => void;
  filter: string;
  isLoading?: boolean;
}

export default function TaskDashboard({
  user,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onUpgrade,
  filter,
  isLoading = false
}: TaskDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "created">("priority");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on active filter and search
  const filteredTasks = tasks.filter(task => {
    // Apply filter
    let matchesFilter = true;
    switch (filter) {
      case "incomplete":
        matchesFilter = task.status === "Incomplete";
        break;
      case "complete":
        matchesFilter = task.status === "Complete";
        break;
      case "overdue":
        matchesFilter = !!(task.deadline && new Date() > task.deadline && task.status === "Incomplete");
        break;
      default:
        matchesFilter = true;
    }

    // Apply search
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "deadline":
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.getTime() - b.deadline.getTime();
      case "created":
        return b.createdAt.getTime() - a.createdAt.getTime();
      default:
        return 0;
    }
  });

  const handleCreateTask = () => {
    console.log("Opening task creation form");
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      console.log(`Editing task: ${taskId}`);
      setEditingTask(task);
      setShowTaskForm(true);
    }
  };

  const handleTaskSubmit = (data: TaskFormData) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, data);
    } else {
      onCreateTask(data);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    onUpdateTask(taskId, { status: completed ? "Complete" : "Incomplete" });
  };

  const handleUpgradeClick = () => {
    console.log("Opening upgrade modal");
    setShowUpgrade(true);
  };

  // Calculate AI suggestions usage for free users
  const aiSuggestionsUsed = user.isPremium ? 0 : tasks.filter(t => t.aiSuggestion).length;
  const maxFreeSuggestions = 5;

  // Get task stats
  const stats = {
    total: tasks.length,
    incomplete: tasks.filter(t => t.status === "Incomplete").length,
    overdue: tasks.filter(t => t.deadline && new Date() > t.deadline && t.status === "Incomplete").length,
    completedToday: tasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.createdAt);
      return t.status === "Complete" && 
        today.toDateString() === taskDate.toDateString();
    }).length
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {filter === "all" && "All Tasks"}
              {filter === "incomplete" && "To Do"}
              {filter === "complete" && "Completed"}
              {filter === "overdue" && "Overdue Tasks"}
            </h1>
            <p className="text-muted-foreground">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {!user.isPremium && (
              <Badge 
                variant="outline" 
                className="bg-premium/10 text-premium border-premium/20 cursor-pointer hover-elevate"
                onClick={handleUpgradeClick}
                data-testid="badge-ai-usage"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI: {aiSuggestionsUsed}/{maxFreeSuggestions}
              </Badge>
            )}
            <Button onClick={handleCreateTask} data-testid="button-create-task-main">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{stats.total}</p>
          </div>
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">To Do</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{stats.incomplete}</p>
          </div>
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-priority-high" />
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
            <p className="text-2xl font-semibold mt-1 text-priority-high">{stats.overdue}</p>
          </div>
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Done Today</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{stats.completedToday}</p>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-tasks"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setSortBy(sortBy === "priority" ? "deadline" : sortBy === "deadline" ? "created" : "priority")}
            className="flex items-center space-x-2"
            data-testid="button-sort-tasks"
          >
            <SortAsc className="w-4 h-4" />
            <span>
              {sortBy === "priority" && "Priority"}
              {sortBy === "deadline" && "Deadline"}
              {sortBy === "created" && "Created"}
            </span>
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? `No tasks match your search for "${searchQuery}"`
                : "Get started by creating your first task"
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateTask} data-testid="button-create-first-task">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={onDeleteTask}
                showAiSuggestion={user.isPremium || aiSuggestionsUsed < maxFreeSuggestions}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Task Form Dialog */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleTaskSubmit}
            onCancel={() => setShowTaskForm(false)}
            initialData={editingTask || undefined}
            isEditing={!!editingTask}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Premium Upgrade Modal */}
      {showUpgrade && (
        <PremiumUpgrade
          onPaymentSuccess={(paymentData) => {
            console.log("Payment successful:", paymentData);
            setShowUpgrade(false);
            onUpgrade();
          }}
          onClose={() => setShowUpgrade(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}