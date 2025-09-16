import DashboardSidebar from '../DashboardSidebar';

export default function DashboardSidebarExample() {
  const mockUser = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    isPremium: false,
    avatar: undefined
  };

  const mockTaskCounts = {
    all: 12,
    incomplete: 8,
    complete: 4,
    overdue: 2
  };

  return (
    <div className="h-screen bg-background flex">
      <DashboardSidebar
        user={mockUser}
        onCreateTask={() => console.log('Create task')}
        onUpgrade={() => console.log('Upgrade')}
        onLogout={() => console.log('Logout')}
        onFilterChange={(filter) => console.log('Filter:', filter)}
        activeFilter="all"
        taskCounts={mockTaskCounts}
      />
      <div className="flex-1 p-8 bg-background">
        <p className="text-muted-foreground">Main content area would be here</p>
      </div>
    </div>
  );
}