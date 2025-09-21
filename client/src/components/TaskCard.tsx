import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  priority: "High" | "Medium" | "Low";
  status: "Incomplete" | "Complete";
  aiSuggestion?: string;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onGenerateAiSuggestion?: (taskId: string) => void;
  className?: string;
  showAiSuggestion?: boolean;
}

export default function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onGenerateAiSuggestion,
  className,
  showAiSuggestion = true
}: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async (checked: boolean) => {
    setIsCompleting(true);
    console.log(`Toggling task ${task.id} to ${checked ? 'complete' : 'incomplete'}`);
    onToggleComplete(task.id, checked);
    // Simulate API delay
    setTimeout(() => setIsCompleting(false), 500);
  };

  const handleEdit = () => {
    console.log(`Editing task ${task.id}`);
    onEdit(task.id);
  };

  const handleDelete = () => {
    console.log(`Deleting task ${task.id}`);
    onDelete(task.id);
  };

  const handleGenerateAiSuggestion = () => {
    console.log(`Generating AI suggestion for task ${task.id}`);
    onGenerateAiSuggestion?.(task.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "border-l-priority-high bg-priority-high/5";
      case "Medium": return "border-l-priority-medium bg-priority-medium/5";
      case "Low": return "border-l-priority-low bg-priority-low/5";
      default: return "border-l-muted";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-priority-high/10 text-priority-high border-priority-high/20";
      case "Medium": return "bg-priority-medium/10 text-priority-medium border-priority-medium/20";
      case "Low": return "bg-priority-low/10 text-priority-low border-priority-low/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const isOverdue = task.deadline && new Date() > task.deadline && task.status === "Incomplete";
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card 
      className={cn(
        "border-l-4 transition-all duration-200 hover-elevate",
        getPriorityColor(task.priority),
        task.status === "Complete" && "opacity-60",
        className
      )}
      data-testid={`card-task-${task.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox 
            checked={task.status === "Complete"}
            onCheckedChange={handleToggleComplete}
            disabled={isCompleting}
            className="mt-1"
            data-testid={`checkbox-task-${task.id}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium leading-none mb-1",
              task.status === "Complete" && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Badge 
            variant="outline" 
            className={cn("text-xs", getPriorityBadgeColor(task.priority))}
            data-testid={`badge-priority-${task.id}`}
          >
            {task.priority}
          </Badge>
          {task.status === "Complete" && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {task.deadline && (
            <div className={cn(
              "flex items-center text-sm",
              isOverdue ? "text-priority-high" : "text-muted-foreground"
            )}>
              {isOverdue ? (
                <AlertCircle className="w-4 h-4 mr-2" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              <span data-testid={`text-deadline-${task.id}`}>
                {isOverdue ? "Overdue: " : "Due: "}
                {formatDate(task.deadline)}
              </span>
            </div>
          )}

          {showAiSuggestion && (
            task.aiSuggestion ? (
              <div className="bg-premium/5 border border-premium/20 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-premium mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-premium mb-1">AI Suggestion</p>
                    <p className="text-sm text-muted-foreground">{task.aiSuggestion}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 border border-muted rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Get AI suggestion for this task</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateAiSuggestion}
                    className="h-6 px-2 text-xs"
                  >
                    Generate
                  </Button>
                </div>
              </div>
            )
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              Created {formatDate(task.createdAt)}
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0"
                data-testid={`button-edit-${task.id}`}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-priority-high"
                data-testid={`button-delete-${task.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}