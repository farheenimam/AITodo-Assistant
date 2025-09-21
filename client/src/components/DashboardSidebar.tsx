
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CheckSquare, 
  Plus, 
  Crown, 
  User, 
  Settings, 
  LogOut, 
  BarChart3,
  Calendar,
  Filter,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  avatar?: string;
}

interface DashboardSidebarProps {
  user: User;
  onCreateTask: () => void;
  onUpgrade: () => void;
  onLogout: () => void;
  onFilterChange: (filter: string) => void;
  onViewChange: (view: "tasks" | "schedule") => void;
  activeFilter: string;
  activeView: "tasks" | "schedule";
  taskCounts: {
    all: number;
    incomplete: number;
    complete: number;
    overdue: number;
  };
}

export default function DashboardSidebar({ 
  user, 
  onCreateTask, 
  onUpgrade, 
  onLogout, 
  onFilterChange,
  onViewChange,
  activeFilter,
  activeView,
  taskCounts 
}: DashboardSidebarProps) {
  const handleCreateTask = () => {
    console.log("Create task clicked");
    onCreateTask();
  };

  const handleUpgrade = () => {
    console.log("Upgrade clicked");
    onUpgrade();
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    onLogout();
  };

  const handleFilterChange = (filter: string) => {
    console.log(`Filter changed to: ${filter}`);
    onFilterChange(filter);
  };

  const handleViewChange = (view: "tasks" | "schedule") => {
    console.log(`View changed to: ${view}`);
    onViewChange(view);
  };

  const filterOptions = [
    { key: "all", label: "All Tasks", count: taskCounts.all, icon: CheckSquare },
    { key: "incomplete", label: "To Do", count: taskCounts.incomplete, icon: CheckSquare },
    { key: "complete", label: "Completed", count: taskCounts.complete, icon: CheckSquare },
    { key: "overdue", label: "Overdue", count: taskCounts.overdue, icon: CheckSquare },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <CheckSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">AI To-Do</h1>
            <p className="text-xs text-muted-foreground">Smart Task Manager</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-2 h-auto hover-elevate"
              data-testid="button-user-menu"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                    {user.isPremium && (
                      <Badge variant="outline" className="bg-premium/10 text-premium border-premium/20 text-xs px-1 flex-shrink-0">
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Create Task Button */}
      <div className="px-4 mb-4">
        <Button 
          onClick={handleCreateTask} 
          className="w-full justify-start"
          data-testid="button-create-task"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Navigation Filters */}
      <div className="flex-1 px-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-sidebar-foreground">Filters</span>
          </div>
          
          {filterOptions.map((option) => (
            <Button
              key={option.key}
              variant="ghost"
              onClick={() => handleFilterChange(option.key)}
              className={cn(
                "w-full justify-between text-left font-normal",
                activeFilter === option.key && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              data-testid={`filter-${option.key}`}
            >
              <div className="flex items-center space-x-2">
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {option.count}
              </Badge>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        {/* AI Features */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-premium" />
            <span className="text-sm font-medium text-sidebar-foreground">AI Features</span>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => handleViewChange("schedule")}
            className={cn(
              "w-full justify-start font-normal",
              activeView === "schedule" && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            data-testid="button-smart-schedule"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Smart Schedule
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => handleViewChange("tasks")}
            className={cn(
              "w-full justify-start font-normal",
              activeView === "tasks" && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            data-testid="button-task-view"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Task View
          </Button>
        </div>
      </div>

      {/* Premium Upgrade */}
      {!user.isPremium && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-premium/5 border border-premium/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="w-4 h-4 text-premium" />
              <span className="text-sm font-medium text-premium">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock unlimited AI suggestions and advanced features
            </p>
            <Button 
              onClick={handleUpgrade} 
              size="sm" 
              className="w-full bg-premium hover:bg-premium/90"
              data-testid="button-upgrade-sidebar"
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}