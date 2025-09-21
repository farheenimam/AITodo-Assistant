import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  priority: "High" | "Medium" | "Low";
  status: "Incomplete" | "Complete";
  aiSuggestion?: string;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

interface ScheduleItem {
  id: string;
  taskId: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  estimatedDuration: string;
  suggestedTime: string;
  reasoning: string;
  deadline?: Date;
}

interface SmartScheduleProps {
  user: User;
  tasks: Task[];
  onClose?: () => void;
}

export default function SmartSchedule({ user, tasks, onClose }: SmartScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const { toast } = useToast();

  // Filter incomplete tasks for scheduling
  const incompleteTasks = tasks.filter(task => task.status === "Incomplete");

  useEffect(() => {
    if (incompleteTasks.length > 0) {
      generateSmartSchedule();
    }
  }, []);

  const generateSmartSchedule = async () => {
    if (incompleteTasks.length === 0) {
      toast({
        title: "No tasks to schedule",
        description: "Create some tasks first to generate a smart schedule",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Call AI API to generate schedule
      console.log("Calling AI service to generate schedule...");
      const response = await apiService.generateAiSchedule();
      console.log("AI service response:", response);
      
      // Convert AI response to schedule items
      const scheduleItems: ScheduleItem[] = response.schedule.map((item: any, index: number) => {
        // Find matching task
        const matchingTask = incompleteTasks.find(task => 
          task.title.toLowerCase().includes(item.taskTitle.toLowerCase()) ||
          item.taskTitle.toLowerCase().includes(task.title.toLowerCase())
        ) || incompleteTasks[index];

        return {
          id: `schedule-${matchingTask?.id || index}`,
          taskId: matchingTask?.id || `unknown-${index}`,
          title: item.taskTitle || matchingTask?.title || "Unknown Task",
          priority: item.priority || matchingTask?.priority || "Medium",
          estimatedDuration: item.estimatedDuration || "2 hours",
          suggestedTime: item.suggestedTimeSlot || `${9 + (index * 2)}:00 - ${11 + (index * 2)}:00`,
          reasoning: item.reasoning || "AI-optimized scheduling based on priority and deadlines",
          deadline: matchingTask?.deadline,
        };
      });

      setSchedule(scheduleItems);
      setLastGenerated(new Date());
      
      toast({
        title: "Smart schedule generated!",
        description: `AI has optimized ${scheduleItems.length} tasks for maximum productivity`,
      });
    } catch (error) {
      console.error("Schedule generation error:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      
      // Fallback to local scheduling if AI fails
      const fallbackSchedule: ScheduleItem[] = incompleteTasks
        .sort((a, b) => {
          const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          if (priorityDiff !== 0) return priorityDiff;
          
          if (a.deadline && b.deadline) {
            return a.deadline.getTime() - b.deadline.getTime();
          }
          if (a.deadline) return -1;
          if (b.deadline) return 1;
          return 0;
        })
        .map((task, index) => ({
          id: `schedule-${task.id}`,
          taskId: task.id,
          title: task.title,
          priority: task.priority,
          estimatedDuration: "2 hours",
          suggestedTime: `${9 + (index * 2)}:00 - ${11 + (index * 2)}:00`,
          reasoning: `${task.priority} priority task scheduled based on deadline and importance`,
          deadline: task.deadline,
        }));

      setSchedule(fallbackSchedule);
      setLastGenerated(new Date());
      
      toast({
        title: "Schedule generated (offline mode)",
        description: "Using local optimization since AI service is unavailable",
        variant: "default",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "Low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getScheduleStats = () => {
    const totalTasks = schedule.length;
    const highPriority = schedule.filter(item => item.priority === "High").length;
    const withDeadlines = schedule.filter(item => item.deadline).length;
    const estimatedHours = totalTasks * 2; // 2 hours per task

    return { totalTasks, highPriority, withDeadlines, estimatedHours };
  };

  const stats = getScheduleStats();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-premium/10 p-2 rounded-lg">
              <Brain className="w-5 h-5 text-premium" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Smart Schedule</h1>
              <p className="text-muted-foreground">AI-optimized daily routine for maximum productivity</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!user.isPremium && (
              <Badge variant="outline" className="bg-premium/10 text-premium border-premium/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            )}
            <Button 
              onClick={generateSmartSchedule} 
              disabled={isGenerating}
              variant="outline"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isGenerating && "animate-spin")} />
              {isGenerating ? "Generating..." : "Regenerate"}
            </Button>
            {onClose && (
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tasks</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{stats.totalTasks}</p>
          </div>
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">High Priority</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{stats.highPriority}</p>
          </div>
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Est. Hours</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{stats.estimatedHours}h</p>
          </div>
          <div className="bg-card p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Deadlines</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{stats.withDeadlines}</p>
          </div>
        </div>

        {lastGenerated && (
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {lastGenerated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Schedule Content */}
      <ScrollArea className="flex-1 p-6">
        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Generating Smart Schedule</h3>
              <p className="text-muted-foreground">AI is analyzing your tasks and optimizing your day...</p>
            </div>
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Schedule Generated</h3>
            <p className="text-muted-foreground mb-4">
              {incompleteTasks.length === 0 
                ? "Create some tasks first to generate a smart schedule"
                : "Click 'Generate' to create an AI-optimized schedule"
              }
            </p>
            {incompleteTasks.length > 0 && (
              <Button onClick={generateSmartSchedule}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Schedule
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-premium" />
              <h2 className="text-lg font-semibold">AI Suggestions</h2>
            </div>
            
            <div className="bg-premium/5 border border-premium/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-premium mb-2">Daily Routine Optimization</h3>
              <p className="text-sm text-muted-foreground">
                AI has analyzed your tasks and suggests this schedule based on deadlines, priorities, and optimal productivity patterns. 
                High-priority tasks are scheduled during peak focus hours (9-11 AM), while routine tasks are placed in afternoon slots.
              </p>
            </div>

            {schedule.map((item, index) => (
              <Card key={item.id} className="border-l-4 border-l-premium">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPriorityColor(item.priority))}
                        >
                          {item.priority} Priority
                        </Badge>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{item.estimatedDuration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{item.suggestedTime}</span>
                      </div>
                      {item.deadline && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {item.deadline.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-muted/50 rounded-md p-3">
                    <div className="flex items-start space-x-2">
                      <Brain className="w-4 h-4 text-premium mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-premium mb-1">AI Reasoning</p>
                        <p className="text-sm text-muted-foreground">{item.reasoning}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Separator className="my-6" />
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-green-800">Productivity Tips</h3>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Take 15-minute breaks between tasks to maintain focus</li>
                <li>• Start with high-priority items when your energy is highest</li>
                <li>• Use time-blocking to minimize context switching</li>
                <li>• Review and adjust your schedule as needed throughout the day</li>
              </ul>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}