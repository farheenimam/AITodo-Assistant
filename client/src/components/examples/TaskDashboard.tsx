import TaskDashboard from '../TaskDashboard';
import { type Task } from '../TaskCard';

export default function TaskDashboardExample() {
  const mockUser = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    isPremium: false
  };

  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Complete quarterly presentation",
      description: "Prepare slides for Q4 review meeting with stakeholders",
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: "High",
      status: "Incomplete",
      aiSuggestion: "Consider focusing on key metrics first, then add supporting data. Schedule 2 hours for this task tomorrow morning.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      title: "Review team feedback",
      description: "Go through all team member responses from last sprint",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: "Medium", 
      status: "Incomplete",
      aiSuggestion: "This task pairs well with your 2pm meeting. Review feedback 30 minutes before the meeting.",
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
      description: "Add new API endpoints and update README",
      deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // Overdue
      priority: "Medium",
      status: "Incomplete",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  return (
    <div className="h-screen bg-background">
      <TaskDashboard
        user={mockUser}
        tasks={mockTasks}
        onCreateTask={(data: any) => console.log('Create task:', data)}
        onUpdateTask={(id: string, data: any) => console.log('Update task:', id, data)}
        onDeleteTask={(id: string) => console.log('Delete task:', id)}
        onUpgrade={() => console.log('Upgrade')}
        filter="all"
        isLoading={false}
      />
    </div>
  );
}